const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const PaymentMethodHelper = require('../../helpers/paymentmethod-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Payment method
 * /payment-method:
 *   post:
 *     tags:
 *       - Payment method
 *     summary: Save the payment method id
 *     description: Save the payment method id
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              paymentMethodId:
 *                type: string
 *                required: true
 *                description: the id of the payment method created by the sdk in the frontend
 *            example:
 *              paymentMethodId: pm_1JSK2sJvmRVfQZZBLYz4A2iq
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success or fail
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;
  let errors = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let paymentMethodId = ApiHelper.getObjectValue(requestBody, 'paymentMethodId', '');

  if (paymentMethodId === '') {
    hasError = true;
    errors['paymentMethodId'] = 'paymentMethodId is missed';
  }

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    if (hasError) {
      statusCode = 400;
      message = 'Params are invalid';
    } else {
      try {
        await PaymentMethodHelper.addPaymentMethodToUser(paymentMethodId, userId);
        statusCode = 200;
        message = 'Success';
      } catch (e) {
        statusCode = 400;
        message = 'Invalid PaymentMethodId. ' + e.message;
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
