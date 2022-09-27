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

    let countResult = await DbHelper.query('SELECT COUNT(id) as count FROM api_logs');
    let totalCount = countResult[0].count;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageApiLogs = await DbHelper.query(`SELECT * FROM api_logs ORDER BY id ASC LIMIT ${pageSize * (pageNumber - 1)},${pageSize}`, {});
    let pageList = [];

    for (let log of pageApiLogs) {
      let item = {
        id: ApiHelper.getObjectValue(log, 'id', 'id'),
        api: ApiHelper.getObjectValue(log, 'api', 'api'),
        request: ApiHelper.parseJson(ApiHelper.getObjectValue(log, 'request', 'request')),
        response: ApiHelper.parseJson(ApiHelper.getObjectValue(log, 'request', 'response')),
        created_at: ApiHelper.convertUnixTimeToShortTime(ApiHelper.getObjectValue(log, 'created_at', 'created_at')),
        status: ApiHelper.getObjectValue(log, 'status', 'status')
      }
      pageList.push(item)
    }

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};