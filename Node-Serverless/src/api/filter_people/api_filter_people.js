const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');

/**
 * @openapi
 * tags:
 *   name: Filter people
 * /filter-people:
 *   get:
 *     tags:
 *       - Filter people
 *     summary: Get all kind of skill, status, gender, personalities
 *     responses:
 *       200:
 *         description: Get all kind of skill, status, gender, personalities
 */

module.exports.get = async (request) => {
  let statusCode = 200;
  let message = 'Success';
  let data = {};

  data['skills'] = await UserHelper.getAllSkills();
  data['status'] = [
    { id: 'single', name: 'Single' },
    { id: 'marriage', name: 'Marriage' },
  ];
  data['gender'] = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
  ];
  data['personalities'] = ApiHelper.convertObject2Array(
    UserHelper.getPersonalityData()
  );

  return ApiHelper.apiResponse(statusCode, message, data);
};
