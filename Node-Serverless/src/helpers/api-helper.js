const AWS = require('aws-sdk');
const axios = require('axios');
const base64 = require('base-64');
const utf8 = require('utf8');

const DbHelper = require('./db-helper');

const LocationObject = require('../models/LocationObject');


exports.getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
exports.getRandomBoolean = () => Math.random() >= 0.5;
exports.getArrayRandomValue = arr => arr[Math.floor(Math.random() * arr.length)];
exports.getCurrentUnixTime = () => Math.round(new Date().getTime() / 1000);
exports.getObjectValue = (object, key, defaultValue = '') => object && object.hasOwnProperty(key) ? object[key] : defaultValue;
exports.getAccessTokenFromRequest = request => {

  let headers = this.getRequestHeaders(request);
  let token = this.getObjectValue(headers, 'access-token', '');

  if (token === '') {
    token = this.getObjectValue(headers, 'x-api-key', '');
  }

  return token;
};
exports.getLocationFromIpAddress = async (ipAddress) => {

  let data = {};

  let ipRow = await DbHelper.query('SELECT ip, data FROM ips WHERE ip = :ip', { ip: ipAddress }, 1);
  if (ipRow) {
    data = this.parseJson(ipRow['data']);
  } else {
    const url = `http://api.ipstack.com/${ipAddress}?access_key=a664db1d5307c85c7850a8b12ac697ae&format=1`;
    const jsonData = await this.apiGet(url, {});
    data = jsonData;
    await DbHelper.dbInsert('ips', { ip: ipAddress, data: JSON.stringify(jsonData) });
  }

  return { latitude: this.getObjectValue(data, 'latitude', ''), longitude: this.getObjectValue(data, 'longitude', '') }
};
exports.getBase64FromUrl = async url => {
  return await axios.get(url, { responseType: 'arraybuffer' })
    .then(res => {
      let prefix = 'data:' + res.headers['content-type'] + ';base64,';
      return prefix + new Buffer(res.data, 'binary').toString('base64');
    })
    .catch(err => { return '' });
};
exports.getStaticPageContent = async (code) => {

  let content = '';

  let staticPageRow = await DbHelper.query('SELECT body FROM static_pages WHERE code = :code', { code }, 1);
  if (staticPageRow) {
    content = staticPageRow['body'];
  }

  return content;
};
exports.getRandomOtp = (length = 6) => {
  return Math.random().toString().substr(2, length);
}
exports.getEdmData = async (edmCode, subjectParams, bodyParams, defaultSubject = '...', defaultBody = '...') => {

  let subject = '';
  let body = '';

  let edmTemplateRow = await DbHelper.query('SELECT * FROM edm_templates WHERE code = :edmCode', { edmCode }, 1);
  if (edmTemplateRow) {
    subject = edmTemplateRow['title'];
    body = edmTemplateRow['body'];
  } else {
    subject = defaultSubject;
    body = defaultBody;
  }

  let item;

  let arrSubjectParams = Object.keys(subjectParams).map(function (key) {
    return { 'key': key, 'value': subjectParams[key] };
  });

  for (let item of arrSubjectParams) {
    subject = subject.replace('[' + item['key'] + ']', item['value']);
  }

  let arrBodyParams = Object.keys(bodyParams).map(function (key) {
    return { 'key': key, 'value': bodyParams[key] };
  });

  for (let item of arrBodyParams) {
    body = body.replace('[' + item['key'] + ']', item['value']);
  }

  return { subject, body };
};


