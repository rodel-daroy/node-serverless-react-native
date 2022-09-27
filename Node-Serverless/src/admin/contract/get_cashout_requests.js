const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');


/**
 * @swagger
 * tags:
 *   name: Cash out
 * /admin/pending-cashout-requests:
 *   get:
 *     tags:
 *       - Cash out
 *     description: Get the pending cash out requests
 *     parameters:
 *       - in: path
 *         name: pageSize
 *         schema:
 *           type: number
 *       - in: path
 *         name: pageNumber
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *        description: return array of pending cash out requests
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let pageSize = ApiHelper.getObjectValue(queryParams, 'pageSize', 30);
  let pageNumber = ApiHelper.getObjectValue(queryParams, 'pageNumber', 1);
  let requestedStatus = ApiHelper.getObjectValue(queryParams, 'status', 'all');

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    let pendingCashoutContracts = [];
    pendingCashoutContracts = (requestedStatus === 'all'
      ? await DbHelper.query('SELECT * FROM contract WHERE type = :type ORDER BY id DESC', { type: 'cashout' })
      : await DbHelper.query('SELECT * FROM contract WHERE type = :type AND status = :status ORDER BY id DESC', { type: 'cashout', status: requestedStatus }));

    let totalCount = pendingCashoutContracts.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageList = pendingCashoutContracts.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};