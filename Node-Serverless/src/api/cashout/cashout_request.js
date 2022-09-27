const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const UserHelper = require('../../helpers/user-helper');
const WalletHelper = require('../../helpers/wallet-helper');


/**
 * @swagger
 * tags:
 *   name: Cash out
 * /cashout-request:
 *   post:
 *     tags:
 *       - Cash out
 *     summary: Send the cash out request
 *     description: Send the cash out request with amount
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *                required: true
 *                description: the usd amount that user is going to cash out
 *            example:
 *              amount: 100
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return new contract id, current conversion, ltc amount will be spent for the cash out
 */
module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let requestedAmount = ApiHelper.getObjectValue(requestBody, 'amount', 0);

  if (requestedAmount === 0) {
    hasError = true;
    message = 'Amount is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let { 
        requestedLtc,
        currencyCode,
        currencyRate,
        baseFee,
        feeTotal,
        percentageFee,
        feePercentage 
      } = await WalletHelper.feeCalculation(requestedAmount, userId);
      let ltcBalanceCheck = await WalletHelper.ltcBalanceCheck(requestedLtc, userId.toString())
      if (ltcBalanceCheck) {
        let newContact = await DbHelper.dbInsert('contract', {
          user_id: userId,
          date: await ApiHelper.getCurrentUnixTime(),
          amount: requestedAmount,
          currency: currencyCode,
          base_fee: parseFloat(baseFee).toFixed(2),
          percentage_fee: percentageFee,
          fee_percentage: feePercentage * 100,
          fee_total: parseFloat(feeTotal).toFixed(2),
          requested_amount: parseFloat(requestedAmount).toFixed(2),
          conversion: currencyRate,
          status: 'pending',
          type: 'cashout'
        });

        statusCode = 200;
        message = 'Success';
        data = { 
          id: newContact, 
          'Requested Amount': `${parseFloat(requestedAmount).toFixed(2)} ${currencyCode}`, 
          'Base fee': `${parseFloat(baseFee).toFixed(2)} ${currencyCode}(2.5 USD)`, 
          'Percentage fee': `${percentageFee} ${currencyCode}(${feePercentage * 100}%)`, 
          'Total fee': `${parseFloat(feeTotal).toFixed(2)} ${currencyCode}`, 
          'Total Charge': `${(parseFloat(requestedAmount) + parseFloat(feeTotal)).toFixed(2)} ${currencyCode}`,
        };
      } else {
        statusCode = 400;
        message = 'You don\'t have enough coins to cashout!';
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
