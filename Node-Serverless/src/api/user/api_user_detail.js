const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _fullName = ApiHelper.getObjectValue(requestBody, 'fullName', '');
  data['_body'] = requestBody;

  if (_fullName === '') {
    errors['fullName'] = 'Full Name is required!';
    hasError = true;
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    data['userId'] = userId;
    if (userId > 0) {
      let postEntity = {};
      postEntity['full_name'] = _fullName;
      postEntity['user_id'] = userId;
      data['user_id'] = await UserHelper.updateUser(id, postEntity);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports.get = async (id, request) => {

  let statusCode = 200, message = 'Success', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  data['user_data'] = await UserHelper.getProfileItem(id, userId);

  return ApiHelper.apiResponse(statusCode, message, data);
};