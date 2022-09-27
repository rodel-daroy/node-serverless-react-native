const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async () => {

  let arr = [];
  let result = await ApiHelper.apiGet('https://randomuser.me/api/?results=20');
  let results = ApiHelper.getObjectValue(result, 'results', []);

  for (let info of results) {
    let entity = {
      name: info['email'],
      type: 'email',
      fullName: (info['name']['first'] + ' ' + info['name']['last']).replace(/(^|\s)\S/g, l => l.toUpperCase()),
      avatarUrl: info['picture']['large'],
      location: {
        lat: info['location']['coordinates']['latitude'],
        lng: info['location']['coordinates']['longitude']
      }
    };

    await UserHelper.createFakeUser(entity.name, entity.type, entity.fullName, entity.avatarUrl, entity.location);
    arr.push(entity);
  }

  return ApiHelper.apiResponse(200, 'Success', { list: arr });
};