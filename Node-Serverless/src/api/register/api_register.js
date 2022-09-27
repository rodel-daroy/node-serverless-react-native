const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');
const PromotionHelper = require('../../helpers/promotion-helper');

/**
 * @swagger
 * tags:
 *   name: Auth
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User registration
 *     description: This information will create user with provided name
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *                description: username
 *              full_name:
 *                type: string
 *                required: true
 *                description: Version by device
 *              avatar_base64:
 *                type: string
 *                required: true
 *                description: preset_firebase
 *              promotion_code:
 *                type: string
 *                required: false
 *                description: preset_firebase
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return user data include token and address, promotion code can be apply
 *
 */

module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;
  let promotionValidation = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let name = ApiHelper.getObjectValue(requestBody, 'username', '') + '';
  let fullName = ApiHelper.getObjectValue(requestBody, 'full_name', '');
  let avatarBase64 = ApiHelper.getObjectValue(requestBody, 'avatar_base64', '');
  let promotion_code = ApiHelper.getObjectValue(requestBody, 'promotion_code', '');

  name = name.toLowerCase();
  if (name === '') {
    errors['username'] = 'Username is required!';
    hasError = true;
  }
  if (fullName === '') {
    errors['full_name'] = 'Fullname is required!';
    hasError = true;
  }

  if (promotion_code) {
    promotionValidation = await PromotionHelper.validatePromotionCodeRegister(promotion_code, name);
    if (promotionValidation.statusCode !== 200) {
      hasError = true;
    }
  }

  if (hasError) {
    statusCode = 400;
    message = promotionValidation.message ? promotionValidation.message : 'Params are invalid!';
  } else {
    await UserHelper.createNewUser(name, fullName, avatarBase64);
    let userId = await UserHelper.getUserIdByEmail(name);
    if (userId) {
      if (promotion_code) {
        let sendMoneyResult = await PromotionHelper.sendMoneyAfterInvitationPromotionRegister(promotion_code, userId);
        if (sendMoneyResult) {
          statusCode = 200;
          message = 'Register and promotion claimed successfully';
        } else {
          statusCode = 400;
          message = 'Promotion claimed failed';
        }
      } else {
        await UserHelper.genUserCode(name, 6);
        data.id = userId;
        message = 'Success';
        statusCode = 200;
      }
    } else {
      statusCode = 400;
      message = 'Error';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
