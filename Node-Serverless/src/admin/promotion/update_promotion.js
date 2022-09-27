const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const AdminHelper = require('../../helpers/admin-helper');
const models = require('../../../models');

/**
 * @swagger
 * /update-promotion:
 *   post:
 *     tags:
 *       - Promotion Admin
 *     summary: Update the promotion
 *     description: Updating specific promotion name, period, reward amount explanatation
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the promotion code
 *              name:
 *                type: string
 *                required: false
 *                description: changing the name of promotion event
 *              start_date:
 *                type: string
 *                required: false
 *                description: Set start date of promotion
 *              end_date:
 *                type: string
 *                required: false
 *                description: Set end date of promotion
 *              explanation:
 *                type: string
 *                required: false
 *                description: Add the explanation of the promotion
 *              reward_amount:
 *                type: number
 *                required: false
 *                description: Promotion reward amount in USD
 *            example:
 *              id: 1,
 *              name: invitation,
 *              start_date: 2022/3/4
 *              end_date: 2022/3/4
 *              explanation: This is the invitation promotion, please join and receive rewards
 *              reward_amount: 30
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: Update the promotion admin information
 */
module.exports.post = async (request) => {
  let statusCode = 0,
    message = '';

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', '');
  let name = ApiHelper.getObjectValue(requestBody, 'name', '');
  let start_date = ApiHelper.getObjectValue(requestBody, 'start_date', '');
  let end_date = ApiHelper.getObjectValue(requestBody, 'end_date', '');
  let explanation = ApiHelper.getObjectValue(requestBody, 'explanation', '');
  let reward_amount = ApiHelper.getObjectValue(requestBody, 'reward_amount', '');

  let hasError = false;

  let userId = await AdminHelper.checkAdminUserAccessToken(request);

  if (!name && !start_date && !end_date && !explanation) {
    hasError = true;
    [statusCode, message] = await ErrorHelper.mandatoryInputError();
  } else if (!userId) {
    hasError = true;
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  if (!hasError) {
    try {
      await models.promotion_setting.update({ name, start_date, end_date, reward_amount, explanation }, { where: { id } });
      statusCode = 200;
      message = 'Promotion has successfully updated';
    } catch (err) {
      [statusCode, message] = await ErrorHelper.dbError();
    }
  }
  return ApiHelper.apiResponse(statusCode, message);
};
