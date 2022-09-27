const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let type = ApiHelper.getObjectValue(requestBody, 'type', '');
  type = type.toUpperCase();
  let value = 'REPORT';

  if (id < 1) {
    hasError = true;
    message = 'ID is required!';
  }
  if (type === '') {
    hasError = true;
    message = 'Object is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      await UserHelper.createUserAction(userId, 'REPORT_' + type, id, value);
      data = await UserHelper.getVoteUpDownData(type, id, userId);
      switch (type) {
        case 'POST':
        case 'VOTE_POST':
          await EsHelper.savePost(id);
          break;
        case 'COMMENT':
          let commentRow = await DbHelper.query('SELECT object_type, object_id FROM comments WHERE id = :id', { id }, 1);
          if (commentRow) {
            await EsHelper.savePost(commentRow['object_id']);
          }
          break;
        default:
          break;
      }
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.patch = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let type = ApiHelper.getObjectValue(requestBody, 'type', '');
  type = type.toUpperCase();
  let value = 'REPORT';

  if (id < 1) {
    hasError = true;
    message = 'ID is required!';
  }
  if (type === '') {
    hasError = true;
    message = 'type is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    let reportType = '';
    if (userId > 0) {
      switch (type) {
        case 'SEXUAL':
          reportType = 'total_reports_sexual';
          break;
        case 'OFFENSIVE':
          reportType = 'total_reports_offensive';
          break;
        case 'FAKE':
          reportType = 'total_reports_fake';
          break;
        case 'DELETE':
          reportType = 'total_reports_delete';
          break;
        default:
          break;
      }
      let currentTime = ApiHelper.getCurrentUnixTime();
      let reportTypeCount = await DbHelper.query(`SELECT ${reportType} FROM posts WHERE id = :id`, { id }, 1);
      reportTypeCount = ++reportTypeCount[reportType];
      await DbHelper.dbUpdate('posts', { id }, { updated_at: currentTime, [reportType]: reportTypeCount });
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};