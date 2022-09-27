const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (id, request) => {

  let statusCode = 200;
  let message = 'Success';

  let userId = await UserHelper.checkUserAccessToken(request);
  let data = await UserHelper.getUserPosts(id, userId);

  return ApiHelper.apiResponse(statusCode, message, data);
};