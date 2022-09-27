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

    let userRows = await DbHelper.query('SELECT u.*, up.full_name, up.avatar_fid FROM users u INNER JOIN user_profiles up ON up.user_id = u.id', {});
    let totalCount = userRows.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageUsers = userRows.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    let pageList = [];

    for (let user of pageUsers) {
      let userBalance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: user.id.toString() }, {});
      user['balance'] = userBalance;
      pageList.push(user);
    }

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};