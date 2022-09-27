const postReward = require('../../src/api/reward/post_rewards');
const expect = require('chai').expect;
const dbDeletePost = require('../lib/dbDeleteFunc').dbDeletePost;
// Post id 13313 with 3 rewards
const request = 13313;

describe.only('Get post reward information', () => {
  let response = {};
  let body = {};
  it('should get 200 HTTP status', async () => {
    response = await postReward.get(request);
    body = JSON.parse(response.body);
    expect(body.status).to.equal(200);
    if (body.status !== 200) {
      dbDeletePost(body.data.id);
    }
  });

  it('Should have 3 rewards', async () => {
    expect(body.data.length === 3).to.equal(true);
  });

  it('Should have sender_id on response', async () => {
    let dataArr = body.data;
    let result = true;
    dataArr.map((el) => {
      let { sender_id } = el;
      if (sender_id < 1) {
        result = false;
      }
    });
    expect(result).to.equal(result);
  });

  it('Should have amount', async () => {
    let dataArr = body.data;
    let result = true;
    dataArr.map((el) => {
      let { amount } = el;
      if (amount < 0) {
        result = false;
      }
    });
    expect(result).to.equal(result);
  });

  it('Should have date', async () => {
    let dataArr = body.data;
    let result = true;
    dataArr.map((el) => {
      let { date } = el;
      if (!!!date) {
        result = false;
      }
    });
    expect(result).to.equal(result);
  });

  it('Should have comment', async () => {
    let dataArr = body.data;
    let result = true;
    dataArr.map((el) => {
      let { comment } = el;
      if (comment.length < 0) {
        result = false;
      }
    });
    expect(result).to.equal(result);
  });
});