exports.sendPushNotification = async (notification, data, to) => {

  let url = 'https://fcm.googleapis.com/fcm/send';
  let headers = { 'Authorization': 'key=' + process.env.FIREBASE_ADMIN_KEY };
  let post;
  let result;

  if (to.length > 50) {
    post = {
      priority: 'normal',
      notification: notification,
      data: data,
      to: to,
      android: { ttl: '86400s', notification: { click_action: 'OPEN_ACTIVITY_1' } },
      apns: { headers: { 'apns-priority': '5' }, payload: { aps: { category: 'NEW_MESSAGE_CATEGORY' } } },
      webpush: { headers: { TTL: '86400' } }
    };

    result = await this.apiPost(url, post, headers);

    await DbHelper.dbInsert('notification_logs',
      {
        request: JSON.stringify({ url, data: post, headers }),
        response: JSON.stringify(result),
        ref_id: to,
        created_at: this.getCurrentUnixTime(),
        status: ''
      }
    );
  }

  return { request: { data: post }, response: result }
};

exports.sendSMS = async (PhoneNumber, Message) => {

  let params = { Message, PhoneNumber };

  let publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

  return await publishTextPromise.then(data => { return data.MessageId }).catch(err => { return null });
};

exports.sendMail = async (toAddresses, subject, body, replyTo = null) => {

  AWS.config.update({ region: 'ap-southeast-2' });
  for (let index in toAddresses) {
    try {
      let params = {
        Destination: { ToAddresses: [toAddresses[index]] },
        Message: {
          Body: {
            Html: { Charset: 'UTF-8', Data: body },
            Text: { Charset: 'UTF-8', Data: 'TEXT_FORMAT_BODY' }
          },
          Subject: { Charset: 'UTF-8', Data: subject }
        },
        Source: 'Kuky Administrator <noreply@kuky.com>',
        ReplyToAddresses: [replyTo ? replyTo : 'admin@kuky.com']
      };
      let sendEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
      await sendEmailPromise.then(data => { return data }).catch(err => { return err; });;
    } catch (err) {

      return err;
    }
  }

  return 'Email sent complete';
};


exports.apiGet = async (url, headers = {}) => {
  return await axios.get(url, { headers }).then(response => response.data).catch(error => { return null });
};
exports.apiGetWithBody = async (url, data = {}, headers = {}) => {
  return await axios.get(url, { data, headers }).then(response => { return response.data }).catch(error => { return null });
};
exports.apiPost = async (url, data, headers = {}) => {

  return await axios.post(url, data, { headers: headers })
    .then(response => {
      return { status: 200, message: 'Success', data: response.data }
    })
    .catch(error => {

      let response = error.response || {};
      let status = this.getObjectValue(error, 'status', 400);
      let message = this.getObjectValue(response, 'message', 'Something was wrong!');
      let responseData = this.getObjectValue(response, 'data', {});
      let responseDataError = this.getObjectValue(responseData, 'error', {});
      let responseDataErrorMessage = this.getObjectValue(responseDataError, 'message', message);

      return { status: status, message: responseDataErrorMessage, data: responseDataError }
    });
};
exports.apiPut = async (url, data, headers = {}) => {
  return await axios.put(url, data, { headers }).then(response => { return response.data }).catch(error => { return null });
};
exports.apiRequest = async (url, method, data, headers = {}) => {
  return await axios.request({ headers, data, method, url }).then(response => { return response.data }).catch(error => { return null });
};
exports.apiResponse = (status, message, data, errors = {}) => {

  let response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify({ status, message, data, errors })
  };

  if (data && data.balanceUSD)
    response.body.balanceUSD = data.balanceUSD;

  return response;
};
exports.liteApiGet = async (url, headers = {}) => {
  return await axios.get(url, { headers }).then(response => { return response.data.data }).catch(error => { return null });
};
exports.liteApiPost = async (url, data, headers = {}) => {
  return await axios.post(url, data, { headers }).then(response => { return response.data.data }).catch(error => { return null });
};


