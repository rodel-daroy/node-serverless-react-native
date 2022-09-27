const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');

/**
 * @swagger
 * tags:
 *   name: Setting
 * /admin/labels:
 *   get:
 *     tags:
 *       - Setting
 *     summary: Admin nsfw, over eighteen labels fetch API
 *     description: Will get array with nsfw and eighteen_over object with labels array
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return labels for NSFW, over18 type, labels in data array
 *
 */
module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    data = await DbHelper.query(
      'SELECT * from app_settings where id between 5 and 6'
    );
    data = data.map((el) => {
      return {
        type: el['code'],
        labels: el['value'].split(','),
      };
    });
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
