const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let _value = ApiHelper.getObjectValue(requestBody, 'value', '');
  _value = _value.toLowerCase();

  if (_id < 1) {
    hasError = true;
    message = 'ID is required!';
  }
  let _type = '';
  switch (_value) {
    case 'introvert':
      _type = 'VOTE_CHARACTER_IE';
      _value = 'I';
      break;
    case 'extrovert':
      _type = 'VOTE_CHARACTER_IE';
      _value = 'E';
      break;
    case 'observant':
      _type = 'VOTE_CHARACTER_SN';
      _value = 'S';
      break;
    case 'intuitive':
      _type = 'VOTE_CHARACTER_SN';
      _value = 'N';
      break;
    case 'thinking':
      _type = 'VOTE_CHARACTER_TF';
      _value = 'T';
      break;
    case 'feeling':
      _type = 'VOTE_CHARACTER_TF';
      _value = 'F';
      break;
    case 'judging':
      _type = 'VOTE_CHARACTER_JP';
      _value = 'J';
      break;
    case 'prospecting':
      _type = 'VOTE_CHARACTER_JP';
      _value = 'P';
      break;
    default:
      _value = '';
      break;
  }

  if (_value === '') {
    hasError = true;
    message = 'Value is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      await UserHelper.createUserAction(userId, _type, _id, _value);
      await UserHelper.createUserNotification(_id, userId, 'votedCharacter', _id, 'user', _id);
      statusCode = 200;
      message = 'Success';
      data = await UserHelper.getCharacterData(_id, userId);
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};