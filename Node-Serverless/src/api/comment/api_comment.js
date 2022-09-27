const ApiHelper = require('../../helpers/api-helper');
const CommentHelper = require('../../helpers/comment-helper');
const UserHelper = require('../../helpers/user-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let content = ApiHelper.getObjectValue(requestBody, 'content', '');
  let objectId = ApiHelper.getObjectValue(requestBody, 'objectId', 0);
  let objectType = ApiHelper.getObjectValue(requestBody, 'objectType', 0);
  let isIncognito = ApiHelper.getObjectValue(requestBody, 'isIncognito', 0);
  let isPrivate = ApiHelper.getObjectValue(requestBody, 'isPrivate', 0);
  let parentId = ApiHelper.getObjectValue(requestBody, 'parentCommentId', 0);
  if (parentId === null) {
    parentId = 0;
  }

  if (ApiHelper.isEmptyString(content)) {
    errors['content'] = 'Content is required!';
    hasError = true;
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    data['userId'] = userId;
    if (userId > 0) {
      let newEntity = {};
      newEntity['created_by'] = userId;
      newEntity['content'] = content;
      newEntity['parent_id'] = parentId;
      newEntity['incognito'] = isIncognito;
      newEntity['private'] = isPrivate;
      newEntity['object_id'] = objectId;
      newEntity['object_type'] = objectType;
      let newId = await CommentHelper.createComment(newEntity);
      data = await CommentHelper.getCommentItem(newId, userId);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};