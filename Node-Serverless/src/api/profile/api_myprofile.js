const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await UserHelper.getMyProfile(userId);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};