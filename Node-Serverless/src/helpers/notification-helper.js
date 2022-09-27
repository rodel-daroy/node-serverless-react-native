const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');
const PostHelper = require('./post-helper');
const UserHelper = require('./user-helper');

const NotificationObject = require('../models/NotificationObject');


exports.getNotifications = async (userId) => {

  let notifications = [];

  let userNotificationRows = await DbHelper.query('SELECT id FROM user_notifications WHERE user_id = :userId AND status IN (:status) ORDER BY id DESC', { userId, status: ['new', 'read'] });

  for (let item of userNotificationRows) {
    let notification = await this.getNotificationItem(item['id']);
    if (notification) {
      notifications.push(notification);
    }
  }

  return notifications;
};

exports.getNotificationItem = async (notificationId, userId = 0) => {

  let data = null;

  let userNotificationRow = await DbHelper.query('SELECT * FROM user_notifications WHERE id = :id AND object_id <> 0 ORDER BY id DESC', { id: notificationId }, 1);
  if (userNotificationRow) {

    let title = '';
    let content = '';
    let type = userNotificationRow['object_type'];
    let objectId = userNotificationRow['object_id'];
    let targetType = userNotificationRow['target_type'];
    let targetId = userNotificationRow['target_id'];
    let incognito = false;
    let createdBy = userNotificationRow['created_by'];

    let userActionRow = await DbHelper.query(
      'SELECT value FROM user_actions WHERE created_by = :createdBy AND object_type = :objectType AND object_id = :objectId AND status = :status',
      {
        createdBy: createdBy,
        objectType: type,
        objectId: objectId,
        status: 'active'
      },
      1
    );

    let actionValue = '';
    if (userActionRow) {
      actionValue = userActionRow['value'];
    } else {
      actionValue = 'unknown';
    }

    let userInfo = await UserHelper.getUserInfo(createdBy);
    let fullName = userInfo['fullName'] || '';

    let rowInfo;

    switch (type) {
      case 'WALLET_CASHOUT_APPROVED':
        title = ' approved your request!';
        content = 'Your cash out request was approved & money was sent.'
        break;
      case 'BLOCKED_USER':
        title = ' blocked your account!';
        content = 'Your profile was reviewed & has been made inactive. Contact us for assistance.'
        break;
      case 'BLOCKED_POST':
      case 'UNPUBLISHED_POST':
        title = ' unpublished your post!';
        content = 'Your post was reviewed & has been made inactive. Contact us if you have concerns.'
        break;
      case 'WALLET_CASHOUT_REJECTED':
        title = ' rejected your request!';
        content = 'Your cash out request was rejected.'
        break;
      case 'posted':
      case 'postTagged':
        rowInfo = await DbHelper.query('SELECT content, content_format, incognito FROM posts WHERE id = :postId', { postId: objectId }, 1);
        if (rowInfo) {
          content = (rowInfo['content_format'] === 'base64' ? ApiHelper.base64Decode(rowInfo['content']) : rowInfo['content']);
          incognito = rowInfo['incognito'];
        } else {
          content = '...';
        }
        title = ' posted to you!';
        break;
      case 'commented':
      case 'commentTagged':
        rowInfo = await DbHelper.query('SELECT object_id, incognito, content, content_format FROM comments WHERE id = :objectId', { objectId }, 1);
        if (rowInfo) {
          incognito = rowInfo['incognito'];
          content = (rowInfo['content_format'] === 'base64' ? ApiHelper.base64Decode(rowInfo['content']) : rowInfo['content']);
        }
        title = ' left a comment on your post.';
        break;
      case 'NSFW_POST':
      case 'REPORT_POST':
        title = ' reported your post.';
        content = 'Your post has been reported & will be under review.';
        break;
      case 'replied':
        rowInfo = await DbHelper.query('SELECT object_id, incognito, content, content_format FROM comments WHERE id = :objectId', { objectId }, 1);
        if (rowInfo) {
          incognito = rowInfo['incognito'];
          content = (rowInfo['content_format'] === 'base64' ? ApiHelper.base64Decode(rowInfo['content']) : rowInfo['content']);
        }
        title = ' replied to your comment!';
        break;
      case 'addedSkill':
        rowInfo = await DbHelper.query('SELECT name FROM skills WHERE id = :skillId', { skillId: objectId }, 1);
        let skillName;
        if (rowInfo) {
          skillName = rowInfo['name'];
        } else {
          skillName = '...';
        }
        title = ' suggested to add “' + skillName + '” to your profile skills.';
        content = 'Your skill was recently reviewed.';
        break;
      case 'votedCharacter':
      case 'ratedCharacter':
      case 'VOTE_CHARACTER_IE':
      case 'VOTE_CHARACTER_SN':
      case 'VOTE_CHARACTER_TF':
      case 'VOTE_CHARACTER_JP':
        title = ' voted your character!';
        content = 'Your character was recently reviewed.';
        break;
      case 'VOTE_POST':
        switch (actionValue) {
          case 'LIKE':
            title = ' liked the post!';
            content = fullName + ' liked the post.';
            break;
          case 'DISLIKE':
            title = ' disliked the post!';
            content = fullName + ' disliked the post.';
            break;
          default:
            title = actionValue + ' the post!';
            content = fullName + ' ' + actionValue + ' the post.';
            break;
        }
        break;
      case 'VOTE_COMMENT':
        title = ' voted your comment!';
        content = fullName + ' voted your comment!';
        break;
      case 'VOTE_USER':
        switch (actionValue) {
          case 'LIKE':
            title = ' liked your profile!';
            content = 'Your profile was recently reported & will be reviewed.';
            break;
          case 'DISLIKE':
            title = ' disliked your profile!';
            content = 'Your profile was recently reported & will be reviewed.';
            break;
          default:
            title = actionValue + ' your profile!';
            content = 'Your profile was recently reported & will be reviewed.';
            break;
        }
        break;
      case 'VOTE_SKILL':
        switch (actionValue) {
          case 'LIKE':
            title = ' liked your skill!';
            content = 'Your skill was recently reviewed';
            break;
          case 'DISLIKE':
            title = ' disliked your skill!';
            content = 'Your skill was recently reviewed';
            break;
          default:
            title = actionValue + ' your skill!';
            content = 'Your skill was recently reviewed';
            break;
        }
        break;
      case 'WALLET_REQUEST_MONEY':
        title = ` sent you a payment request for $${actionValue}`;
        content = fullName + ` sent you a payment request for $${actionValue}.`;
        break;
      case 'WALLET_SEND_MONEY':
        title = ` sent you a $${actionValue} in funds.`;
        content = fullName + ` sent you a $${actionValue} in funds.`;
        break;
      case 'WALLET_TOP_UP':
        createdBy = 0;
        title = ` sent you a $${actionValue} in funds.`;
        content = 'Your topup is complete & funds are in your wallet now.';
        break;
      default:
        title = type + ' you!';
        content = type + ' you!';
        break;
    }

    if (userId === createdBy) {
      incognito = false;
    }

    let notificationItem = new NotificationObject();
    notificationItem.id = userNotificationRow['id'];
    notificationItem.title = title;
    notificationItem.summary = content;
    notificationItem.type = userNotificationRow['object_type'];
    notificationItem.link = '/' + targetType + '/' + targetId;
    notificationItem.user = await UserHelper.getUserInfo(createdBy);
    notificationItem.createdAt = ApiHelper.convertUnixTimeToTime(userNotificationRow['created_at']);
    notificationItem.status = userNotificationRow['status'];

    switch (targetType) {
      case 'post':
        notificationItem.media = await PostHelper.getPostFiles(targetId, userId);
        break;
      default:
        notificationItem.media = [];
        break;
    }

    data = notificationItem;
  }

  return data;
};

