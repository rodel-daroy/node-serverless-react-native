const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let name = ApiHelper.getObjectValue(requestBody, 'email', '');
  let token = ApiHelper.getObjectValue(requestBody, 'token', '');
  let code = ApiHelper.getObjectValue(requestBody, 'code', '');

  if (ApiHelper.isEmptyString(name)) {
    hasError = true;
    errors['email'] = 'Email is required!';
  }
  if (ApiHelper.isEmptyString(token)) {
    hasError = true;
    errors['token'] = 'Token is required!';
  }
  if (ApiHelper.isEmptyString(code)) {
    hasError = true;
    errors['code'] = 'Code is required!';
  }

  if (hasError) {
    statusCode = 400;
    message = 'Params are invalid!';
  } else {
    let apiResult = await AdminHelper.verifyAdminUserCode(name, token, code);
    if (apiResult['status'] > 0) {
      statusCode = 200;
      message = 'Success';
      data['info'] = await AdminHelper.getAdminAccessInfo(name, token);
    } else {
      statusCode = 400;
      message = 'Your code is wrong or expired. Please check again!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};