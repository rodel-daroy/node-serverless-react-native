const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let mimeType = ApiHelper.getObjectValue(requestBody, 'contentType', '');

  if (ApiHelper.isEmptyString(mimeType)) {
    hasError = true;
    message = 'Content-Type is invalid!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      data = await FileHelper.getS3UploadUrl(userId, mimeType);
      statusCode = 200;
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};