const post = require("../../src/api/login/api_login").post;
const expect  = require('chai').expect;
const requestFunc = require('../lib/request').request;

const normalRequest = requestFunc({
  username: "david@eronka.com",
  devicePushToken: "preset_firebase",
  deviceType: "web",
  deviceVersion: "xxx"
});

const unregisteredUserRequest = requestFunc({
  username: "test@eronka.com",
  devicePushToken: "preset_firebase",
  deviceType: "web",
  deviceVersion: "xxx"
});

  
describe('API login', async () => {
    let response = {}
    let body = {}
    it('should get 200 HTTP status', async () => {
        response = await post(normalRequest);
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
  });
});

describe('API login with unregistered account', () => {
  let response = {}
  let body = {}
  it('should get 200 HTTP status', async () => {
      response = await post(unregisteredUserRequest);
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
