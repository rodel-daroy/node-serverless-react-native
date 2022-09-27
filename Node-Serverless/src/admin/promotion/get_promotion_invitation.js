const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const AdminHelper = require('../../helpers/admin-helper');
const models = require('../../../models');

/**
 * @swagger
 * /promotion-invitation-list:
 *   get:
 *     tags:
 *     - Promotion Admin
 *     summary: Get invitation promotion list
 *     description: Get invitation promotion list with code, expiry date, invitee
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: Get the invitation promotion
 */
module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    try {
      data = await models.promotion.findAll();
      statusCode = 200;
      message = 'Success';
    } catch (err) {
      [statusCode, message] = await ErrorHelper.dbError();
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }
  return ApiHelper.apiResponse(statusCode, message, data);
};
