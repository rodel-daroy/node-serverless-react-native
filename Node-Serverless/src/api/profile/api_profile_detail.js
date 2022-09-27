const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (id, request) => {

  let userId = await UserHelper.checkUserAccessToken(request);
  let statusCode = 200;
  let message = 'Success';
  let data = await UserHelper.getMyProfile(id);

  return ApiHelper.apiResponse(statusCode, message, data);
};
