const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    await DbHelper.dbUpdate('user_notifications', { user_id: userId, id }, { status: 'read' });
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.delete = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    await DbHelper.dbUpdate('user_notifications', { user_id: userId, id }, { status: 'deleted' });
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};