exports.sendPushNotification = async (notificationId, selectedUserId) => {

  let notificationItem = await this.getNotificationItem(notificationId, 0);

  if (notificationItem !== null && selectedUserId > 0) {

    let logs = [];

    let notification = notificationItem.getFirebaseNotification();
    let data = notificationItem.getFirebaseData();

    let tokenRows = await DbHelper.query(
      `SELECT DISTINCT device_push_token FROM user_access_tokens
        WHERE user_id = :userId AND device_push_token IS NOT NULL AND device_push_token != '' AND status = :status ORDER BY created_at DESC LIMIT 5`,
      {
        userId: selectedUserId,
        status: 'active'
      }
    );
    for (let token of tokenRows) {
      let to = token['device_push_token'];
      if (to !== '') {
        await ApiHelper.sendPushNotification(notification, data, to);
      }
    }
    return logs;
  } else {
    return 'SAME';
  }
};

exports.sendCustomerPushNotification = async (selectedUserId, type, refId, title, message, userId) => {

  let notificationItem = new NotificationObject();
  notificationItem.link = '/firebase/' + refId;
  notificationItem.title = title;
  notificationItem.summary = message;
  notificationItem.type = type;
  notificationItem.id = refId;
  notificationItem.user = await UserHelper.getUserItem(userId);

  if (notificationItem !== null && selectedUserId > 0 && selectedUserId != userId) {

    let logs = [];

    let notification = notificationItem.getFirebaseNotification();
    let data = notificationItem.getFirebaseData();

    let tokenRows = await DbHelper.query(
      `SELECT DISTINCT uat.device_push_token
        FROM user_access_tokens uat
        WHERE uat.user_id = :userId
        AND uat.device_push_token IS NOT NULL 
        AND uat.device_push_token != ''
        AND uat.status = :status
        ORDER BY uat.created_at DESC`,
      {
        userId: selectedUserId,
        status: 'active'
      },
      5
    );
    for (let token of tokenRows) {
      let to = token['device_push_token'];
      if (to !== '') {
        await ApiHelper.sendPushNotification(notification, data, to);
      }
    }

    return logs;
  } else {
    return 'SAME';
  }
};