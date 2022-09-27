const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Top up
 * /stripe-customer-id:
 *   get:
 *     tags:
 *       - Top up
 *     summary: Get stripe customer id of the user
 *     description: Get stripe customer id of the user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return stripe customer id of the user
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    let userStripeCustomerRow = await DbHelper.query('SELECT * FROM user_stripe_customer WHERE user_id = :userId', { userId }, 1);
    if (userStripeCustomerRow) {
      data = { stripeCustomerId: userStripeCustomerRow['stripe_customer_id'] };
    } else {
      let userRow = await DbHelper.query('SELECT * FROM users WHERE id = :userId', { userId }, 1);
      let stripeCustomer = await StripeHelper.createStripeCustomer(userRow.email);
      await DbHelper.dbInsert('user_stripe_customer', { user_id: userId, stripe_customer_id: stripeCustomer.id });
      data = { stripeCustomerId: stripeCustomer.id };
    }

    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
