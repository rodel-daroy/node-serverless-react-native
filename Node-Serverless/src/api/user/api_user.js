const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 200, message = 'Success', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let from = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'from', 0));
  let limit = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'limit', 10));
  let q = ApiHelper.getObjectValue(queryParams, 'q', '').toLocaleLowerCase();
  let latitude = ApiHelper.getObjectValue(queryParams, 'latitude', '');
  let longitude = ApiHelper.getObjectValue(queryParams, 'longitude', '');
  let sorting = ApiHelper.getObjectValue(queryParams, 'sorting', '');
  let status = ApiHelper.getObjectValue(queryParams, 'status', '');
  let skills = ApiHelper.getObjectValue(queryParams, 'skills', '');
  let gender = ApiHelper.getObjectValue(queryParams, 'gender', '');
  let personalities = ApiHelper.getObjectValue(queryParams, 'personalities', '');

  let userId = await UserHelper.checkUserAccessToken(request);

  let users = await UserHelper.getProfiles({ from, limit, q, sorting, latitude, longitude, status, skills, gender, personalities }, userId);

  data['from'] = from;
  data['limit'] = limit;
  data['next'] = from + limit;
  data['users'] = users;

  return ApiHelper.apiResponse(statusCode, message, data);
};