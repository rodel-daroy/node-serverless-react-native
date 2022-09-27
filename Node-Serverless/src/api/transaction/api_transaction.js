const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Wallet
 * /transaction:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get user's transaction list
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *          type: string
 *          enum: [all,sent,received,pending,completed]
 *         description: This is a filtering parameter
 *     security:
 *       - accessToken: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return firebase user data. data.logged.idToken is to be used as an access-token
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let type = ApiHelper.getObjectValue(queryParams, 'type', 'all');

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await UserHelper.getUserTransactions(userId, type);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
