const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const PostHelper = require('../../helpers/post-helper');


/**
 * @swagger
 * tags:
 *   name: Posts
 * /admin/posts:
 *   get:
 *     tags:
 *       - Posts
 *     description: Get a full list of posts
 *     parameters:
 *       - in: path
 *         name: pageSize
 *         schema:
 *           type: number
 *       - in: path
 *         name: pageNumber
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *        description: return array of posts
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let pageSize = ApiHelper.getObjectValue(queryParams, 'pageSize', 30);
  let pageNumber = ApiHelper.getObjectValue(queryParams, 'pageNumber', 1);

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {

    let totalPosts = await DbHelper.query('SELECT p.*, up.full_name FROM posts p LEFT JOIN user_profiles up ON up.user_id = p.created_by ORDER BY id DESC');
    let totalCount = totalPosts.length;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pagePosts = totalPosts.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
    let pageList = [];
    for (let post of pagePosts) {
      let postFiles = JSON.parse(post.files);
      let postData = [];
      postFiles.map(async el => {
        let fileData = await DbHelper.query('SELECT uri, image_tag FROM files where id=:id', {id: el}, 1);
        postData.push({
          uri: fileData.uri,
          labels: fileData.image_tag,
        });
      });
      let item = {
        id: post.id,
        content: post.content_format === 'base64' ? ApiHelper.base64Decode(post.content) : post.content,
        created_at: ApiHelper.convertUnixTimeToShortTime(post.created_at),
        status: post.status,
        media: postData,
        user: { full_name: post.full_name }
      }
      item = await PostHelper.checkNsfwEighteenOver(item);
      pageList.push(item)
    }

    statusCode = 200;
    message = 'Success';
    data = { totalCount, pageCount, pageSize, pageNumber, pageList }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
