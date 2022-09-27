const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');

/**
 * @openapi
 * /put:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get post data
 *     description: Getting all the promotion list
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                required: true
 *                description: the content of the post
 *            example:
 *              content: "Willing update content for post"
 *     responses:
 *       200:
 *        description: return array of dashboard data
 *
 */

module.exports.get = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let content = ApiHelper.getObjectValue(requestBody, 'content', '');

  let userId = await UserHelper.checkUserAccessToken(request);
  data['userId'] = userId;

  if (userId > 0) {
    let commentRow = await DbHelper.query('SELECT created_by, object_type, object_id FROM comments WHERE id = :id', { id }, 1);
    if (commentRow) {
      if (commentRow['created_by'] === userId) {
        await DbHelper.dbUpdate('comments', { id }, { content });
        if (commentRow['object_type'] === 'POST') {
          await EsHelper.savePost(commentRow['object_id']);
        }
        statusCode = 200;
        message = 'Success';
      } else {
        statusCode = 403;
        message = 'You are not owner!';
      }
    } else {
      statusCode = 404;
      message = 'Post is not found';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.delete = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  data['userId'] = userId;
  if (userId > 0) {
    let commentRow = await DbHelper.query('SELECT created_by, object_type, object_id FROM comments WHERE id = :id', { id }, 1);
    if (commentRow) {
      if (commentRow['created_by'] === userId) {
        await DbHelper.dbUpdate('comments', { id }, { status: 'deleted' });
        if (commentRow['object_type'] === 'POST') {
          await EsHelper.savePost(commentRow['object_id']);
        }
        statusCode = 200;
        message = 'Success';
      } else {
        statusCode = 403;
        message = 'You are not owner!';
      }
    } else {
      statusCode = 404;
      message = 'Post is not found';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
