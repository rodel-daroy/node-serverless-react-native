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

    let totalUserActions = await DbHelper.query('SELECT * FROM user_actions');
    let totalCount = totalUserActions.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageUserActions = totalUserActions.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    let pageList = [];

    for (let action of pageUserActions) {
      let item = {
        id: action.id,
        object_type: action.object_type,
        object_id: action.object_id,
        value: action.value,
        status: action.status,
        created_by: action.created_by,
        updated_at: ApiHelper.convertUnixTimeToTime(action.updated_at)
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