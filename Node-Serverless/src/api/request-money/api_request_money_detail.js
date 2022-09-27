const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let result = await DbHelper.dbUpdate('user_money_request_details', { id, user_id: userId, status: 'new' }, { status: 'done' });
    if (result['affectedRows'] > 0) {
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 400;
      message = 'Nothing!';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.delete = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let result = await DbHelper.dbUpdate('user_money_request_details', { id, user_id: userId }, { status: 'deleted' });
    if (result['affectedRows'] > 0) {
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 400;
      message = 'Nothing!';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
