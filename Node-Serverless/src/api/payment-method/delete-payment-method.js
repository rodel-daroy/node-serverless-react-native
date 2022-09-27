const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Payment method
 * /payment-method:
 *   delete:
 *     tags:
 *       - Payment method
 *     summary: Delete the payment method id
 *     description: Delete the payment method id
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the user payment method table
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

  let statusCode = 0, message = '', data = {};
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
      let deletePaymentMethod = await DbHelper.query('UPDATE user_payment_method SET status = :status WHERE id = :id', { status: 'deleted', id });
      if (deletePaymentMethod['affectedRows'] > 0) {
        statusCode = 200;
        message = 'Success';
      } else {
        statusCode = 400;
        message = 'Nothing!';
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
