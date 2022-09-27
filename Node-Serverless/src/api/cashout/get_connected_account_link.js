const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    statusCode = 200;

    let stripeConnectedAccountRow = await DbHelper.query('SELECT * FROM stripe_connected_account WHERE user_id = :userId', { userId }, 1);
    if (stripeConnectedAccountRow) {

      let accountLink = await StripeHelper.accountLinks(stripeConnectedAccountRow['account_id'], 'https://connect.stripe.com/example/refresh', 'https://connect.stripe.com/example/return', 'account_onboarding');

      message = 'Stripe connected account link';
      data = { link: accountLink.url };
    } else {
      message = 'Stripe connected account doesn\'t exist';
      data = null;
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};