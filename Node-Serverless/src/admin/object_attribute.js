const ApiHelper = require('../helpers/api-helper');


module.exports.post = async (request) => {

  let pathParameters = ApiHelper.getObjectValue(request, 'pathParameters', {});
  let object = ApiHelper.getObjectValue(pathParameters, 'object', '');
  let id = ApiHelper.getObjectValue(pathParameters, 'id', '');
  let attribute = ApiHelper.getObjectValue(pathParameters, 'attribute', '');
  let response = {};

  switch (object) {
    case 'user':
      response = require('../api/user/api_user_attribute').post(id, attribute, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Api is not found', {});
      break;
  }

  return response;
};
