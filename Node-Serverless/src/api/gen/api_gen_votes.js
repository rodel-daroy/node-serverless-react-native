const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async () => {

  let userIds = await UserHelper.getUserIds();
  let postIds = await UserHelper.getPostIds();

  for (let postId of postIds) {
    for (let i = 0; i < ApiHelper.getRandomInt(20); i++) {
      let userId = ApiHelper.getArrayRandomValue(userIds);
      await UserHelper.createUserAction(userId, 'VOTE_POST', postId, ApiHelper.getRandomBoolean() ? 'LIKE' : 'DISLIKE');
    }
  }
};