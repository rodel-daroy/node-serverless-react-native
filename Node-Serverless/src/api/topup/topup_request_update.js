const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');
const ViewHelper = require('../../helpers/view-helper');

/**
 * @swagger
 * tags:
 *   name: Top up
 * /topup-request-update:
 *   post:
 *     tags:
 *       - Top up
 *     summary: User confirm or cancel top up request
 *     description: User confirm or cancel top up request
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the contract table that received from the top up request api
 *              action:
 *                type: string
 *                required: true
 *                description: the user action for the topup request, value can be "confirmed" or "cancelled"
 *            example:
 *              id: 1,
 *              action: confirmed
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the client secret of the payment intent
 */
module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let action = ApiHelper.getObjectValue(requestBody, 'action', '');
  let userId = await UserHelper.checkUserAccessToken(request);
  userId = 86;
  if (userId > 0) {
    if (action === 'cancelled') {
      await DbHelper.dbUpdate('contract', { id }, { status: action });
      statusCode = 200;
      message = 'Successfully cancelled';
    } else {
      let contractRow = await DbHelper.query(`SELECT * FROM contract WHERE id = :id`, { id }, 1);
      if (contractRow.status === 'completed') {
        statusCode = 200;
        message = 'This contract is ' + contractRow.status;
      } else {
        try {
          let paymentresult = false;
          let paymentIntent;
          let paymentMethodId = contractRow.payment_method_id;
          let chargeAmount = paymentMethodId === 'iap' ? contractRow.amount : contractRow.amount + contractRow.fee_total;
          let currencyCode = contractRow.currency;
          let requestedLtc = paymentMethodId === 'iap' ? contractRow.amount : parseFloat(contractRow.amount / contractRow.conversion).toFixed(6);

          if (paymentMethodId === 'iap') {
            paymentresult = true;
          } else {
            let userRow = await DbHelper.query('SELECT * FROM users WHERE id = :userId', { userId }, 1);
            let userStripeCustomerRow = await DbHelper.query('SELECT * FROM user_stripe_customer WHERE user_id = :userId', { userId }, 1);
            if (userStripeCustomerRow) {
              paymentIntent = await StripeHelper.createPaymentIntent(paymentMethodId, chargeAmount, currencyCode, userStripeCustomerRow.stripe_customer_id, userRow.email);
            } else {
              let stripeCustomer = await StripeHelper.createStripeCustomer(userRow.email);
              await DbHelper.dbInsert('user_stripe_customer', { user_id: userId, stripe_customer_id: stripeCustomer.id });
              paymentIntent = await StripeHelper.createPaymentIntent(paymentMethodId, chargeAmount, currencyCode, stripeCustomer.id, userRow.email);
            }
            paymentresult = paymentIntent['status'] === 'succeeded' && true;
          }

          if (paymentresult) {
            if (paymentMethodId === 'iap') {
              let userWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: userId.toString() }, {});
              let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: '9', address: userWalletAddress, amount: requestedLtc, comment: 'Top up', comment_to: 'Top up' }, {});
              let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});

              await DbHelper.dbInsert('transaction_history', {
                transaction_id: transactionId,
                sender_id: await CryptoHelper.encrypt('9'),
                receiver_id: await CryptoHelper.encrypt(userId.toString()),
                comment: 'Top up',
              });
              await DbHelper.dbUpdate(
                'contract',
                { id },
                {
                  transaction_id: transactionId,
                  transaction_detail: ApiHelper.jsonEncode(transactionDetail),
                  final_amount: chargeAmount,
                  final_amount_ltc: chargeAmount,
                  status: 'completed',
                }
              );
            } else {
              let userWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: userId.toString() }, {});
              let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: '9', address: userWalletAddress, amount: requestedLtc, comment: 'Top up', comment_to: 'Top up' }, {});
              let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});

              await DbHelper.dbInsert('transaction_history', {
                transaction_id: transactionId,
                sender_id: await CryptoHelper.encrypt('9'),
                receiver_id: await CryptoHelper.encrypt(userId.toString()),
                comment: 'Top up',
              });
              await DbHelper.dbUpdate(
                'contract',
                { id },
                {
                  transaction_id: transactionId,
                  transaction_detail: ApiHelper.jsonEncode(transactionDetail),
                  final_amount: chargeAmount,
                  final_amount_ltc: requestedLtc,
                  status: 'completed',
                }
              );
            }
            let { amount } = contractRow;
            let currency = currencyCode;

            let userProfileRow = await DbHelper.query(`SELECT up.full_name, u.email FROM users u INNER JOIN user_profiles up  ON up.user_id = u.id WHERE u.id = :userId`, { userId }, 1);
            let fullName = userProfileRow.full_name;
            let adminEmails = ['anehzat@eronka.com', 'ben@eronka.com'];
            let toEmails = adminEmails.push(userProfileRow.email);
            let subject = `“${fullName}” has topped up ${amount} ${currency}`;
            let msgBody = ViewHelper.topUp({ fullName, amount, currency });

            await ApiHelper.sendMail(toEmails, subject, msgBody);

            let clientSecret = paymentMethodId === 'iap' ? '' : paymentIntent.client_secret;

            statusCode = 200;
            message = 'Success';
            data = { clientSecret };
          } else {
            await DbHelper.dbUpdate('contract', { id }, { status: 'paymentFailed' });
            statusCode = 400;
            message = 'paymentFailed';
            data = { clientSecret };
          }
        } catch (e) {
          statusCode = 406;
          message = e.message;
        }
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }
  return ApiHelper.apiResponse(statusCode, message, data);
};
