const DbHelper = require('./db-helper');
const StripeHelper = require("./stripe-helper");


exports.getPaymentMethodsForUser = async (userId, includeNonActive = false) => {

  let sql = 'SELECT id, payment_method_id FROM user_payment_method WHERE user_id = :userId';
  let params = { userId: userId };
  if (!includeNonActive) {
    sql += " AND status = :status";
    params.status = "active";
  }

  let data = await DbHelper.query(sql, params);
  let tempCard = {};

  for (const pm of data) {
    try {
      tempCard = await StripeHelper.retrieveAPaymentMethod(pm.payment_method_id);
      pm.card = {
        brand: tempCard.card.brand,
        exp_month: tempCard.card.exp_month,
        exp_year: tempCard.card.exp_year,
        last4: tempCard.card.last4,
      }
    } catch (e) {
      pm.status = "cardNotFoundError";
    }
  }
  return data;
}

exports.addPaymentMethodToUser = async (paymentMethodId, userId) => {

  let exist = await DbHelper.query('SELECT id FROM user_payment_method WHERE payment_method_id=:paymentMethodId AND user_id=:userId', { paymentMethodId: paymentMethodId, userId: userId });

  if (exist.length !== 0)
    throw new Error("paymentmethod alraedy exists");

  try {
    await StripeHelper.retrieveAPaymentMethod(paymentMethodId); // check if the payment method exist in Stripe, if not, it will throw error
    return await DbHelper.dbInsert('user_payment_method', { user_id: userId, payment_method_id: paymentMethodId, status: "active", created_date: new Date() });
  } catch (e) {
    throw new Error("Stripe could not recognise the payment method id");
  }
}
