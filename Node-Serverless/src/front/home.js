const ApiHelper = require('../helpers/api-helper');
const UserHelper = require('../helpers/user-helper');
const ViewHelper = require('../helpers/view-helper');


module.exports.get = async (event, context, callback) => {

  let data = { name: 'Guest', token: '', debug: '' };

  let queryParams = ApiHelper.getObjectValue(event, 'queryStringParameters', {});
  let _id = ApiHelper.getObjectValue(queryParams, 'id', '');
  if (_id !== '') {
    data.debug = await UserHelper.sendCustomNotification(_id, 'sendbird', 'abc', 'Hello!', 10);
  }

  return {
    statusCode: 200,
    body: ViewHelper.renderView('front/home', data),
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  };
};