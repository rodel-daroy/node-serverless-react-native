const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await this._getForm(id);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};


module.exports._getForm = async (postId) => {

  let id, content, status;

  let postRow = await DbHelper.query('SELECT * FROM posts WHERE id = :postId', { postId }, 1);
  if (postRow) {
    id = postRow['id'];
    content = (postRow['content_format'] === 'base64' ? ApiHelper.base64Decode(postRow['content']) : postRow['content']);
    status = postRow['status'];
  } else {
    id = 0;
    content = '';
    status = '';
  }

  let controls = [];
  controls.push({ name: 'id', label: '', type: 'hidden', readonly: true, value: id });
  controls.push({ name: 'content', label: 'Content', type: 'textarea', disabled: true, readonly: false, value: content });
  controls.push(
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      disabled: false,
      readonly: false,
      options: [
        { value: 'active', text: 'Active' },
        { value: 'unpublish', text: 'Unpublish' }
      ],
      value: status
    }
  );

  let buttons = [];
  buttons.push({ text: 'Update', method: 'PUT', action: '/admin/post/' + id });

  return { title: 'Edit Post', subTitle: '....', token: 'abc', buttons, controls }
};

module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  if (!ApiHelper.isArray(requestBody)) {
    requestBody = Object.keys(requestBody).map(function (key) {
      return { name: key, value: requestBody[key] }
    })
  }

  let valiationData = this._putValidation(requestBody);
  if (valiationData['status'] !== 200) {
    hasError = true;
    message = valiationData['message'];
    errors = valiationData['errors'];
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await AdminHelper.checkAdminUserAccessToken(request);
    if (userId > 0) {
      let exeResult = await this._putSubmit(id, requestBody);
      statusCode = exeResult['status'];
      message = exeResult['message'];
      data = exeResult['data'];
    } else {
      [statusCode, message] = await ErrorHelper.permissionError();
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports._putValidation = (fields) => {

  let status = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  for (let item of fields) {
    switch (item.name) {
      case 'status':
        if (item.value === '') {
          hasError = true;
          errors['status'] = message = 'Content is required!';
        }
        break;
      default:
        hasError = true;
        errors[item.name] = message = item.name + ' is not found!';
        break;
    }
  }

  if (hasError) {
    status = 400;
  } else {
    status = 200;
    message = 'OK';
  }

  return { status, message, data, errors }
};

module.exports._putSubmit = async (id, fields) => {

  let status = 0, message = '', data = {};
  let hasError = false;
  let updateFields = {};

  for (let item of fields) {
    switch (item.name) {
      case 'status':
        if (item.value !== '') {
          updateFields['status'] = item.value;
        }
        break;
      default:
        break;
    }
  }

  let result = await DbHelper.dbUpdate('posts', { id }, updateFields);

  if (result > 0) {
    hasError = false;
    await EsHelper.savePost(id);

    if ((updateFields['status'] || '') == 'unpublished') {
      let userId = 0;
      let postRow = await DbHelper.query('SELECT created_by FROM posts WHERE id = :id', { id }, 1);
      if (postRow) {
        userId = postRow['created_by'];
      }
      await UserHelper.createUserNotification(userId, 9, 'UNPUBLISHED_POST', id, 'post', id);
    }
  } else {
    hasError = true;
  }

  if (hasError) {
    status = 400;
    message = 'Cant update the post! debug:' + result;
  } else {
    status = 200;
    message = 'OK ' + result;
    data = await AdminHelper.getPostItem(id);
  }

  return { status, message, data }
};