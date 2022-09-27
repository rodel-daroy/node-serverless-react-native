const ApiHelper = require('../helpers/api-helper');

module.exports.get = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'maintenance':
      response = require('./system/maintenance').get(request);
      break;
    case 'all-post':
      response = require('./post/api_all_post').get(request);
      break;
    case 'bank-account':
      response = require('./bank-account/get-bank-account').get(request);
      break;
    case 'category':
      response = require('./category/api_category').get(request);
      break;
    case 'filter-people':
      response = require('./filter_people/api_filter_people').get(request);
      break;
    case 'gen':
      response = require('./gen/api_gen').get(request);
      break;
    case 'myprofile':
      response = require('./profile/api_myprofile').get(request);
      break;
    case 'notification':
      response = require('./notification/api_notification').get(request);
      break;
    case 'passbase':
      response = require('./passbase/index').get(request);
      break;
    case 'supported-currency':
      response = require('./payment-method/get-supported-currency').get(request);
      break;
    case 'payment-methods':
      response = require('./payment-method/get-payment-methods').get(request);
      break;
    case 'post':
      response = require('./post/api_post').get(request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money').get(request);
      break;
    case 'sitemap':
      response = require('./sitemap/api_all_post').get(request);
      break;
    case 'stripe-connected-account':
      response = require('./cashout/get_connected_account').get(request);
      break;
    case 'stripe-connected-account-link':
      response = require('./cashout/get_connected_account_link').get(request);
      break;
    case 'stripe-customer-id':
      response = require('./topup/get_stripe_customer_id').get(request);
      break;
    case 'synz':
      response = require('./synz/api_synz').get(request);
      break;
    case 'transaction':
      response = require('./transaction/api_transaction').get(request);
      break;
    case 'transaction-detail':
      response = require('./transaction/api_transaction_detail').get(request);
      break;
    case 'user':
      response = require('./user/api_user').get(request);
      break;
    case 'user-verification':
      response = require('./user/api_user_account').get(request);
      break;
    case 'verification-request':
      response = require('./user_verification_request/api_user_verification_request').get(request);
      break;
    case 'wallet':
      response = require('./wallet/get-wallet').get(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.post = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};
  switch (object) {
    case 'bank-account':
      response = require('./bank-account/save-bank-account').post(request);
      break;
    case 'code':
      response = require('./code/api_code').post(request);
      break;
    case 'comment':
      response = require('./comment/api_comment').post(request);
      break;
    case 'contact':
      response = require('./contact/api_contact').post(request);
      break;
    case 'file':
      response = require('./file/api_file').post(request);
      break;
    case 'gets3uploadurl':
      response = require('./getS3UploadUrl/api_getS3UploadUrl').post(request);
      break;
    case 'login':
      response = require('./login/api_login').post(request);
      break;
    case 'login-by-social':
      response = require('./login-by-social/api_login_by_social').post(request);
      break;
    case 'logout':
      response = require('./logout/api_logout').post(request);
      break;
    case 'notification':
      response = require('./notification/api_notification').post(request);
      break;
    case 'nsfw':
      response = require('./nsfw/api_nsfw').post(request);
      break;
    case 'passbase':
      response = require('./passbase/index').post(request);
      break;
    case 'cashout-request':
      response = require('./cashout/cashout_request').post(request);
      break;
    case 'cashout-request-update':
      response = require('./cashout/cashout_request_update').post(request);
      break;
    case 'payment-method':
      response = require('./payment-method/save-payment-method').post(request);
      break;
    case 'post':
      response = require('./post/api_post').post(request);
      break;
    case 'share-post-count':
      response = require('./post/api_post_share_count').post(request);
      break;
    case '_post':
      response = require('./post/api_post').post(request);
      break;
    case 'post-tag':
      response = require('./post/api_post').postTag(request);
      break;
    case 'reddit':
      response = require('./reddit/api_reddit').post(request);
      break;
    case 'register':
      response = require('./register/api_register').post(request);
      break;
    case 'report':
      response = require('./report/api_report').post(request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money').post(request);
      break;
    case 'sendbird':
      response = require('./sendbird/api_sendbird').post(request);
      break;
    case 'send-ltc':
      response = require('./send_ltc/api_send_ltc').post(request);
      break;
    case 'send-money':
      response = require('./send_money/api_send_money').post(request);
      break;
    case 'stripe-connected-account':
      response = require('./cashout/create_connected_account').post(request);
      break;
    case 'stripe-customer':
      response = require('./topup/create_stripe_customer').post(request);
      break;
    case 'stripe-external-account':
      response = require('./cashout/create_external_account').post(request);
      break;
    case 'sync-labels':
      response = require('./file/syncLabelsFromES').post(request);
      break;
    case 'topup-request':
      response = require('./topup/topup_request').post(request);
      break;
    case 'topup-request-update':
      response = require('./topup/topup_request_update').post(request);
      break;
    case 'verification-request':
      response = require('./user_verification_request/api_user_verification_request').post(request);
      break;
    case 'promotion-invitation':
      response = require('./promotion/promotion_invitation').post(request);
      break;
    case 'validate-promotion-code':
      response = require('./promotion/validate_promotion_code').post(request);
      break;
    case 'vote':
      response = require('./vote/api_vote').post(request);
      break;
    case 'vote-character':
      response = require('./vote-character/api_vote_character').post(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.put = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'post':
      response = require('./post/api_post_detail').put(request);
      break;
    case 'bank-account':
      response = require('./bank-account/update-bank-account').put(request);
      break;
    case 'notification':
      response = require('./notification/api_notification').put(request);
      break;
    case 'payment-method':
      response = require('./payment-method/update-payment-method').put(request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money').put(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found! PUT', {});
      break;
  }

  return response;
};

module.exports.patch = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'report':
      response = require('./report/api_report').patch(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found! PATCH', {});
      break;
  }

  return response;
};

module.exports.delete = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'bank-account':
      response = require('./bank-account/delete-bank-account').delete(request);
      break;
    case 'notification':
      response = require('./notification/api_notification').delete(request);
      break;
    case 'payment-method':
      response = require('./payment-method/delete-payment-method').delete(request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money').delete(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found! DELELE', {});
      break;
  }

  return response;
};
