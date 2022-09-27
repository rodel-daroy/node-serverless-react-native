const ApiHelper = require('../../helpers/api-helper');


module.exports.put = async (id, attribute, request) => {

  let response;

  switch (attribute) {
    case 'settings':
      response = await require('./api_user_settings').put(id, request);
      break;
    case 'account':
      response = await require('./api_user_account').put(id, request);
      break;
    case 'avatar':
      response = await require('./api_user_avatar').put(id, request);
      break;
    case 'background':
      response = await require('./api_user_background').put(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {}, {});
      break;
  }

  return response;
};

module.exports.delete = async (id, attribute, request) => {

  let response;

  switch (attribute) {
    case 'account':
      response = await require('./api_user_account').delete(id, request);
      break;
    case 'skill':
      response = await require('./api_user_skill').delete(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {}, {});
      break;
  }

  return response;
};

module.exports.get = async (id, attribute, request) => {

  let response;

  switch (attribute) {
    case 'nearby':
      response = await require('./api_user_nearby').get(id, request);
      break;
    case 'settings':
      response = await require('./api_user_settings').get(id, request);
      break;
    case 'account':
      response = await require('./api_user_account').get(id, request);
      break;
    case 'skill':
      response = await require('./api_user_skill').get(id, request);
      break;
    case 'post':
      response = await require('./api_user_post').get(id, request);
      break;
    case 'friend':
      response = await require('./api_user_friend').get(id, request);
      break;
    case 'suggest':
      response = await require('./api_user_suggest').get(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {}, {});
      break;
  }

  return response;
};

module.exports.post = async (id, attribute, request) => {

  let response;

  switch (attribute) {
    case 'email':
      response = await require('./api_user_email').post(id, request);
      break;
    case 'phone':
      response = await require('./api_user_phone').post(id, request);
      break;
    case 'account':
      response = await require('./api_user_account').post(id, request);
      break;
    case 'skill':
      response = await require('./api_user_skill').post(id, request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {}, {});
      break;
  }

  return response;
};