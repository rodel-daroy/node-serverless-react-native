const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let pageSize = ApiHelper.getObjectValue(queryParams, 'pageSize', 10);
  let pageNumber = ApiHelper.getObjectValue(queryParams, 'pageNumber', 1);

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {

    let totalPages = await DbHelper.query('SELECT * FROM static_pages');
    let totalCount = totalPages.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageList = totalPages.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};