const webhookHelper = require('./webhookController');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const UserHelper = require('../../helpers/user-helper');
const ViewHelper = require('../../helpers/view-helper');


module.exports.post = async (request) => {

  let webhook = ApiHelper.parseJson(webhookHelper.decryptWebhookIfNeeded(request));
  console.log('passbase webhook =====>', webhook);
  let response = {};

  switch (webhook.event) {
    case 'VERIFICATION_COMPLETED':
      await UserHelper.userVerificationCompleted(webhook.key);
      response = ApiHelper.apiResponse(200, 'VERIFICATION_COMPLETED', {});
      break;
    case 'VERIFICATION_REVIEWED':
      if (webhook.status == 'approved') {
        await UserHelper.userVerificationReviewed(webhook.key, 1);
        let userPassbaseVerificationRow = await DbHelper.query('SELECT user_id FROM user_passbase_verification WHERE passbase_key = :passbaseKey', { passbaseKey: webhook.key }, 1);
        let userId = userPassbaseVerificationRow['user_id'];
        await UserHelper.userStripeCustomer(userId);
        let userRow = await DbHelper.query('SELECT u.id, u.email, u.status, upv.passbase_key FROM user_passbase_verification upv LEFT JOIN users u ON u.id = upv.user_id WHERE upv.passbase_key = :passbaseKey', { passbaseKey: webhook.key }, 1);
        if (userRow) {
          let emailBody = ViewHelper.passbaseApproved();
          await ApiHelper.sendMail(userRow['email'], '', emailBody);
        }
      } else {
        await UserHelper.userVerificationReviewed(webhook.key, 2);
        let userRow = await DbHelper.query('SELECT u.id, u.email, u.status, upv.passbase_key FROM user_passbase_verification upv LEFT JOIN users u ON u.id = upv.user_id WHERE upv.passbase_key = :passbaseKey', { passbaseKey: webhook.key }, 1);
        if (userRow) {
          let emailBody = ViewHelper.passbaseDeclined();
          await ApiHelper.sendMail(userRow['email'], '', emailBody);
        }
      }
      response = ApiHelper.apiResponse(200, 'VERIFICATION_REVIEWED', {});
      break;
    default:
      console.log('Couldn\'t process webhook event =====>', webhook.event);
  }

  return response;
};

module.exports.get = async () => {

  let userRow = await DbHelper.query('SELECT u.id, u.email, u.status, upv.passbase_key FROM user_passbase_verification upv LEFT JOIN users u ON u.id = upv.user_id WHERE upv.passbase_key = :passbaseKey', { passbaseKey: '43b4290a-9d03-4b91-ad26-7aed475ef056' }, 1);

  return ApiHelper.apiResponse(200, '', {}, {});
};