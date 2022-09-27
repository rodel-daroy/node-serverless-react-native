const ApiHelper = require('../helpers/api-helper');

module.exports.get = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'page':
      response = require('./page/api_page_detail').get(id, request);
      break;
    case 'post':
      response = require('./post/api_post_detail').get(id, request);
      break;
    case 'profile':
      response = require('./profile/api_profile_detail').get(id, request);
      break;
    case 'transaction':
      response = require('./transaction/api_transaction_detail').get(id, request);
      break;
    case 'post-rewards':
      response = require('./reward/post_rewards').get(id, request);
      break;
    case 'user':
      response = require('./user/api_user_detail').get(id, request);
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
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'media':
      response = require('./media/api_media_detail').post(id, request);
      break;
    case 'post':
      response = require('./post/api_post_detail').post(id, request);
      break;
    case 'send-money':
      response = require('./send_money/api_send_money_detail').post(id, request);
      break;
    case 'user':
      response = require('./user/api_user_detail').put(id, request);
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
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'post':
      response = require('./post/api_post_detail').put(id, request);
      break;
    case 'comment':
      response = require('./comment/api_comment_detail').put(id, request);
      break;
    case 'notification':
      response = require('./notification/api_notification_detail').put(id, request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money_detail').put(id, request);
      break;
    case 'user':
      response = require('./user/api_user_detail').put(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.delete = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'comment':
      response = require('./comment/api_comment_detail').delete(id, request);
      break;
    case 'notification':
      response = require('./notification/api_notification_detail').delete(id, request);
      break;
    case 'post':
      response = require('./post/api_post_detail').delete(id, request);
      break;
    case 'request-money':
      response = require('./request-money/api_request_money_detail').delete(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};
