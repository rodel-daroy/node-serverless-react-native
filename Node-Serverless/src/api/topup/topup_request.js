const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const UserHelper = require('../../helpers/user-helper');
const WalletHelper = require('../../helpers/wallet-helper');

/**
 * @swagger
 * tags:
 *   name: Top up
 * /topup-request:
 *   post:
 *     tags:
 *       - Top up
 *     summary: Send the top up request
 *     description: Send the top up request with paymentMethodId and amount
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              paymentMethodId:
 *                type: string
 *                required: true
 *                description: the id of the payment method created by the sdk in the frontend, if it is in-app purchase id should be iap
 *              amount:
 *                type: number
 *                required: true
 *                description: the usd amount that user is going to convert ltc
 *            example:
 *              paymentMethodId: pm_1JSK2sJvmRVfQZZBLYz4A2iq
 *              amount: 100
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return new contract id, current conversion, ltc amount will be gained by the top up
 */

module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {
      info: {},
      ability: true,
    };
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let paymentMethodId = ApiHelper.getObjectValue(requestBody, 'paymentMethodId', '');
  let requestedAmount = ApiHelper.getObjectValue(requestBody, 'amount', 0);
  let iapPurchaseInfo = ApiHelper.getObjectValue(requestBody, 'iapInfo', '');
  console.log(request, paymentMethodId, 'paymentmethodid');
  if (paymentMethodId === '') {
    hasError = true;
    errors['paymentMethodId'] = 'PaymentMethodId is required!';
  } else if (paymentMethodId === 'iap') {
    switch (requestedAmount) {
      case 'small':
        requestedAmount = 20;
        break;
      case 'medium':
        requestedAmount = 50;
        break;
      case 'large':
        requestedAmount = 100;
        break;
    }
  }

  if (requestedAmount === 0) {
    hasError = true;
    errors['amount'] = 'Amount is required!';
  }

  if (hasError) {
    data.ability = false;
    statusCode = 400;
    message = 'Params are invalid!';
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    userId = 86;
    if (userId > 0) {
      if (paymentMethodId === 'iap') {
        let { receivingLtc, feeTotal, percentageFee, feePercentage } = await WalletHelper.iapFeeCalculation(requestedAmount);
        let { currency, price } = iapPurchaseInfo;
        let ltcBalanceCheck = await WalletHelper.ltcBalanceCheck(receivingLtc, 9);

        if (ltcBalanceCheck) {
          let newContract = await DbHelper.dbInsert('contract', {
            user_id: userId,
            date: await ApiHelper.getCurrentUnixTime(),
            payment_method_id: paymentMethodId,
            amount: receivingLtc,
            currency,
            base_fee: 0,
            percentage_fee: percentageFee,
            fee_percentage: feePercentage * 100,
            fee_total: parseFloat(feeTotal).toFixed(2),
            requested_amount: parseFloat(+price).toFixed(2),
            status: 'pending',
            type: 'iap-topup',
          });

          statusCode = 200;
          message = 'Success';
          data.info = {
            id: newContract,
            'Requested Amount': `${parseFloat(+price).toFixed(2)} ${currency}`,
            'Percentage fee': `${+price * 0.5} ${currency}(${feePercentage * 100}%)`,
            'Total fee': `${parseFloat(+price * 0.5).toFixed(2)} ${currency}`,
            'Topup Amount': `${parseFloat(price * 0.5)} ${currency}`,
          };
        } else {
          data.ability = false;
          statusCode = 400;
          message = "We don't have enough coins to sell!";
        }
      } else {
        let { requestedLtc, currencyCode, currencyRate, baseFee, feeTotal, percentageFee, feePercentage } = await WalletHelper.feeCalculation(requestedAmount, userId);
        let ltcBalanceCheck = await WalletHelper.ltcBalanceCheck(requestedLtc, 9);

        if (ltcBalanceCheck) {
          let newContract = await DbHelper.dbInsert('contract', {
            user_id: userId,
            date: await ApiHelper.getCurrentUnixTime(),
            payment_method_id: paymentMethodId,
            amount: requestedAmount,
            currency: currencyCode,
            base_fee: parseFloat(baseFee).toFixed(2),
            percentage_fee: percentageFee,
            fee_percentage: feePercentage * 100,
            fee_total: parseFloat(feeTotal).toFixed(2),
            requested_amount: parseFloat(requestedAmount).toFixed(2),
            conversion: currencyRate,
            status: 'pending',
            type: 'topup',
          });

          statusCode = 200;
          message = 'Success';
          data.info = {
            id: newContract,
            'Requested Amount': `${parseFloat(requestedAmount).toFixed(2)} ${currencyCode}`,
            'Base fee': `${parseFloat(baseFee).toFixed(2)} ${currencyCode} ${paymentMethodId === 'iap' ? '' : '(1.5 USD)'}`,
            'Percentage fee': `${percentageFee} ${currencyCode}(${feePercentage * 100}%)`,
            'Total fee': `${parseFloat(feeTotal).toFixed(2)} ${currencyCode}`,
            'Total Charge': `${(parseFloat(requestedAmount) + parseFloat(feeTotal)).toFixed(2)} ${currencyCode}`,
          };
        } else {
          data.ability = false;
          statusCode = 400;
          message = "We don't have enough coins to sell!";
        }
      }
    } else {
      data.ability = false;
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
