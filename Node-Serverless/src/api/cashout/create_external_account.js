const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let type = ApiHelper.getObjectValue(requestBody, 'type', 'bank');
  let object = ApiHelper.getObjectValue(requestBody, 'object', {});

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    let stripeConnectedAccountRow = await DbHelper.query('SELECT * FROM stripe_connected_account WHERE user_id = :userId', { userId }, 1);
    if (stripeConnectedAccountRow) {

      if (type = 'bank') {

        let bankToken = await StripeHelper.bankToken(object);
        await StripeHelper.createExternalAccount(stripeConnectedAccountRow['account_id'], bankToken.id, type);
        await DbHelper.dbUpdate('stripe_connected_account', { user_id: userId }, { bank_id: bankToken.id });
      }

      statusCode = 200;
      message = 'Successfully created';
    } else {
      statusCode = 400;
      message = 'Stripe connected account doesn\'t exist';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};