exports.parseAmount = str => {
  let amount = parseFloat(str);
  amount = amount ? amount : 0;
  amount = amount < 0 ? 0 : amount;
  return amount;
};
exports.parseStringToLocationObject = str => {

  let locationObject = new LocationObject();
  let latLngData = this.isJson(str) ? JSON.parse(str) : {};
  let lat = this.getObjectValue(latLngData, 'lat', '');
  let lng = this.getObjectValue(latLngData, 'lng', '');
  lat = this.parse2Float(lat);
  lng = this.parse2Float(lng);

  if (lat !== 0 && lng !== 0) {
    locationObject.lat = lat;
    locationObject.lon = lng;
  } else {
    locationObject = null;
  }

  return locationObject;
};
exports.parseInt = str => {
  let value = parseInt(str);
  return !isNaN(value) ? value : 0;
};
exports.parse2Float = str => {
  let value = parseFloat(str);
  return !isNaN(value) ? value : 0;
};


exports.saveApiLogs = async (api, request, response) => {

  if (process.env.API_DEBUG) {
    return await DbHelper.dbInsert('api_logs',
      {
        api: api,
        request: JSON.stringify({
          headers: request['headers'],
          queryStringParameters: request['queryStringParameters'],
          body: request['body']
        }),
        response: '',
        created_at: this.getCurrentUnixTime(),
        status: 200
      }
    );
  }
};
exports.saveSendbirdLogs = async (api, request, response) => {

  return await DbHelper.dbInsert('sendbird_logs',
    {
      api: api,
      request: JSON.stringify({
        headers: request['headers'],
        queryStringParameters: request['queryStringParameters'],
        body: request['body']
      }),
      response: '',
      created_at: this.getCurrentUnixTime(),
      status: 200
    }
  );
};

exports.basicAuthEncode = (username, password) => {
  if (!username || !password) return false;
  return "Basic " + this.base64Encode(username + ':' + password);
};
exports.base64Encode = str => {
  try {
    let bytes = utf8.encode(str);
    return base64.encode(bytes);
  } catch (e) {
    return str;
  }
};
exports.base64Decode = base64Str => {
  try {
    let bytes = base64.decode(base64Str);
    return utf8.decode(bytes);
  } catch (e) {
    return base64Str;
  }
};


exports.isEmptyString = (value) => { return value !== null && value.trim() === '' };
exports.isNotEmptyString = str => { return true };
exports.isNumber = str => { str = parseInt(str); return Number.isInteger(str) };
exports.isArray = str => Array.isArray(str);
exports.isEmail = str => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(str).toLowerCase());
};
exports.isPhone = str => {
  let phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let digits = str.replace(/\D/g, '');
  return phoneRe.test(digits);
};
exports.isJson = text => {

  let result = true;

  try {
    JSON.parse(text);
  } catch (e) {
    result = false;
  }

  return result;
};


exports.convertToSlug = (str) => {
  return str.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, '')
};
exports.convertObject2Array = obj => {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};
exports.convertUnixTimeToTime = (UNIX_timestamp, defaultValue = null) => {
  return UNIX_timestamp ? new Date(UNIX_timestamp * 1000) : defaultValue;
};
exports.convertUnixTimeToShortTime = (UNIX_timestamp, defaultValue = null) => {
  return UNIX_timestamp ? new Date(UNIX_timestamp * 1000).toLocaleString('en-AU', {}) : defaultValue;
};


exports.jsonEncode = obj => JSON.stringify(obj);
exports.jsonDecode = (text, defaultValue = null) => { return this.isJson(text) ? JSON.parse(text) : defaultValue };
exports.parseJson = text => { return this.isJson(text) ? JSON.parse(text) : {} };


exports.getRequestHeaders = request => this.getObjectValue(request, 'headers', {});
exports.getRequestRawData = request => this.parseJson(this.getObjectValue(request, 'body', {}));
exports.getRequestPathParameters = request => this.getObjectValue(request, 'pathParameters', {});

exports.hashString = str => {
  return (Buffer.from(this.getCurrentUnixTime() + '').toString('base64') + '' + Buffer.from(str).toString('base64') + '+kuky2019===');
};


exports.getAppSetting = async ($code) => {
  let info = await DbHelper.query("SELECT value FROM app_settings WHERE code=:code", { code: $code });

  if (!info.length)
    return false;

  return info[0].value;

};
