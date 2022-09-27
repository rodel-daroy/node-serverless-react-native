const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');

/**
 * @swagger
 * /transaction-detail:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get user's transaction detail
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *          type: string
 *         description: This is a txid
 *     security:
 *       - accessToken: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return total Coin, Currency, Created time, Sender, Receiver
 *
 */
module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let userId = await UserHelper.checkUserAccessToken(request);

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let id = ApiHelper.getObjectValue(queryParams, 'id');
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';

    data = await UserHelper.getUserTransactionDetail(id);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
