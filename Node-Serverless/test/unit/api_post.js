const postRegister = require('../../src/api/post/api_post');
const expect = require('chai').expect;
const requestFunc = require('../lib/request').requestWithJwt;
const dbDeletePost = require('../lib/dbDeleteFunc').dbDeletePost;

const request = requestFunc({
  content: 'Roppongi Hills Japan, this spider is protecting the building. ',
  longitude: '',
  latitude: '',
  media: [],
  hashTags: [],
  isPublic: true,
  isIncognito: false,
  payment: 0,
});

describe('Posting the post', () => {
  let response = {};
  let body = {};
  it('should get 200 HTTP status', async () => {
    response = await postRegister.post(request);
    body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
    if (body.status !== 200) {
      dbDeletePost(body.data.id);
    }
  });

  it('Message should be "Success"', () => {
    expect(body.message).to.equal('Success');
  });

  it('Data should return post id', () => {
    expect(body.data.id > 0).to.equal(true);
  });

  it('Content should equal with requested', () => {
    expect(body.data.content).to.equal(
      'Roppongi Hills Japan, this spider is protecting the building. '
    );
  });

  it('Content should be in public', () => {
    expect(body.data.isPublic).to.equal(true);
  });

  it('Data should return user id', () => {
    expect(body.data.user.id > 0).to.equal(true);
    dbDeletePost(body.data.id);
  });
});
