const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');
const PostHelper = require('../../helpers/post-helper');

const Parser = require('rss-parser');
const Reddit = require('reddit');
const parser = new Parser();

const reddit = new Reddit({
  username: 'Mharris122',
  password: 'imnotdead',
  appId: 'rNhads08Pn9LIg',
  appSecret: 'HL754Se8E-59qSNZIpi3fbJiBPg',
  userAgent: 'Testkga.com/1.0.1 (https://testkga.com)'
})

const userId = 5 // anehzat@gmail.com
const tempAuth = 'duijslxKRkEUwJ6yPDfz';


module.exports.post = async (request) => {

  let statusCode = 200;
  let message = 'Success';
  let data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let from = ApiHelper.getObjectValue(queryParams, 'from', 0);
  let limit = ApiHelper.getObjectValue(queryParams, 'limit', 10);
  let tempAuth = ApiHelper.getObjectValue(request, 'auth', null);

  if (tempAuth != tempAuth) {
    return ApiHelper.apiResponse(404, 'Page not found');
  }

  from = ApiHelper.parseInt(from);
  limit = ApiHelper.parseInt(limit);

  let redditPosts = await reddit.get('/new');
  let list = [];
  let postEntity = {};

  for (let post of redditPosts.data.children) {

    item = post.data;

    postEntity['content'] = ApiHelper.getObjectValue(item, 'title', '...');
    postEntity['is_public'] = true;
    postEntity['is_incognito'] = true;
    postEntity['user_id'] = userId;

    if (item.url) {
      let base64 = await FileHelper.getBase64FromUrl(item.url);
      let fileType = base64.split(';base64,')[0];
      let mimeType = fileType.split(':')[1] || 'image/jpg';
      let onlyBase64 = base64.split(';base64,')[1];
      let filePath = FileHelper.getRandomFilePath(mimeType);

      if (!mimeType || mimeType == 'undefined') continue;

      try {
        let media = await FileHelper.uploadFileFromBase64(userId, base64);
        postEntity['files'] = [media['id']];
      } catch (e) {
        console.log(e);
      }

      list.push(await PostHelper.createNewPost(postEntity, userId));
    }
  }

  data['posts'] = list;

  return ApiHelper.apiResponse(statusCode, message, data);
};