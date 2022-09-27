const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');
const ViewHelper = require('../../helpers/view-helper');
const models = require('../../../models');

/**
 * @swagger
 * tags:
 *   name: Promotion
 * /promotion-invitation:
 *   post:
 *     tags:
 *       - Promotion
 *     summary: Request invitation with promotion code
 *     description: Invited future user will receive invitational email with promotion code
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              invitee:
 *                type: string
 *                required: true
 *                description: email address of new user
 *            example:
 *              invitee: newUser@email.com
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the success message to new user
 */
module.exports.post = async (request) => {
  let statusCode = 0;
  let message = '';

  let requestBody = ApiHelper.getRequestRawData(request);
  let inviteeEmail = ApiHelper.getObjectValue(requestBody, 'invitee', 0);
  let userId = await UserHelper.checkUserAccessToken(request);
  userId = 10;
  if (userId > 0) {
    statusCode = 200;

    /**
     * Invitation promotion key data
     */
    const INVITATION_REWARD = 30;
    const EMAIL_SUBJECT = 'Invitation email from Kuky';
    const EXPLANATION = `Please join Kuky and get ${INVITATION_REWARD}$ USD`;
    const PROMOTION_EXPIRY_DAY = 30;

    /**
     * Code generation
     * Example: EUR-KYZTQ-2021
     */
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const PROMOTION_TYPE = 'IVT';
    let randomNum = Math.floor(1000 + Math.random() * 9000);
    let randomAlphabet = '';

    for (let i = 0; i < 4; i++) {
      let tempAlp = ALPHABET.split('');
      randomAlphabet += tempAlp[Math.floor(Math.random() * 26)];
    }

    let promotionCode = `${PROMOTION_TYPE}-${randomAlphabet}-${randomNum}`;

    /**
     * Code expiry date
     */
    let promotionCodeExpiryDate = new Date();
    promotionCodeExpiryDate.setDate(promotionCodeExpiryDate.getDate() + PROMOTION_EXPIRY_DAY);

    /**
     * Insert DB
     */
    try {
      await models.Promotions.create({
        user_id: userId,
        promotion_code: promotionCode,
        promotion_type: 'Invitation reward',
        createdAt: new Date(),
        promotion_code_expiry_date: promotionCodeExpiryDate,
        promotion_sub_data: inviteeEmail,
        promotion_status: 'entered',
      });
      /**
       * Invitation email template
       */
      let $body = ViewHelper.promotionNotice({
        EXPLANATION,
        promotionCode,
        promotionCodeExpiryDate,
      });
      await ApiHelper.sendMail([inviteeEmail], EMAIL_SUBJECT, $body);
      statusCode = 200;
      message = 'Success';
    } catch (err) {
      statusCode = 400;
      message = 'DB failure. Please contact Kuky admin';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message);
};
