const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.delete = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _userSkillId = parseInt(ApiHelper.getObjectValue(requestBody, 'id', ''));

  if (_userSkillId < 1) {
    hasError = true;
    message = 'Skill ID is required';
  }
  if (id < 1) {
    hasError = true;
    message = 'User ID is required';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId == id) {
      data = await UserHelper.deleteUserSkill(_userSkillId, userId);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!' + userId + ';' + id;
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.post = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _name = ApiHelper.getObjectValue(requestBody, 'name', '');
  _name = _name !== null ? _name.trim() : '';

  if (ApiHelper.isEmptyString(_name)) {
    hasError = true;
    message = 'Skill Name is required';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      data = await UserHelper.addUserSkill(id, _name, userId);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.get = async (id, request) => {

  let statusCode = 200;
  let message = 'Success';

  let userId = await UserHelper.checkUserAccessToken(request);
  let data = await UserHelper.getUserSkills(id, userId);

  return ApiHelper.apiResponse(statusCode, message, data);
};