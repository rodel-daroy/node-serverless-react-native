const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const EsHelper = require('../../helpers/es-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async (id, request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    data = await this._putForm(id);
    statusCode = 200;
    message = 'Success';
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
  if (!ApiHelper.isArray(requestBody)) {
    requestBody = Object.keys(requestBody).map(function (key) {
      return { name: key, value: requestBody[key] }
    })
  }

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

module.exports._putForm = async (userId) => {

  let id, email, fullName, status;

  let userRow = await DbHelper.query('SELECT u.id, u.email, u.status, up.full_name FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = :userId', { userId }, 1);
  if (userRow) {
    id = userRow['id'];
    email = userRow['email'];
    fullName = userRow['full_name'];
    status = userRow['status'];
  } else {
    id = 0;
    email = '';
    fullName = '';
    status = '';
  }

  let controls = [];
  controls.push({ name: 'id', label: '', type: 'hidden', readonly: true, value: id });
  controls.push({ name: 'email', label: 'Email', type: 'email', disabled: true, readonly: true, value: email });
  controls.push({ name: 'full_name', label: 'Full Name', type: 'textfield', disabled: true, readonly: false, value: fullName });
  controls.push(
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      disabled: false,
      readonly: false,
      options: [
        { value: 'new', text: 'New' },
        { value: 'fake', text: 'Fake' },
        { value: 'active', text: 'Active' },
        { value: 'unpublish', text: 'Unpublish' }
      ],
      value: status
    }
  );

  let buttons = [];
  buttons.push({ text: 'Update', method: 'PUT', action: '/admin/user/' + id });

  return { title: 'Edit User', subTitle: '....', token: 'abc', buttons, controls }
};

module.exports._putFormValidation = (fields) => {

  let status = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  for (let item of fields) {
    switch (item.name) {
      case 'full_name':
        if (item.value === '') {
          hasError = true;
          errors['full_name'] = message = 'Full Name is required!';
        }
        break;
      case 'status':
        if (item.value === '') {
          hasError = true;
          errors['status'] = message = 'Status is required!';
        }
        break;
      default:
        hasError = true;
        errors[item.name] = message = 'Field `' + item.name + '` is not supported!';
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

module.exports._putFormSubmit = async (id, fields) => {

  let status = 0, message = '', data = {};
  let hasError = false;
  let userFields = {};
  let profileFields = {};

  for (let item of fields) {
    switch (item.name) {
      case 'status':
        if (item.value !== '') {
          userFields['status'] = item.value;
        }
        break;
      case 'full_name':
        if (item.value !== '') {
          profileFields['full_name'] = item.value;
        }
        break;
      default:
        break;
    }
  }

  let result1 = await DbHelper.dbUpdate('users', { id }, userFields);
  let result2 = await DbHelper.dbUpdate('user_profiles', { user_id: id }, profileFields);

  if (result1 > 0 || result2 > 0) {
    if ((userFields['status'] || '') == 'blocked') {
      await UserHelper.createUserNotification(id, 9, 'BLOCKED_USER', id, 'post', id);
    }
    await EsHelper.saveUser(id);
  } else {
    hasError = true;
  }

  if (hasError) {
    status = 400;
    message = 'Fail ' + result1 + ' ' + result2;
  } else {
    status = 200;
    message = 'OK ' + result1 + ' ' + result2;
    data = await UserHelper.getUserItem(id);
  }

  return { status, message, data }
};