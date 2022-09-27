const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const PaymentMethodHelper = require('../../helpers/paymentmethod-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Payment method
 * /payment-methods:
 *   get:
 *     tags:
 *       - Payment method
 *     summary: Get payment method list of the user
 *     description: Get the list of the payment method ids that not deleted by user
 *     security:
 *       - accessToken: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the list of the the payment method ids
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    data = await PaymentMethodHelper.getPaymentMethodsForUser(userId);
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
