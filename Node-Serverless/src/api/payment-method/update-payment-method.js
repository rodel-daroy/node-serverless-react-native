const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Payment method
 * /payment-method:
 *   put:
 *     tags:
 *       - Payment method
 *     summary: Update the payment method id
 *     security:
 *       - accessToken: []
 *     description: Update the payment method id
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
 *              paymentMethodId:
 *                type: string
 *                required: true
 *                description: the id of the payment method created by the sdk in the frontend
 *            example:
 *              id: 1
 *              paymentMethodId: pm_1JSK2sJvmRVfQZZBLYz4A2iq
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success or fail
 */
module.exports.put = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;
  let errors = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let paymentMethodId = ApiHelper.getObjectValue(requestBody, 'paymentMethodId', '');

  if (id === 0) {
    hasError = true;
    errors['id'] = 'id is missed';
  }
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
        await StripeHelper.retrieveAPaymentMethod(paymentMethodId); // Throw exception if paymentMethodID isn't found
        // @TODO, there is no validation the payment method belongs to the user

        let updatePaymentMethod = await DbHelper.query('UPDATE user_payment_method SET payment_method_id = :paymentMethodId WHERE id = :id', { paymentMethodId, id });
        if (updatePaymentMethod['affectedRows'] > 0) {
          statusCode = 200;
          message = 'Success';
        } else {
          statusCode = 400;
          message = 'Nothing!';
        }
      } catch (e) {
        statusCode = 400;
        message = 'Invalid PaymentMethodId';
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
