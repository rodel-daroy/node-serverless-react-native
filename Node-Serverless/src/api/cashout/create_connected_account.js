const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let errors = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    let stripeConnectedAccountRow = await DbHelper.query('SELECT * FROM stripe_connected_account WHERE user_id = :userId', { userId }, 1);
    if (stripeConnectedAccountRow) {
      statusCode = 200;
      message = 'Stripe connected account exists';
      data = await StripeHelper.getAccount(stripeConnectedAccountRow['account_id']);
    } else {

      try {
        let userRow = await DbHelper.query('SELECT u.email, up.country FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = :userId', { userId }, 1);

        let countryName = userRow['country'].charAt(0).toUpperCase() + userRow['country'].slice(1);

        let countryCodeResponse = await ApiHelper.apiGet('https://restcountries.eu/rest/v2/name/' + countryName);

        let countryCode = countryCodeResponse[0] ? countryCodeResponse[0].alpha2Code : 'AU';

        let accountObject = {
          type: 'custom',
          country: countryCode,
          email: userRow['email'],
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual'
        };
        let connectedAccount = await StripeHelper.createAccount(accountObject);

        let updateAccount = await StripeHelper.updateAccount(connectedAccount.id);

        let accountLink = await StripeHelper.accountLinks(connectedAccount.id, 'https://connect.stripe.com/example/refresh', 'https://connect.stripe.com/example/return', 'account_onboarding');

        await DbHelper.dbInsert('stripe_connected_account', {
          user_id: userId,
          type: accountObject.type,
          country: accountObject.country,
          email: accountObject.email,
          account_id: connectedAccount.id
        });

        statusCode = 200;
        message = 'Successfully created';
        data = { link: accountLink.url };
      } catch (e) {
        errors['code'] = e.raw.code;
        errors['message'] = e.raw.message;
        statusCode = 400;
        message = 'Stripe connection account create failed'
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};