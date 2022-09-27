const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');


/**
 * @swagger
 * tags:
 *   name: Setting
 * /admin/nsfw:
 *   post:
 *     tags:
 *       - Setting
 *     summary: Admin nsfw labels update
 *     description: Admin nsfw labels update
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nsfw:
 *                type: string
 *                required: true
 *                example: 'blood, violence'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return success label
 *
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let labels = ApiHelper.getObjectValue(requestBody, 'nsfw', '');

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {

    await DbHelper.dbUpdate('app_settings', { id: 5 }, { value: labels });

    statusCode = 200;
    message = 'Success';
    data = {}
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};