const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Auth
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: This will trigger an email with an access code but also returns the access code in the response
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *              devicePushToken:
 *                type: string
 *                required: true
 *                description:  details needed
 *              deviceType:
 *                type: string
 *                required: true
 *                description: details needed
 *              deviceVersion:
 *                type: string
 *                required: true
 *                description: details needed
 *
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

  let statusCode = 0;
  let message = '';
  let data = {};
  let userCode = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let name = ApiHelper.getObjectValue(requestBody, 'username', '');
  let devicePushToken = ApiHelper.getObjectValue(requestBody, 'devicePushToken', '');
  let deviceType = ApiHelper.getObjectValue(requestBody, 'deviceType', '');
  let deviceVersion = ApiHelper.getObjectValue(requestBody, 'deviceVersion', '');
  name = name.toLowerCase();

  if (!ApiHelper.isEmail(name) && !ApiHelper.isPhone(name)) {
    hasError = true;
    message = 'Username is not valid! Should be email or phone number!';
    statusCode = 400;
  }

  if (!hasError) {

    let userId = await UserHelper.getUserIdByEmail(name);
    let accountType = '';

    if (userId > 0) {
      try {
        userCode = await UserHelper.genUserCode(name, 6, devicePushToken, deviceType, deviceVersion);
      } catch (e) {
        console.log(e);
      }
      statusCode = 200;
      message = 'Success';
      accountType = 'existed';
    } else {
      statusCode = 200;
      accountType = 'new';
    }

    if (name === 'demo@kuky.com') {
      statusCode = 200;
      message = 'Success';
      accountType = 'existed';
    }

    data['account_type'] = accountType;
    data['code'] = userCode;
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
