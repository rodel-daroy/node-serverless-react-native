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

    let totalEdmTemplates = await DbHelper.query('SELECT * FROM edm_templates');
    let totalCount = totalEdmTemplates.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageEdmTemplates = totalEdmTemplates.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    let pageList = [];

    for (let edm of pageEdmTemplates) {
      let item = {
        id: edm.id,
        code: edm.code,
        title: edm.title,
        body: edm.body,
        status: edm.status
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