const ApiHelper = require('../../helpers/api-helper');
const PostHelper = require('../../helpers/post-helper');


module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let posts = await PostHelper.getAllPosts();

  statusCode = 200;
  message = 'Success' + request.requestContext.identity.sourceIp;
  data['posts'] = posts;

  return ApiHelper.apiResponse(statusCode, message, data);
};