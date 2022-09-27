const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let addresses = ApiHelper.getObjectValue(requestBody, 'addresses', []);
  let reason = ApiHelper.getObjectValue(requestBody, 'reason', '');
  let amount = ApiHelper.getObjectValue(requestBody, 'amount', 0);
  amount = ApiHelper.parseAmount(amount);

  if (addresses.length < 1) {
    hasError = true;
    errors['addresses'] = message = 'Address is required!';
  }
  if (reason === '') {
    hasError = true;
    errors['reason'] = message = 'Reason is required!';
  }
  if (amount === 0) {
    hasError = true;
    errors['amount'] = message = 'Amount is required!';
  }

  if (hasError) {
    statusCode = 400;
    data['debug'] = requestBody;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let receivers = [];
      for (let address of addresses) {
        receivers.push(address);
      }
      let result = await UserHelper.sendLtc(userId, amount, receivers, reason);
      if (result['status'] === 1) {
        statusCode = 200;
        message = result['message'];
      } else {
        statusCode = 500;
        message = result['message'];
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};