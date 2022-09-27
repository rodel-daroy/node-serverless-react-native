const ApiHelper = require('../helpers/api-helper');

module.exports.get = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let attribute = ApiHelper.getObjectValue(pathParameters, 'attribute', '');
  let response = {};

  switch (object) {
    case 'user':
      response = require('./user/api_user_attribute').get(id, attribute, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.post = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let attribute = ApiHelper.getObjectValue(pathParameters, 'attribute', '');
  let response = {};

  switch (object) {
    case 'user':
      response = require('./user/api_user_attribute').post(id, attribute, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.put = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, '');
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let attribute = ApiHelper.getObjectValue(pathParameters, 'attribute', '');
  let response = {};

  switch (object) {
    case 'user':
      response = require('./user/api_user_attribute').put(id, attribute, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};

module.exports.delete = async (request) => {
  await ApiHelper.saveApiLogs(`${request['httpMethod']}:${request['path']}`, request, response);
  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let attribute = ApiHelper.getObjectValue(pathParameters, 'attribute', '');
  let response = {};

  switch (object) {
    case 'user':
      response = require('./user/api_user_attribute').delete(id, attribute, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};
