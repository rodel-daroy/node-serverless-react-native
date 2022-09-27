const ApiHelper = require('../../helpers/api-helper');
const StripeHelper = require('../../helpers/stripe-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Users
 * /user/{id}/settings:
 *   put:
 *     tags:
 *       - Users
 *     summary: User account updates
 *     description: User account updates with more details
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: integer
 *         required: true
 *     requestBody:
 *
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              backgroundUrl:
 *                type: string
 *              avatarUrl:
 *                type: string
 *              fullName:
 *                type: string
 *              introduction:
 *                type: string
 *              gender:
 *                type: string
 *              maritalStatus:
 *                type: string
 *              country:
 *                type: string
 *              language:
 *                type: string
 *              accountType:
 *                type: string
 *              over18:
 *                type: string
 *              subscribeToAdultContent:
 *                type: string
 *              preferredCurrency:
 *                type: string
 *                description: This value must be one of the "supported currencies"
 *              exchangeRate:
 *                type: string
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success or fail

 */
module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _backgroundUrl = ApiHelper.getObjectValue(requestBody, 'backgroundUrl', '');
  let _avatarUrl = ApiHelper.getObjectValue(requestBody, 'avatarUrl', '');
  let _fullName = ApiHelper.getObjectValue(requestBody, 'fullName', '');
  if (ApiHelper.isEmptyString(_fullName)) {
    hasError = true;
    message = 'Full Name is required!';
  }
  let _introduction = ApiHelper.getObjectValue(requestBody, 'introduction', '');
  if (ApiHelper.isEmptyString(_introduction)) {
    hasError = true;
    message = 'Introduction is required!';
  }
  let _gender = ApiHelper.getObjectValue(requestBody, 'gender', '');
  if (ApiHelper.isEmptyString(_gender)) {
    hasError = true;
    message = 'Gender is required!';
  }
  let _maritalStatus = ApiHelper.getObjectValue(requestBody, 'maritalStatus', '');
  if (ApiHelper.isEmptyString(_gender)) {
    hasError = true;
    message = 'Marital Status is required!';
  }
  let _country = ApiHelper.getObjectValue(requestBody, 'country', '');
  if (ApiHelper.isEmptyString(_country)) {
    hasError = true;
    message = 'Country is required!';
  }
  let _language = ApiHelper.getObjectValue(requestBody, 'language', '');
  if (ApiHelper.isEmptyString(_language)) {
    hasError = true;
    message = 'Language is required!';
  }
  let _accountType = ApiHelper.getObjectValue(requestBody, 'accountType', '');
  if (ApiHelper.isEmptyString(_accountType)) {
    hasError = true;
    message = 'Account Type is required!';
  }
  let _over18 = ApiHelper.getObjectValue(requestBody, 'over18', '');
  let _subscribeToAdultContent = ApiHelper.getObjectValue(requestBody, 'subscribeToAdultContent', '');
  let _preferredCurrency = ApiHelper.getObjectValue(requestBody, 'preferredCurrency', '');
  let _exchangeRate = ApiHelper.getObjectValue(requestBody, 'exchangeRate', '');

  let supportedCurrency = await StripeHelper.getStripeCurrencies();
  if (_preferredCurrency === null) {
    hasError = true;
    message = 'Currency is null';
  } else if (!supportedCurrency.includes(_preferredCurrency.toLowerCase())) {
    hasError = true;
    message = 'Currency : ' + _preferredCurrency.toUpperCase() + ' is not supported';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);

    if (userId == id && id > 0) {
      let settingsData = {
        backgroundUrl: _backgroundUrl,
        avatarUrl: _avatarUrl,
        fullName: _fullName,
        introduction: _introduction,
        gender: _gender,
        maritalStatus: _maritalStatus,
        country: _country,
        language: _language,
        accountType: _accountType,
        over18: _over18,
        subscribeToAdultContent: _subscribeToAdultContent,
        preferredCurrency: _preferredCurrency,
        exchangeRate: _exchangeRate
      };
      data = await UserHelper.updateUserSettings(userId, settingsData);
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

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    if (userId == id) {
      data = await UserHelper.getUserSettings(userId);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission! SelectedUserId: ' + id + ' ; UserID: ' + userId;
    }
  } else {
    statusCode = 400;
    message = 'Token is not valid or expired';
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
