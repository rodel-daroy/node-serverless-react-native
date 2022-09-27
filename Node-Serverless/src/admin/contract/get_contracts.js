const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');

/**
 * @swagger
 * tags:
 *   name: Get contracts
 * /admin/get-contract:
 *   get:
 *     tags:
 *       - Contract
 *     description: Get a filtered contract
 *     parameters:
 *       - in: path
 *         name: pageSize
 *         schema:
 *           type: number
 *       - in: path
 *         name: pageNumber
 *         schema:
 *           type: number
 *       - in: path
 *         name: startDate
 *         schema:
 *           type: number
 *       - in: path
 *         name: endDate
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *        description: return array of contracts
 *
 */
module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let type = ApiHelper.getObjectValue(queryParams, 'type', 'all');
  let status = ApiHelper.getObjectValue(queryParams, 'status', 'all');
  let pageSize = ApiHelper.getObjectValue(queryParams, 'pageSize', 10);
  let pageNumber = ApiHelper.getObjectValue(queryParams, 'pageNumber', 1);
  let startDate = ApiHelper.getObjectValue(queryParams, 'startDate', 0);
  let endDate = ApiHelper.getObjectValue(queryParams, 'endDate', +(+new Date() / 1000).toFixed());

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    let filteredContracts = [];
    let pageList = [];
    if (type == 'all') {
      if (status == 'all') {
        filteredContracts = await DbHelper.query('SELECT * FROM contract WHERE date BETWEEN :startDate AND :endDate ORDER BY id DESC ', { startDate, endDate });
      } else {
        filteredContracts = await DbHelper.query('SELECT * FROM contract WHERE status = :status AND date BETWEEN :startDate AND :endDate ORDER BY id DESC', { status, startDate, endDate });
      }
    } else {
      if (status == 'all') {
        filteredContracts = await DbHelper.query('SELECT * FROM contract WHERE type = :type AND date BETWEEN :startDate AND :endDate ORDER BY id DESC', { type, startDate, endDate });
      } else {
        filteredContracts = await DbHelper.query('SELECT * FROM contract WHERE type = :type AND status = :status AND date BETWEEN :startDate AND :endDate ORDER BY id DESC', { type, status, startDate, endDate });
      }
    }
    pageSize = filteredContracts.length;
    pageList = filteredContracts;
    let totalCount = filteredContracts.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList };
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
