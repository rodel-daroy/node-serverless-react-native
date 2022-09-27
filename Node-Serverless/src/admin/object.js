const ApiHelper = require('../helpers/api-helper');

module.exports.get = async (request) => {
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'apilogs':
      response = require('./logs/get-apiLogs').get(request);
      break;
    case 'cashout-requests':
      response = require('./contract/get_cashout_requests').get(request);
      break;
    case 'get-contract':
      response = require('./contract/get_contracts').get(request);
      break;
    case 'dashboard':
      response = require('./dashboard/get-dashboard').get(request);
      break;
    case 'edmtemplates':
      response = require('./edmTemplates/get-edmTemplates').get(request);
      break;
    case 'eslogs':
      response = require('./logs/get-esLogs').get(request);
      break;
    case 'notificationlogs':
      response = require('./logs/get-notificationLogs').get(request);
      break;
    case 'pages':
      response = require('./page/get-pages').get(request);
      break;
    case 'posts':
      response = require('./post/get-posts').get(request);
      break;
    case 'reports':
      response = require('./userAction/get-reports').get(request);
      break;
    case 'sendbirdlogs':
      response = require('./logs/get-sendbirdLogs').get(request);
      break;
    case 'transactions':
      response = require('./transaction/get-transactions').get(request);
      break;
    case 'user_verification':
      response = require('./' + object + '/admin_' + object).get(request);
      break;
    case 'useractions':
      response = require('./userAction/get-userActions').get(request);
      break;
    case 'users':
      response = require('./user/get-users').get(request);
      break;
    case 'wallets':
      response = require('./wallet/get-wallets').get(request);
      break;
    case 'labels':
      response = require('./setting/labels').get(request);
      break;
    case 'promotion-list':
      response = require('./promotion/get_promotion').get(request);
      break;
    case 'promotion-invitation-list':
      response = require('./promotion/get_promotion_invitation').get(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.post = async (request) => {
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'login':
      response = require('./auth/login').post(request);
      break;
    case 'code':
      response = require('./auth/code').post(request);
      break;
    case 'eighteen-over':
      response = require('./setting/eighteenOver').post(request);
      break;
    case 'nsfw':
      response = require('./setting/nsfw').post(request);
      break;
    case 'update-pending-cashout-request':
      response = require('./contract/update_pending_cashout_request').post(request);
      break;
    case 'create-promotion':
      response = require('./promotion/create_promotion').post(request);
      break;
    case 'update-promotion':
      response = require('./promotion/update_promotion').post(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.put = async (request) => {
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  object = object.toLowerCase();
  let response = {};

  switch (object) {
    case 'user_verification':
      response = require('./user_verification/admin_user_verification').put(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.cronjob = async () => {
  let response = require('./cronjob/cronjob').cronjob();
  return response;
};

module.exports.cronjob1 = async () => {
  let response = require('./cronjob/cronjob').cronjob1();
  return response;
};
