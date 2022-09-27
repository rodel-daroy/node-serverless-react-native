const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';

  let requestBody = ApiHelper.getRequestRawData(request);
  let passbaseKey = ApiHelper.getObjectValue(requestBody, 'passbase_key', '');
  let userId = await UserHelper.checkUserAccessToken(request);

  if (userId > 0) {
    await UserHelper.userVerificationFinished(passbaseKey, userId);
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, {});
};

module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data;

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await UserHelper.userVerificationStatus(userId);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};