const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let base64 = ApiHelper.getObjectValue(requestBody, 'base64', '');

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0 && id == userId) {
    statusCode = 200;
    message = 'Success';
    data = await UserHelper.updateUserAvatar(userId, base64);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};