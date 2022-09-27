const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let status = ApiHelper.getObjectValue(queryParams, 'status', 'all');
  let page_size = ApiHelper.getObjectValue(queryParams, 'size', 10);
  let page_number = ApiHelper.getObjectValue(queryParams, 'page', 0);
  let sort = ApiHelper.getObjectValue(queryParams, 'sort', 'asc');

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    data = await AdminHelper.getUserVerifications({}, page_size, page_number, status, sort);
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.put = async (request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0)

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    let res = await AdminHelper.updateUserVerifications(id, requestBody);
    if (res == 1) {
      statusCode = 200;
      message = 'Success';
      data = 'Update Success'
    } else {
      statusCode = 400;
      message = 'Fail';
      data = 'Update Fail'
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};