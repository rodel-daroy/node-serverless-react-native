const ApiHelper = require('../../helpers/api-helper');
const PostHelper = require('../../helpers/post-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.get = async () => {

  let userIds = await UserHelper.getUserIds();
  let fileIds = await UserHelper.getFileIds();

  let userId;
  let files;
  let tags;
  let taggedId;
  let fileId;
  let i;
  let arr = [];
  let result = await ApiHelper.apiGet('https://randomuser.me/api/?results=20');
  let results = ApiHelper.getObjectValue(result, 'results', []);

  for (let info of results) {
    userId = ApiHelper.getArrayRandomValue(userIds);
    tags = [];
    for (i = 0; i < ApiHelper.getRandomInt(10); i++) {
      taggedId = ApiHelper.getArrayRandomValue(userIds);
      if (taggedId === userId) {
        continue;
      }
      tags.push(taggedId);
    }
    files = [];
    for (i = 0; i < ApiHelper.getRandomInt(20); i++) {
      fileId = ApiHelper.getArrayRandomValue(fileIds);
      files.push(fileId);
    }
    let entity = {
      content: info['location']['street'] + ' ' + info['location']['city'] + ' ' + info['location']['state'] + ' ' + info['location']['postcode'] + ' ' + info['location']['timezone']['description'],
      user_id: userId,
      tags: tags,
      files: files,
      is_public: ApiHelper.getRandomBoolean(),
      is_incognito: ApiHelper.getRandomBoolean(),
      location: {
        lat: info['location']['coordinates']['latitude'],
        lng: info['location']['coordinates']['longitude']
      },
      payment: ApiHelper.getRandomInt(100)
    };
    arr.push(entity);
    await PostHelper.createFakePost(entity);
  }

  return ApiHelper.apiResponse(200, 'Success', { list: arr });
};