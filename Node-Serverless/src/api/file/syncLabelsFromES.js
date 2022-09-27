const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let requestBody = ApiHelper.getRequestRawData(request);

  await FileHelper.syncLabelsFromES(requestBody);

  statusCode = 200;
  message = 'Successfully synced';

  return ApiHelper.apiResponse(statusCode, message, data);
}