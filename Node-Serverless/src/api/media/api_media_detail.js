const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @openapi
 * tags:
 *   name: Media
 * /media/{id}:
 *   post:
 *     tags:
 *       - Media
 *     summary: Media upload
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              base64:
 *                type: string
 *                format: base64
 *                description: base64 version of the image. Please use a tool like https://www.base64-image.de/
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return firebase user data. data.logged.idToken is to be used as an access-token
 *
 */
module.exports.post = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;
  let requestBody = ApiHelper.getRequestRawData(request);

  let base64 = ApiHelper.getObjectValue(requestBody, 'base64', '');

  if (ApiHelper.isEmptyString(base64)) {
    hasError = true;
    message = 'File is invalid!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let res = await FileHelper.uploadFileFromBase64(userId, base64);
      data['file_id'] = res['id'];
      data['file_url'] = res['url'];
      data['s3_etag'] = res['etag'];
      message = res['message'];
      if (res['id'] > 0) {
        statusCode = 200;
      } else {
        statusCode = 500;
      }

    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
