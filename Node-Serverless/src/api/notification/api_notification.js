const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const NotificationHelper = require('../../helpers/notification-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};
  let list;

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let from = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'from', 0));
  let limit = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'limit', 10));

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    list = await NotificationHelper.getNotifications(userId, from, limit);
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  data['from'] = from;
  data['limit'] = limit;
  data['next'] = from + limit;
  data['list'] = list;

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.put = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    await DbHelper.dbUpdate('user_notifications', { user_id: userId, status: 'new' }, { status: 'read' });
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.delete = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    await DbHelper.dbUpdate('user_notifications', { user_id: userId }, { status: 'deleted' });
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};