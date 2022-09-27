const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');
const DbHelper = require('../../helpers/db-helper');

/**
 * @swagger
 * tags:
 *   name: Post
 * /post:
 *   post:
 *     tags:
 *       - Post
 *     summary: Sharing post count
 *     description: API to count the post on sharing
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              postId:
 *                type: number
 *                required: true
 *                description: shared post
 *            example:
 *              postId: 13293
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the sharing post count is successful or failed
 */
module.exports.post = async (request) => {
  let statusCode = 0,
    message = '';
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _postId = ApiHelper.getObjectValue(requestBody, 'postId', 0);

  if (_postId < 1) {
    errors['postId'] = message = 'Post id is required!';
    hasError = true;
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      if (hasError) {
        statusCode = 400;
      } else {
        data = await DbHelper.query(
          'UPDATE posts SET total_shared = total_shared + 1 WHERE id=:_postId',
          { _postId }
        );
        if (data.changedRows) {
          message = 'Post sharing count successful';
          statusCode = 200;
        } else {
          message = 'Post sharing count failed';
          statusCode = 401;
        }
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }
  return ApiHelper.apiResponse(statusCode, message, errors);
};
