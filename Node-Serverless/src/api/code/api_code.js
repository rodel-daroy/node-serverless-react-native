const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Auth
 * /code:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login code to be entered
 *     description: Users to enter the code from userLogin call
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *              code:
 *                type: string
 *                required: true
 *                description:  code via the email or the response from the user login call
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return firebase user data. data.logged.idToken is to be used as an access-token
 *
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let name = ApiHelper.getObjectValue(requestBody, 'username', '');
  let code = ApiHelper.getObjectValue(requestBody, 'code', '');

  if (ApiHelper.isEmptyString(name)) {
    hasError = true;
    errors['username'] = 'Username is required!';
  }
  if (ApiHelper.isEmptyString(code)) {
    hasError = true;
    errors['code'] = 'Code is required!';
  }

  let userData = null;
  let userSettings = null;

  if (hasError) {
    statusCode = 400;
    message = 'Params are invalid!';
    userData = { id: 0, name: 'Guest', avatarUrl: '', token: '' };
  } else {
    let apiResult = await UserHelper.verifyUserCode(name, code);
    if (apiResult['status'] > 0) {
      statusCode = 200;
      message = 'Success';
      userData = await UserHelper.getAccessUserInfo(name, apiResult['token']);
      userSettings = await UserHelper.getUserSettings(userData['id']);
    } else {
      statusCode = 400;
      message = 'Your code is wrong or expired. Please check again! ' + JSON.stringify(requestBody);
      userData = { id: 0, name: 'Guest', avatarUrl: '', token: '' };
    }
  }
  data['user_data'] = userData;
  data['settings'] = userSettings;

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
