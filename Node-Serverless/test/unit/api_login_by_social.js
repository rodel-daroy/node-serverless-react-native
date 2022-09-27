const post = require("../../src/api/login-by-social/api_login_by_social").post;
const DbHelper = require("../../src/helpers/db-helper");
const expect  = require('chai').expect;
const requestFunc = require('../lib/request').request;

const googleLoginRequest = requestFunc({
  provider: "Google",
  profile: {
    email: "david@eronka.com",
    familyName: "Park",
    givenName: "David",
    id: "110986605620721654939",
    name: "David Park",
    photo: "https://lh3.googleusercontent.com/a/AATXAJxFWb7JZAwUh0XghG0E4RjfdwrfpTz8G7t2PPRo=s96-c",
    fullName: "David Park",
    username: "david@eronka.com"
  },
  deviceType: "web",
  deviceVersion: "xxx",
  devicePushToken: "preset_firebase"
});

const facebookLoginRequest = requestFunc({
  provider: "Facebook",
  profile: {
    email: "david@eronka.com",
    familyName: "Park",
    givenName: "David",
    id: "110986605620721654939",
    name: "David Park",
    photo: "https://lh3.googleusercontent.com/a/AATXAJxFWb7JZAwUh0XghG0E4RjfdwrfpTz8G7t2PPRo=s96-c",
    fullName: "David Park",
    username: "david@eronka.com"
  },
  deviceType: "web",
  deviceVersion: "xxx",
  devicePushToken: "preset_firebase"
});

const appleLoginRequest = requestFunc({
  provider: "Facebook",
  profile: {
    email: "david@eronka.com",
    familyName: "Park",
    givenName: "David",
    id: "110986605620721654939",
    name: "David Park",
    photo: "https://lh3.googleusercontent.com/a/AATXAJxFWb7JZAwUh0XghG0E4RjfdwrfpTz8G7t2PPRo=s96-c",
    fullName: "David Park",
    username: "david@eronka.com"
  },
  deviceType: "web",
  deviceVersion: "xxx",
  devicePushToken: "preset_firebase"
});

// Google, Facebook, Apple
describe('Login with Google', async () => {
    let response = {}
    let body = {}
    it('should get 200 HTTP status', async () => {
        response = await post(googleLoginRequest);
        body = JSON.parse(response.body);
        await expect(body.status).to.equal(200);
    });
    
    it('Message should be "Success"', () => {
        expect(body.message).to.equal('Success');
    });

    it('Data should return user_data', () => {
        expect('user_data' in body.data).to.equal(true);
    });

    it('Data should return settings', () => {
      expect('settings' in body.data).to.equal(true);
  });
});

describe('Login with Facebook', async () => {
  let response = {}
  let body = {}
  it('should get 200 HTTP status', async () => {
      response = await post(facebookLoginRequest);
      body = JSON.parse(response.body);
      expect(body.status).to.equal(200);
  });
  
  it('Message should be "Success"', () => {
    expect(body.message).to.equal('Success');
  });

  it('Data should return user_data', () => {
    expect('user_data' in body.data).to.equal(true);
  });

  it('Data should return settings', () => {
    expect('settings' in body.data).to.equal(true);
  });
});

describe('Login with Apple', async () => {
  let response = {}
  let body = {}
  it('should get 200 HTTP status', async () => {
      response = await post(appleLoginRequest);
      body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
  });
  
  it('Message should be "Success"', async () => {
      expect(body.message).to.equal('Success');
  });

  it('Data should return user_data', async () => {
    expect('user_data' in body.data).to.equal(true);
  });

  it('Data should return settings', async () => {
    expect('settings' in body.data).to.equal(true);
    });
});