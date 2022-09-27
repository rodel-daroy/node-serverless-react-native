const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Bank account
 * /bank-account:
 *   delete:
 *     tags:
 *       - Bank account
 *     summary: Delete the bank account of the user
 *     description: Delete the bank account of the user
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the user bank account table
 *            example:
 *              id: 1
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success or fail
 */
module.exports.delete = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;
  let errors = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);

  if (id === 0) {
    hasError = true;
    errors['id'] = 'id is missed';
  }

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    if (hasError) {
      statusCode = 400;
      message = 'Params are invalid';
    } else {
      let deleteBankAccount = await DbHelper.query('UPDATE user_bank_account SET status = :status WHERE id = :id AND user_id=:userId', { status: 'deleted', id: id, userId: userId });
      if (!deleteBankAccount || deleteBankAccount['affectedRows'] == 0) {
        statusCode = 400;
        message = 'No bankaccount found with the given ID under this user';

      } else {
        statusCode = 200;
        message = 'Success';
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
