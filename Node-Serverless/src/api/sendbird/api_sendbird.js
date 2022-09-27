const ApiHelper = require('../../helpers/api-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  await ApiHelper.saveSendbirdLogs(`${request['httpMethod']}:${request['path']}`, request, '');

  let requestBody = ApiHelper.getRequestRawData(request);
  let sender = ApiHelper.getObjectValue(requestBody, 'sender', {});
  let nickname = ApiHelper.getObjectValue(sender, 'nickname', '...');
  let senderId = ApiHelper.getObjectValue(sender, 'user_id', '...');
  let payload = ApiHelper.getObjectValue(requestBody, 'payload', {});
  let payloadMessage = ApiHelper.getObjectValue(payload, 'message', '...');
  let noticafitionTitle = ` has sent you a message '${payloadMessage}'`;
  let noticafitionMessage = `${nickname} has sent you a message: '${payloadMessage}'`;
  let channel = ApiHelper.getObjectValue(requestBody, 'channel', {});
  let channelUrl = ApiHelper.getObjectValue(channel, 'channel_url', '...');
  let selectedUserIds = [];
  let members = ApiHelper.getObjectValue(requestBody, 'members', []);
  for (let member of members) {
    selectedUserIds.push(member['user_id']);
  }

  if (nickname === '') {
    hasError = true;
    errors['nickname'] = message = 'Sender is required!';
  }
  if (payloadMessage === '') {
    hasError = true;
    errors['message'] = message = 'Message is required!';
  }
  if (selectedUserIds.length < 1) {
    hasError = true;
    errors['members'] = message = 'Member is required!';
  }

  let $logs = [];
  if (hasError) {
    statusCode = 400;
    data['debug'] = requestBody;
  } else {
    let selectedUserId = 0;
    for (let key in selectedUserIds) {
      selectedUserId = selectedUserIds[key] || 0;
      $logs.push(UserHelper.sendCustomNotification(selectedUserId, 'sendbird', selectedUserId, noticafitionTitle, noticafitionMessage, senderId));
    }

    statusCode = 200;
    data['logs'] = $logs;
    data['msg'] = noticafitionMessage;
    data['selectedUserIds'] = selectedUserIds;
    message = 'Success';
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};