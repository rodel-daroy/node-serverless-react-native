const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.delete = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let username = ApiHelper.getObjectValue(requestBody, 'username', '');

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await UserHelper.deleteUserAccount(userId, username);
  } else {
    statusCode = 403;
    message = 'Please check your permission!';
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.post = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _username = ApiHelper.getObjectValue(requestBody, 'username', '');
  let _type = ApiHelper.getObjectValue(requestBody, 'type', '');

  if (_username == '') {
    hasError = true;
    errors['username'] = message = 'Username is required';
  }
  if (_type == '') {
    hasError = true;
    errors['type'] = message = 'Type is required';
  }
  if (_username != '') {
    switch (_type) {
      case 'email':
        _username = _username.toLowerCase();
        if (ApiHelper.isEmail(_username) == false) {
          hasError = true;
          errors['username'] = message = 'Email is invalid';
        }
        break;
      case 'phone':
        _username = _username.toLowerCase();
        if (ApiHelper.isPhone(_username) == false) {
          hasError = true;
          errors['username'] = message = 'Phone Number is invalid';
        }
        break;
      default:
        hasError = true;
        errors['type'] = message = 'Username is invalid';
        break;
    }
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      const result = await UserHelper.createUserAccount(userId, _username, _type);
      data = result.data;
      statusCode = result.status;
      message = result.message;
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _username = ApiHelper.getObjectValue(requestBody, 'username', '');
  let _type = ApiHelper.getObjectValue(requestBody, 'type', '');
  let _code = ApiHelper.getObjectValue(requestBody, 'code', '');

  if (_username == '') {
    hasError = true;
    errors['username'] = message = 'Username is required';
  }
  if (_type == '') {
    hasError = true;
    errors['type'] = message = 'Type is required';
  }
  if (_code == '') {
    hasError = true;
    errors['code'] = message = 'Code is required';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let result = await UserHelper.verifyUserAccount(userId, _username, _type, _code);
      data = result['data'];
      statusCode = result['status'];
      message = result['message'];
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

/**
 * @swagger
 * tags:
 *   name: Auth
 * /user-verification:
 *   get:
 *     tags:
 *       - Auth
 *     summary: User token verification
 *     description: Check the requested user has valid token
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return 200 with 'This is a valid user' on success and return 400 with 'Not a valid user'.
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '';

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'This is a valid user';
  } else {
    statusCode = 400;
    message = 'Not a valid user';
  }

  return ApiHelper.apiResponse(statusCode, message);
};