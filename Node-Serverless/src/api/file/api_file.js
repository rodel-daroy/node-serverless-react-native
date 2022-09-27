const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let base64 = ApiHelper.getObjectValue(requestBody, 'base64', '');
  let files = [];

  if (ApiHelper.isEmptyString(base64)) {
    hasError = true;
    message = 'File is invalid!';
    data['files'] = files;
    data['base64'] = base64;
  }
  let uploadType = '';
  if (!ApiHelper.isEmptyString(base64)) {
    uploadType = 'base64';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      switch (uploadType) {
        case 'base64':
          let res = await FileHelper.uploadFileFromBase64(userId, base64);
          data['id'] = res['id'];
          data['url'] = res['url'];
          message = res['message'];
          if (res['id'] > 0) {
            statusCode = 200;
          } else {
            statusCode = 500;
          }
          break;
        case 'file':
          break;
        default:
          statusCode = 400;
          message = 'Undefined!';
          break;
      }

    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};