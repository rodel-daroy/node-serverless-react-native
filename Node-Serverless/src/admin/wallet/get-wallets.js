const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let pageSize = ApiHelper.getObjectValue(queryParams, 'pageSize', 10);
  let pageNumber = ApiHelper.getObjectValue(queryParams, 'pageNumber', 1);

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {

    let totalWallets = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'get-wallets', {});
    let totalCount = totalWallets.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageWallets = totalWallets.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    let pageList = [];

    for (let walletCode of pageWallets) {
      let balance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode }, {});
      pageList.push({ userId: walletCode, balance })
    }

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};