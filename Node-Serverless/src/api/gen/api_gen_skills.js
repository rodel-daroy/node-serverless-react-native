const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async () => {

  let arr = [];
  let skills = UserHelper.getDemoSkills();
  let userIds = UserHelper.getUserIds();

  return ApiHelper.apiResponse(200, 'Success', { list: arr });
};