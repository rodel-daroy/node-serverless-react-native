const ApiHelper = require('../helpers/api-helper');


module.exports.get = async (request) => {

  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'page':
      response = require('./page/admin_page_detail').get(id, request);
      break;
    case 'edm':
      response = require('./edmTemplates/edmTemplates-detail').get(id, request);
      break;
    case 'post':
      response = require('./post/admin_post_detail').get(id, request);
      break;
    case 'user':
      response = require('./user/admin_user_detail').get(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.put = async (request) => {

  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let response = {};

  switch (object) {
    case 'post':
      response = require('./post/admin_post_detail').put(id, request);
      break;
    case 'page':
      response = require('./page/admin_page_detail').put(id, request);
      break;
    case 'edm':
      response = require('./edmTemplates/edmTemplates-detail').put(id, request);
      break;
    case 'user':
      response = require('./user/admin_user_detail').put(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};