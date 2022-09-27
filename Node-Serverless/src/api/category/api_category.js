const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let from = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'from', 0));
  let limit = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'limit', 10));

  let userId = await UserHelper.checkUserAccessToken(request);
  let list = await UserHelper.getProfiles({ from, limit, q: '' }, userId);

  statusCode = 200;
  message = 'Success';
  data['from'] = from;
  data['limit'] = limit;
  data['next'] = from + limit;
  data['list'] = list;

  return ApiHelper.apiResponse(statusCode, message, data);
};