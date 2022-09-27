const ApiHelper = require('../../helpers/api-helper');


module.exports.get = async (request) => {

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  let type = ApiHelper.getObjectValue(queryParams, 'type', '');
  let response;

  switch (type) {
    case 'vote':
      response = await require('./api_gen_votes').get();
      break;
    case 'user':
      response = await require('./api_gen_users').get();
      break;
    case 'post':
      response = await require('./api_gen_posts').get();
      break;
    case 'skill':
      response = await require('./api_gen_skills').get();
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {});
      break;
  }

  return response;
};