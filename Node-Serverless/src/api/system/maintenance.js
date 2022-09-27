const ApiHelper = require('../../helpers/api-helper');


/**
 * @swagger
 * tags:
 *   name: Systems
 * /maintenance:
 *   get:
 *     tags:
 *       - Systems
 *     summary: Check if the app is under maintenance
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return stripe customer id of the user
 */
module.exports.get = async (request) => {

  let maintenanceMode = await ApiHelper.getAppSetting("MAINTENANCE_MODE");
  maintenanceMode = (maintenanceMode * 1) ? true : false;
  let data = { maintenanceMode: maintenanceMode };

  if (maintenanceMode)
    data.maintenanceMessage = await ApiHelper.getAppSetting("MAINTENANCE_MESSAGE");

  let statusCode = 200;
  let message = 'Success';

  return ApiHelper.apiResponse(statusCode, message, data);
};
