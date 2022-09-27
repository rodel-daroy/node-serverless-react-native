const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (id, request) => {

  let statusCode = 200;
  let message = 'Success';

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let from = ApiHelper.getObjectValue(queryParams, 'from', 0);
  let limit = ApiHelper.getObjectValue(queryParams, 'limit', 10);
  let q = ApiHelper.getObjectValue(queryParams, 'q', '').toLocaleLowerCase();
  let latitude = ApiHelper.getObjectValue(queryParams, 'latitude', '');
  let longitude = ApiHelper.getObjectValue(queryParams, 'longitude', '');
  let status = ApiHelper.getObjectValue(queryParams, 'status', '');
  let skills = ApiHelper.getObjectValue(queryParams, 'skills', '');
  let gender = ApiHelper.getObjectValue(queryParams, 'gender', '');
  let personalities = ApiHelper.getObjectValue(queryParams, 'personalities', '');

  let filterData = { from, limit, q, latitude, longitude, status, skills, gender, personalities };
  let data = await UserHelper.getUserFriendsWithFilter(filterData, id);

  return ApiHelper.apiResponse(statusCode, message, data);
};