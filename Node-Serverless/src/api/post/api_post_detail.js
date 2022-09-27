const ApiHelper = require('../../helpers/api-helper');
const CommentHelper = require('../../helpers/comment-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const EsHelper = require('../../helpers/es-helper');
const PostHelper = require('../../helpers/post-helper');
const UserHelper = require('../../helpers/user-helper');

module.exports.get = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  let postData = await PostHelper.getPostItem(id, userId);
  postData = await PostHelper.esDecryptPost(postData, userId);

  statusCode = 200;
  message = 'Success';
  data['post_data'] = postData;

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.post = async (id, request) => {
  let response;

  switch (id) {
    case 'vote':
      response = await this._postVote(request);
      break;
    case 'comment':
      response = await this._postComment(request);
      break;
    default:
      response = ApiHelper.apiResponse(404, 'Not found', {});
      break;
  }

  return response;
};

module.exports.put = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  if (requestBody.hashTags) {
    requestBody.hashTags = JSON.stringify(requestBody.hashTags);
  }
  if (requestBody.tags) {
    requestBody.tags = JSON.stringify(requestBody.tags);
  }
  let _tags = ApiHelper.getObjectValue(requestBody, 'tags', []);
  let _content = ApiHelper.getObjectValue(requestBody, 'content', '');
  let _medias = ApiHelper.getObjectValue(requestBody, 'media', []);
  let _payment = ApiHelper.getObjectValue(requestBody, 'payment', {});
  let _medias2 = ApiHelper.getObjectValue(requestBody, 'medias', []);
  if (_medias2.length > 0) {
    _medias = _medias2;
  }

  let arr = [];
  for (let id of _tags) {
    if (ApiHelper.isNumber(id) && id > 0) {
      arr.push(id);
    }
  }
  _tags = arr;

  if (requestBody.hasOwnProperty('taggedUsers')) {
    delete requestBody.taggedUsers;
  }
  if (requestBody.hasOwnProperty('moneyReceivers')) {
    delete requestBody.moneyReceivers;
  }
  if (requestBody.hasOwnProperty('address')) {
    delete requestBody.address;
  }
  if (requestBody.hasOwnProperty('isIncognito')) {
    delete requestBody.isIncognito;
  }
  if (requestBody.hasOwnProperty('isLocation')) {
    delete requestBody.isLocation;
  }
  if (requestBody.hasOwnProperty('isPublic')) {
    delete requestBody.isPublic;
  }
  if (requestBody.hasOwnProperty('media')) {
    delete requestBody.media;
  }
  if (requestBody.hasOwnProperty('money')) {
    delete requestBody.money;
  }
  requestBody.payment = _payment.dollarAmount;
  requestBody.location = JSON.stringify(requestBody.location);
  if (_content === '') {
    errors['content'] = 'Content is required!';
    hasError = true;
  } else {
    requestBody.content = _content;
  }
  requestBody.payment = _payment.dollarAmount;

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    data['userId'] = userId;

    if (userId > 0) {
      let postRow = await DbHelper.query(
        'SELECT created_by FROM posts WHERE id = :id',
        { id },
        1
      );
      if (postRow) {
        if (postRow['created_by'] === userId) {
          await DbHelper.dbUpdate('posts', { id }, requestBody);
          await DbHelper.dbUpdate(
            'post_files',
            { post_id: id },
            { status: 'disable' }
          );
          let tmpId = 0;
          for (let tmpId of _medias) {
            let tmp = await DbHelper.query(
              'SELECT id FROM post_files WHERE post_id = :postId AND file_id = :fileId',
              { postId: id, fileId: tmpId },
              1
            );
            if (tmp) {
              await DbHelper.dbUpdate(
                'post_files',
                { id: tmp['id'] },
                { status: 'active' }
              );
            } else {
              await DbHelper.dbInsert('post_files', {
                post_id: id,
                file_id: tmpId,
                created_at: ApiHelper.getCurrentUnixTime(),
                status: 'active',
              });
            }
          }

          await DbHelper.dbUpdate(
            'post_users',
            { post_id: id },
            { status: 'disable' }
          );

          for (let tmpId of _tags) {
            let tmp = await DbHelper.query(
              'SELECT id FROM post_users WHERE post_id = :postId AND user_id = :userId',
              { postId: id, userId: tmpId },
              1
            );
            if (tmp) {
              await DbHelper.dbUpdate(
                'post_users',
                { id: tmp['id'] },
                { status: 'active' }
              );
            } else {
              await DbHelper.dbInsert('post_users', {
                post_id: id,
                user_id: tmpId,
                created_at: ApiHelper.getCurrentUnixTime(),
                status: 'active',
              });
            }
          }
          await EsHelper.savePost(id);
          statusCode = 200;
          message = 'Success';
        } else {
          statusCode = 403;
          message = 'You are not owner!';
        }
      } else {
        statusCode = 404;
        message = 'Post is not found';
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports.delete = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  data['userId'] = userId;
  if (userId > 0) {
    let postRow = await DbHelper.query(
      'SELECT created_by FROM posts WHERE id = :id',
      { id },
      1
    );
    if (postRow) {
      if (postRow['created_by'] === userId) {
        await DbHelper.dbUpdate('posts', { id }, { status: 'deleted' });
        await EsHelper.savePost(id);
        statusCode = 200;
        message = 'Success';
      } else {
        statusCode = 403;
        message = 'You are not owner!';
      }
    } else {
      statusCode = 404;
      message = 'Post is not found';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports._postVote = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let _value = ApiHelper.getObjectValue(requestBody, 'value', '');

  if (_id < 1) {
    hasError = true;
    message = 'Post ID is required!';
  }
  if (_value === '') {
    hasError = true;
    message = 'Vote value is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      await UserHelper.createUserAction(userId, 'VOTE_POST', _id, _value);
      data = await PostHelper.getVoteLikePostData(_id, userId);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports._postComment = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _content = ApiHelper.getObjectValue(requestBody, 'content', '');
  let _postId = ApiHelper.getObjectValue(requestBody, 'postId', 0);
  let _isIncognito = ApiHelper.getObjectValue(requestBody, 'isIncognito', 0);
  let _parentId = ApiHelper.getObjectValue(requestBody, 'parentCommentId', 0);

  if (_parentId === null) {
    _parentId = 0;
  }
  if (ApiHelper.isEmptyString(_content)) {
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
      newEntity['user_id'] = userId;
      newEntity['content'] = _content;
      newEntity['parent_id'] = _parentId;
      newEntity['incognito'] = _isIncognito;
      newEntity['post_id'] = _postId;
      data['new_id'] = await CommentHelper.createComment(newEntity);
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
