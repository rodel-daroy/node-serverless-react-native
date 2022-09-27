const postRegister = require('../../src/api/register/api_register.js');
const DbHelper = require('../../src/helpers/db-helper');
const expect = require('chai').expect;
const requestFunc = require('../lib/request').request;
const dbDeleteAfterRegisterTest =
  require('../lib/dbDeleteFunc').dbDeleteAfterRegisterTest;

const request = requestFunc({
  username: 'test@gmail.com',
  type: 'email',
  full_name: 'test executor',
  device_type: 'web',
  device_version: 'xxx',
});

describe('register account testing', () => {
  let response = {};
  let body = {};
  it('should get 200 HTTP status', async () => {
    response = await postRegister.post(request);
    body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
    if (body.status !== 200) {
      dbDeleteAfterRegisterTest(body.data.id);
    }
  });

  it('Message should be "Success"', async () => {
    try {
      await expect(body.message).to.equal('Success');
      DbHelper.dbDelete('users', { id: body.data.id });
    } catch (e) {
      console.log(e);
    }
  });

  it('Data should return user id', async () => {
    try {
      await expect(body.data.id).to.above(0);
      DbHelper.dbDelete('user_profiles', { user_id: body.data.id });
    } catch (e) {
      console.log(e);
    }
  });
});
