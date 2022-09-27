const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let _type = ApiHelper.getObjectValue(requestBody, 'type', '');
  _type = _type.toUpperCase();
  let _value = ApiHelper.getObjectValue(requestBody, 'value', '');
  _value = _value.toUpperCase();

  if (_id < 1) {
    hasError = true;
    message = 'ID is required!';
  }
  if (_type === '') {
    hasError = true;
    message = 'Type is required!' + _type;
  }
  if (_value === '') {
    hasError = true;
    message = 'Value is required!' + _value;
  }

  if (hasError) {
    statusCode = 400;
    data['debug'] = requestBody;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let objectType = _type.replace('VOTE_', '');
      await UserHelper.createUserAction(userId, 'VOTE_' + objectType, _id, _value);
      data = await UserHelper.getVoteUpDownData(objectType, _id, userId);
      switch (objectType) {
        case 'POST':
        case 'VOTE_POST':
          await EsHelper.savePost(_id);
          break;
        case 'COMMENT':
          let commentRow = await DbHelper.query('SELECT object_type, object_id FROM comments WHERE id = :id', { id: _id }, 1);
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