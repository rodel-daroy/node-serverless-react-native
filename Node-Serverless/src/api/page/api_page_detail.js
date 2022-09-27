const ApiHelper = require('../../helpers/api-helper');


module.exports.get = async (id, request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  statusCode = 200;
  message = 'Success';

  data['body'] = await ApiHelper.getStaticPageContent(id);

  return ApiHelper.apiResponse(statusCode, message, data);
};
