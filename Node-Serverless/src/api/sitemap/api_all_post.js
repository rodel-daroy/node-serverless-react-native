const slug = require('slug');
const ApiHelper = require('../../helpers/api-helper');
const PostHelper = require('../../helpers/post-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let posts = await PostHelper.getPosts({ limit: 1500 });
  let filteredPosts = posts.map(function (post) {
    return { id: post.id, content: post.content, slug: slug(post.content.slice(0, 30)), createdAt: post.createdAt }
  })

  statusCode = 200;
  message = 'Success: ' + request.requestContext.identity.sourceIp;
  data['posts'] = filteredPosts;

  return ApiHelper.apiResponse(statusCode, message, data);
};