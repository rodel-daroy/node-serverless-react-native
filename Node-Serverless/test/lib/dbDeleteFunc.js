const DbHelper = require("../../src/helpers/db-helper");

module.exports.dbDeleteAfterRegisterTest = (userId) => {
  try {
    DbHelper.dbDelete('users', {id: userId});
    DbHelper.dbDelete('user_profiles', {user_id: userId});
  } catch {
    console.log('++++++++++++++++++ Data initialised failed +++++++++++++++++');
  }
}

module.exports.dbDeletePost = (postId) => {
  try {
    DbHelper.dbDelete('posts', {id: postId});
    DbHelper.dbDelete('posts_users', {post_id: postId});
    DbHelper.dbDelete('post_files', {post_id: postId});
  } catch {
    console.log('++++++++++++++++++ Data initialised failed +++++++++++++++++');
  }
}
