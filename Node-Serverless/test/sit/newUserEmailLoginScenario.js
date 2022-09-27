/**
 * 1. login with new account
 * 2. Register
 * 3. Login with new account with a code
 */

const expect  = require('chai').expect;

const LoginPost = require("../../src/api/login/api_login").post;
const requestFunc = require('../lib/request').request;
const postRegister = require("../../src/api/register/api_register.js");
const dbDeleteAfterRegisterTest = require('../lib/dbDeleteFunc').dbDeleteAfterRegisterTest;

const unregisteredUserRequest = requestFunc({
  username: "test@eronka.com",
  devicePushToken: "preset_firebase",
  deviceType: "web",
  deviceVersion: "xxx"
});
 
let userId = 0;

const registerRequest = requestFunc({
  username: 'test@eronka.com',
  type: 'email',
  full_name: 'test executor',
  device_type: 'web',
  device_version: 'xxx'
});

describe('API login with unregistered account', async () => {

  let response = {}
  let body = {}

  it('should get 200 HTTP status', async () => {
    response = await LoginPost(unregisteredUserRequest);
    body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
  });
   
  it('Message should be empty', () => {
    expect(body.message).to.equal('');
  });
 
  it('Data should return account_type new', () => {
    expect(body.data.account_type).to.equal('new');
  });

});

describe('register account testing', () => {

    let response = {}
    let body = {}

    it('should get 200 HTTP status', async () => {
      response = await postRegister.post(registerRequest);
      body = JSON.parse(response.body);
      expect(body.status).to.equal(200);
      if(body.status !== 200) {
        dbDeleteAfterRegisterTest(body.data.id);
      }
    });
    
    it('Message should be "Success"', () => {
      expect(body.message).to.equal('Success');
      if(body.status !== 200) {
        dbDeleteAfterRegisterTest(body.data.id);
      }
    });

    it('Data should return user id', () => {
      userId = body.data.id;  
      expect(userId > 0).to.equal(true);
    });

});

describe('API login', async () => {

  let response = {}
  let body = {}

  it('should get 200 HTTP status', async () => {
    response = await LoginPost(unregisteredUserRequest);
    body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
  });
  
  it('Message should be "Success"', () => {
      expect(body.message).to.equal('Success');
  });

  it('Data should return account_type', () => {
      expect('account_type' in body.data).to.equal(true);
  });

  it('Data should return code', () => {
    expect('code' in body.data).to.equal(true);
    dbDeleteAfterRegisterTest(userId);
  });

});

