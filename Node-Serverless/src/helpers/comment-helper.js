const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');
const EsHelper = require('./es-helper');
const UserHelper = require('./user-helper');

const CommentObject = require('../models/CommentObject');


exports.isValidCommentEntity = async (postEntity) => {

  let content = ApiHelper.getObjectValue(postEntity, 'content', '');
  let userId = ApiHelper.getObjectValue(postEntity, 'user_id', 0);
  let postId = ApiHelper.getObjectValue(postEntity, 'post_id', 0);
  let isValid = true;

  if (content === '') {
    isValid = false;
  }
  if (postId < 1) {
    isValid = false;
  }
  if (userId < 1) {
    isValid = false;
  }

  return isValid;
};

exports.getPosts = async (filters) => {
  return await DbHelper.query('SELECT id FROM posts LIMIT 0, 10', {});
};

exports.createComment = async (commentEntity) => {

  let newId;

  if (this.isValidCommentEntity(commentEntity)) {
    let content = ApiHelper.getObjectValue(commentEntity, 'content', '');
    let createdBy = ApiHelper.getObjectValue(commentEntity, 'created_by', 0);
    let objectId = ApiHelper.getObjectValue(commentEntity, 'object_id', 0);
    let objectType = ApiHelper.getObjectValue(commentEntity, 'object_type', 0);
    let parentId = ApiHelper.getObjectValue(commentEntity, 'parent_id', 0);
    let incognito = ApiHelper.getObjectValue(commentEntity, 'incognito', 0);
    let private = ApiHelper.getObjectValue(commentEntity, 'private', 0);
    let currentTime = ApiHelper.getCurrentUnixTime();
    newId = await DbHelper.dbInsert('comments',
      {
        created_by: createdBy,
        object_id: objectId,
        object_type: objectType,
        parent_id: parentId,
        incognito: incognito,
        private: private,
        content: ApiHelper.base64Encode(content),
        content_format: 'base64',
        created_at: currentTime,
        updated_at: currentTime,
        status: 'active'
      }
    );

    let selectedUserId = 0;

    if (parentId > 0) {
      let commentRow = await DbHelper.query('SELECT created_by FROM comments WHERE id = :postId', { postId: parentId }, 1);
      if (commentRow) {
        selectedUserId = commentRow['created_by'];
      }
    } else {
      let postRow = await DbHelper.query('SELECT created_by FROM posts WHERE id = :postId', { postId: objectId }, 1);
      if (postRow) {
        selectedUserId = postRow['created_by'];
      }
    }

    await UserHelper.createUserNotification(selectedUserId, createdBy, parentId > 0 ? 'replied' : 'commented', newId, 'post', objectId);

    if (objectType === 'POST') {
      await EsHelper.savePost(objectId);
    }
  } else {
    newId = 0;
  }

  return newId;
};

exports.getPostComments = async (postId, parentId, userId = 0) => {

  let comments = [];

  let commentRows = await DbHelper.query(
    'SELECT * FROM comments WHERE object_type = :objectType AND object_id = :objectId AND parent_id = :parentId AND status = :status',
    {
      objectType: 'POST',
      objectId: postId,
      parentId: parentId,
      status: 'active'
    }
  );
  if (commentRows) {
    for (let info of commentRows) {
      let commentObject = await this.getCommentItem(info['id'], userId);
      comments.push(commentObject);
    }
  }

  return comments;
};

exports.getCommentItem = async (id, userId = 0) => {

  let commentItem = new CommentObject();

  let commentRow = await DbHelper.query('SELECT * FROM comments WHERE id = :id', { id }, 1);
  if (commentRow) {
    commentItem.id = commentRow['id'];
    commentItem.content = (commentRow['content_format'] === 'base64' ? ApiHelper.base64Decode(commentRow['content']) : commentRow['content']);
    commentItem.media = [];
    commentItem.isPrivate = commentRow['private'];
    commentItem.isIncognito = commentRow['incognito'];
    commentItem.taggedUsers = [];
    commentItem.createdAt = ApiHelper.convertUnixTimeToTime(commentRow['created_at']);
    commentItem.user = await UserHelper.getUserInfo(commentRow['created_by']);
    commentItem.voteData = await UserHelper.getVoteUpDownData('COMMENT', commentItem.id, userId);
    commentItem.children = await this.getPostComments(commentRow['object_id'], commentRow['id'], userId);
  }

  return commentItem;
};