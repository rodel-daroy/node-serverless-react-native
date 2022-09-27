const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Bank account
 * /bank-account:
 *   get:
 *     tags:
 *       - Bank account
 *     summary: Get user's bank account for cash out
 *     description: Get user's bank account for cash out
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the info of the user bank account
 */
module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await DbHelper.query('SELECT * FROM user_bank_account WHERE user_id = :userId AND status=:status', { userId, status: 'active' });
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
