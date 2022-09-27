const ApiHelper = require('../../helpers/api-helper');
const StripeHelper = require('../../helpers/stripe-helper');


/**
 * @swagger
 * tags:
 *   name: Payment method
 * /supported-currency:
 *   get:
 *     tags:
 *       - Payment method
 *     summary: Get a list of supported currency
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return a list of supported currency
 */
module.exports.get = async (request) => {

  let statusCode = 200;
  let message = 'Success';
  let data = await StripeHelper.getStripeCurrencies();

  return ApiHelper.apiResponse(statusCode, message, data);
};
