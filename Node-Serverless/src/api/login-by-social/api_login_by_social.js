const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');
const FB = require('fb');


/**
 * @swagger
 * tags:
 *   name: Auth
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Social login
 *     description: This will get the fetched data from Social network company and response with user data and settings
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              provider:
 *                type: string
 *                required: true
 *                description: Facebook or Google
 *              deviceType:
 *                type: string
 *                required: true
 *                description: Web or Mobile
 *              deviceVersion:
 *                type: string
 *                required: true
 *                description: Version by device
 *              devicePushToken:
 *                type: string
 *                required: true
 *                description: preset_firebase
 *              profile:
 *                type: string
 *                required: true
 *                description: Email, familyName, givenName, id, photo etc. 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return user data include token and address
 *
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  console.log('social login requestBody =====>', requestBody);
  let provider = ApiHelper.getObjectValue(requestBody, 'provider', '');
  let deviceType = ApiHelper.getObjectValue(requestBody, 'deviceType', '');
  let deviceVersion = ApiHelper.getObjectValue(requestBody, 'deviceVersion', '');
  let devicePushToken = ApiHelper.getObjectValue(requestBody, 'devicePushToken', '');
  let profile = ApiHelper.getObjectValue(requestBody, 'profile', '');

  let _email = '';
  let _fullName = '';
  let _id = '';
  let _photo = '';
  let _avatarBase64 = '';

  switch (provider) {
    case 'Apple':
    case 'apple':
      _email = ApiHelper.getObjectValue(profile, 'email', '');
      _fullName = ApiHelper.getObjectValue(profile, 'givenName', '') + ' ' + ApiHelper.getObjectValue(profile, 'familyName', '');
      if (_fullName === ' ') {
        _fullName = ApiHelper.getObjectValue(profile, 'username', '');
      }
      _id = ApiHelper.getObjectValue(profile, 'username', '');
      _photo = ApiHelper.getObjectValue(profile, 'picture', '');
      break;
    case 'facebook':
    case 'Facebook':
    case 'fb':
      if (profile !== null) {
        _email = ApiHelper.getObjectValue(profile, 'email', '');
        _fullName = ApiHelper.getObjectValue(profile, 'username', '');
        _id = ApiHelper.getObjectValue(profile, 'id', '');
        _photo = ApiHelper.getObjectValue(profile, 'picture', '');
      } else {
        return null;
      }
      break;
    case 'google':
    case 'Google':
    case 'gg':
      if (profile !== null) {
        _email = ApiHelper.getObjectValue(profile, 'email', '');
        _fullName = ApiHelper.getObjectValue(profile, 'name', '');
        _id = ApiHelper.getObjectValue(profile, 'sub', '');
        _photo = ApiHelper.getObjectValue(profile, 'picture', '');
      }
      break;
    default:
      hasError = true;
      message = 'Provider is invalid!';
      break;
  }

  let userData = null;
  let userSettings = null;

  if (hasError) {
    statusCode = 500
  } else {

    console.log('social login infos =====>', _email, _fullName, _id, _photo);
    let userId = await UserHelper.getUserIdByName(_email);
    console.log('social login userId =====>', userId);
    if (!userId) {
      _avatarBase64 = await ApiHelper.getBase64FromUrl(_photo);
      await UserHelper.createNewUser(_email, _fullName, _avatarBase64);
    }

    let userCode = await UserHelper.genUserCode(_email, 6, devicePushToken, deviceType, deviceVersion, false);
    let apiResult = await UserHelper.verifyUserCode(_email, userCode);

    if (apiResult['status'] > 0) {
      statusCode = 200;
      message = 'Success';
      userData = await UserHelper.getAccessUserInfo(_email, apiResult['token']);
      userSettings = await UserHelper.getUserSettings(userData['id']);
    } else {
      statusCode = 400;
      message = 'Your code is wrong or expired. Please check again! ' + JSON.stringify(requestBody);
      userData = { id: 0, name: 'Guest', avatarUrl: '', token: '' };
    }

    data['user_data'] = userData;
    data['settings'] = userSettings;
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};