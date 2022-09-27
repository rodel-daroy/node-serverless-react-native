const ApiHelper = require('../../helpers/api-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = { ip: request.requestContext.identity.sourceIp };

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let type = ApiHelper.getObjectValue(queryParams, 'type', 'user');

  switch (type) {
    case 'user':
      data['users'] = await this.synzUsers();
      break;
    case 'post':
      data['posts'] = await this.synzPosts();
      break;
    default:
      data['users'] = await this.synzUsers();
      break;
  }

  statusCode = 200;
  message = 'Ok';

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.synzUsers = async () => {

  let synzUsers = [];

  let userIds = await UserHelper.getUnsynzedUserIds();
  for (let id of userIds) {
    synzUsers.push({ id, result: await EsHelper.saveUser(id) })
  }

  return synzUsers;
};

module.exports.synzPosts = async () => {

  let synzPosts = [];

  let ids = await UserHelper.getUnsynzedPostIds();
  for (let id of ids) {
    synzPosts.push(await EsHelper.savePost(id));
  }

  return synzPosts;
};