const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');


module.exports.get = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data = await this._putForm(id);
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.put = async (id, request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let valiationData = this._putFormValidation(requestBody);
  if (valiationData['status'] != 200) {
    hasError = true;
    message = valiationData['message'];
    errors = valiationData['errors'];
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await AdminHelper.checkAdminUserAccessToken(request);
    if (userId > 0) {
      let exeResult = await this._putFormSubmit(id, requestBody);
      statusCode = exeResult['status'];
      message = exeResult['message'];
      data = exeResult['data'];
    } else {
      [statusCode, message] = await ErrorHelper.permissionError();
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports._putForm = async (edmId) => {

  let id, code, title, body;

  let edmTemplateRow = await DbHelper.query('SELECT id, code, title, body FROM edm_templates WHERE id = :edmId', { edmId }, 1);
  if (edmTemplateRow) {
    id = edmTemplateRow['id'];
    code = edmTemplateRow['code'];
    title = edmTemplateRow['title'];
    body = edmTemplateRow['body'];
  } else {
    id = 0;
    code = '';
    title = '';
    body = '';
  }

  let controls = [];
  controls.push({ name: 'id', label: '', type: 'hidden', readonly: true, value: id });
  controls.push({ name: 'code', label: 'Code', type: 'textfield', disabled: true, readonly: true, value: code });
  controls.push({ name: 'title', label: 'Title', type: 'textfield', disabled: true, readonly: false, value: title });
  controls.push({ name: 'body', label: 'Body', type: 'textarea', disabled: true, readonly: false, value: body });

  let buttons = [];
  buttons.push({ text: 'Update', method: 'PUT', action: '/admin/edm/' + id });

  return { title: 'Edit EDM', subTitle: '....', token: 'abc', buttons: buttons, controls: controls }
};

module.exports._putFormValidation = (fields) => {

  let status = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  for (let item of fields) {
    switch (item.name) {
      case 'title':
        if (item.value === '') {
          hasError = true;
          errors['title'] = message = 'Title is required!';
        }
        break;
      case 'body':
        if (item.value === '') {
          hasError = true;
          errors['body'] = message = 'Body is required!';
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
    message = 'OK';
    status = 200;
  }

  return { status, message, data, errors }
};

module.exports._putFormSubmit = async (id, fields) => {

  let status = 0, message = '', data = {};
  let hasError = false;
  let updateFields = {};

  for (let item of fields) {
    switch (item.name) {
      case 'title':
        if (item.value !== '') {
          updateFields['title'] = item.value;
        }
        break;
      case 'body':
        if (item.value !== '') {
          updateFields['body'] = item.value;
        }
        break;
      default:
        break;
    }
  }

  let result = await DbHelper.dbUpdate('edm_templates', { id }, updateFields);

  if (result > 0) {
    hasError = false;
  } else {
    hasError = true;
  }

  if (hasError) {
    status = 400;
    message = 'Fail ' + result;
  } else {
    status = 200;
    message = 'OK ' + result;
    data = await _getEdmItem(id);
  }

  return { status, message, data }
};

const _getEdmItem = async (id) => {

  let item;

  let edmTemplateRow = await DbHelper.query('SELECT p.id, p.code, p.title, p.body FROM edm_templates p WHERE p.id = :edmId', { edmId: id }, 1);

  if (edmTemplateRow) {
    item = {
      type: 'node_item',
      data: {
        buttons: [{ title: 'Edit', type: 'edit' }],
        id: id,
        type: 'edm',
        content: `${edmTemplateRow['code']} - ${edmTemplateRow['title']}`
      }
    };
  } else {
    item = null;
  }

  return item;
};