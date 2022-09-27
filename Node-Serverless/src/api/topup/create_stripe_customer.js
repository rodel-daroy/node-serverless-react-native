const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let response = await UserHelper.stripeCustomer(userId, requestBody);
    if (response.id > 0) {
      statusCode = 200;
      message = 'Success';
      data = { customerId: response.customerId };
    } else {
      statusCode = 400;
      message = 'Failed';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
