const ApiHelper = require('./api-helper');
const CommentHelper = require('./comment-helper');
const DbHelper = require('./db-helper');
const EsHelper = require('./es-helper');
const FileHelper = require('./file-helper');
const GeoHelper = require('./geo-helper');
const UserHelper = require('./user-helper');
const WalletHelper = require('./wallet-helper');

const PostObject = require('../models/PostObject');

exports.getPostFiles = async (id, userId = 0) => {

  let files = [];

  let postFileRows = await DbHelper.query(
    'SELECT id, file_id FROM post_files WHERE post_id = :postId AND status = :status ORDER BY id ASC',
    { postId: id, status: 'active' }
  );
  for (let item of postFileRows) {
    let fileObject = await FileHelper.getFileObject(item['file_id'], userId);
    files.push(fileObject);
  }

  return files;
};

exports.getPostItem = async (id, userId = 0) => {

  let postData = new PostObject();
  let createdBy = 0;
  let incognito = 0;

  let postRow = await DbHelper.query('SELECT * FROM posts WHERE id = :id', { id }, 1);
  if (postRow) {
    if (postRow['hashTags']) {
      postData.hashTags = JSON.parse(postRow['hashTags']);
    }

    postData.status = postRow['status'];
    postData.id = postRow['id'];
    postData.isOwner = false;
    postData.content = postRow['content_format'] === 'base64'
      ? ApiHelper.base64Decode(postRow['content'])
      : postRow['content'];
    postData.createdAt = ApiHelper.convertUnixTimeToTime(postRow['created_at']);
    postData.user.id = postRow['created_by'];
    postData.isIncognito = postRow['incognito'];
    postData.isNsfw = postRow['nsfw'];
    postData.total_rewards = postRow['total_rewards'];
    postData.shareNo = postRow['total_shared'];
    postData.isPublic = postRow['type'] === 'public';
    postData.location = ApiHelper.parseStringToLocationObject(postRow['location']);

    if (postData.location !== null) {
      postData.locationAddress = await GeoHelper.getGeoAddress(
        postData.location.lat,
        postData.location.lon,
        true
      );
    }

    postData.money.totalCoin = postRow['payment'] || 0;
    postData.money.amount = Number(parseFloat(postRow['payment'] * postRow['payment_rate']).toFixed(2)) || 0;
    postData.money.currency = postRow['currency'] || 'USD';
    createdBy = postData.user.id;
    incognito = postData.isIncognito;
    let [user, media, voteData, taggedUsers, comments, totalComments] =
      await Promise.all([
        UserHelper.getUserInfo(createdBy),
        this.getPostFiles(id, userId),
        UserHelper.getVoteUpDownData('POST', id, userId),
        this.getTaggedUsers(id, userId),
        CommentHelper.getPostComments(id, 0, userId),
        UserHelper.getCommentsTotal('POST', id),
      ]);
    postData.user = user;
    postData.media = media;
    postData.voteData = voteData;
    postData.taggedUsers = taggedUsers;
    postData.comments = comments;
    postData.totalComments = totalComments;
  }

  return postData;
};

exports.getTaggedUsers = async (postId) => {

  let taggedUsers = [];

  let postUserRows = await DbHelper.query('SELECT user_id FROM post_users WHERE post_id = :postId', { postId });
  for (let postUser of postUserRows) {
    let item = await UserHelper.getUserInfo(postUser['user_id']);
    taggedUsers.push(item);
  }

  return taggedUsers;
};

exports.isValidPostEntity = async (postEntity) => {
  let content = ApiHelper.getObjectValue(postEntity, 'content', '');
  let userId = ApiHelper.getObjectValue(postEntity, 'user_id', 0);
  let isValid = content !== '' && userId > 0 ? true : false;

  return isValid;
};

exports.getAllPosts = async () => {

  let allPosts = [];

  let postRows = await DbHelper.query('SELECT id, content, content_format FROM posts WHERE status = :status', { status: 'active' });
  for (let post of postRows) {
    let item = {
      id: post['id'],
      content: post['content_format'] === 'base64'
        ? ApiHelper.base64Decode(post['content'])
        : post['content'],
    };
    allPosts.push(item);
  }

  return allPosts;
};

exports.getPosts = async (filters, userId) => {

  let selectedUserId = ApiHelper.getObjectValue(filters, 'queryUserId', 0);
  let keyword = ApiHelper.getObjectValue(filters, 'keyword', '');
  let from = ApiHelper.getObjectValue(filters, 'from', 0);
  let limit = ApiHelper.getObjectValue(filters, 'limit', 10);
  let sorting = ApiHelper.getObjectValue(filters, 'sorting', '');
  let latitude = ApiHelper.getObjectValue(filters, 'latitude', '');
  let longitude = ApiHelper.getObjectValue(filters, 'longitude', '');
  let distanceKm = ApiHelper.parseInt(ApiHelper.getObjectValue(filters, 'distanceKm', 100));
  let hashTags = ApiHelper.getObjectValue(filters, 'hashTags', '');
  let over18 = ApiHelper.getObjectValue(filters, 'over18', 0);
  let nsfwFlag = ApiHelper.getObjectValue(filters, 'nsfwFlag', true);
  let eighteenOverFlag = ApiHelper.getObjectValue(filters, 'eighteenOverFlag', true);

  if (distanceKm < 1) {
    distanceKm = 100;
  }

  await UserHelper.addUserLocation(userId, latitude, longitude);

  let considtions = [];
  let result;

  let posts = [];

  switch (sorting) {
    case 'LOCATION':
    case 'LOCAL':
      result = await EsHelper.esNearByPostList(keyword, distanceKm, latitude, longitude, from, limit);
      break;
    case 'POPULAR':
      considtions = [];
      considtions.push({ field: 'status', value: 'active' });
      if (over18 === 1) {
        considtions.push({ field: 'isNsfw', value: 0 });
      }
      if (selectedUserId > 0) {
        considtions.push({ field: 'user.id', value: selectedUserId });
      }
      result = await EsHelper.esPostList(
        keyword,
        considtions,
        [
          { field: 'voteData.total', order: 'desc' },
          { field: 'totalComments', order: 'desc' },
        ],
        from,
        limit,
        hashTags,
        selectedUserId,
        over18
      );
      break;
    default:
      considtions = [];
      considtions.push({ field: 'status', value: 'active' });
      if (over18 === 1) {
        considtions.push({ field: 'isNsfw', value: 0 });
      }
      if (selectedUserId > 0) {
        considtions.push({ field: 'user.id', value: selectedUserId });
      }
      result = await EsHelper.esPostList(
        keyword,
        considtions,
        [{ field: 'createdAt', order: 'desc' }],
        from,
        limit,
        hashTags,
        selectedUserId,
        over18,
        nsfwFlag,
        eighteenOverFlag
      );

      break;
  }

  let tempHits = ApiHelper.getObjectValue(result, 'hits', {});
  let hits = ApiHelper.getObjectValue(tempHits, 'hits', []);

  for (let hit of hits) {
    if (hit.hasOwnProperty('_id')) {
      let item = hit['_source'];
      if (item != null) {
        item.distance = 0;
        let scannedItem = await this.esDecryptPost(item, userId);
        let checkedItem = await this.checkNsfwEighteenOver(scannedItem);
        posts.push(checkedItem);
      }
    }
  }

  return posts;
};

exports.checkNsfwEighteenOver = async (postItem) => {

  let nsfwResult = 0;
  let eighteenOverResult = 0;

  let nsfwLabels = await DbHelper.query('SELECT value FROM app_settings WHERE id = :id', { id: 5 }, 1);
  let eighteenOverLabels = await DbHelper.query('SELECT value FROM app_settings WHERE id = :id', { id: 6 }, 1);

  let itemMedias = postItem.media;

  if (itemMedias) {
    for (let media of itemMedias) {
      let labels = media.image_tag ? JSON.parse(media.image_tag) : [];
      for (let label of labels) {
        if (nsfwLabels.value.toLowerCase().includes(label.toLowerCase())) {
          nsfwResult++;
        }
        if (eighteenOverLabels.value.toLowerCase().includes(label.toLowerCase())) {
          eighteenOverResult++;
        }
      }
    }
  }

  if (nsfwResult > 0) {
    postItem['nsfwFlag'] = true;
  } else {
    postItem['nsfwFlag'] = false;
  }

  if (eighteenOverResult > 0) {
    postItem['eighteenOverFlag'] = true;
  } else {
    postItem['eighteenOverFlag'] = false;
  }

  return postItem;
};

exports.esDecryptPost = async (postItem, userId) => {

  let postRow = await DbHelper.query('SELECT created_by FROM posts WHERE id = :id', { id: postItem['id'] }, 1);
  if (postRow && postRow['created_by']) {
    postItem['isOwner'] = postRow['created_by'] === userId;
    postItem['created_by'] = postRow['created_by'];
    postItem['userId'] = userId;
  } else {
    postItem['isOwner'] = false;
  }

  postItem['content'] = postItem['content'];
  postItem['voteData'] = this.updateUserForVoteData(postItem['voteData'], userId);

  if (postItem['location'] === null) {
    postItem['location'] = { lat: '', long: '' };
  }

  for (let key in postItem['comments']) {
    if (postItem['comments'].hasOwnProperty(key)) {
      postItem['comments'][key] = await this.updateVoteDataForComment(postItem['comments'][key], userId);
    }
  }

  return postItem;
};

exports.updateVoteDataForComment = async (commentData, userId) => {

  commentData['voteData'] = this.updateUserForVoteData(commentData['voteData'], userId);

  let commentRow = await DbHelper.query('SELECT created_by FROM comments WHERE id = :id', { id: commentData['id'] }, 1);
  if (commentRow && commentRow['created_by']) {
    commentData['isOwner'] = commentRow['created_by'] === userId;
  } else {
    commentData['isOwner'] = false;
  }

  for (let key in commentData['children']) {
    if (commentData['children'].hasOwnProperty(key)) {
      commentData['children'][key] = await this.updateVoteDataForComment(
        commentData['children'][key],
        userId
      );
    }
  }

  return commentData;
};

exports.updateUserForVoteData = (voteData, userId) => {

  let votedUp = false;
  let votedDown = false;
  let reportedNsfw = false;

  let arrUp = voteData['votedUpUserIds'];
  for (let id of arrUp) {
    if (id === userId) {
      votedUp = true;
    }
  }

  let arrDown = voteData['votedDownUserIds'];
  for (let id of arrDown) {
    if (id === userId) {
      votedDown = true;
    }
  }

  let nswfUserIds = voteData['nswfUserIds'];
  for (let id of nswfUserIds) {
    if (id === userId) {
      reportedNsfw = true;
    }
  }

  voteData['upData']['active'] = votedUp;
  voteData['downData']['active'] = votedDown;
  voteData['nsfwData']['active'] = reportedNsfw;

  return voteData;
};

exports.updateRewardCount = async (id) => {
  let { total_rewards } = await DbHelper.query('SELECT total_rewards FROM posts WHERE id = :id', { id }, 1);
  total_rewards = total_rewards >= 0 ? ++total_rewards : 1;
  await DbHelper.dbUpdate('posts', { id }, { total_rewards });
};

exports.createFakePost = async (postEntity) => {
  let newId;

  if (this.isValidPostEntity(postEntity)) {
    let content = ApiHelper.getObjectValue(postEntity, 'content', '');
    let userId = ApiHelper.getObjectValue(postEntity, 'user_id', 0);
    let tags = ApiHelper.getObjectValue(postEntity, 'tags', []);
    let files = ApiHelper.getObjectValue(postEntity, 'files', []);
    let isPublic = ApiHelper.getObjectValue(postEntity, 'is_public', true);
    let isIncognito = ApiHelper.getObjectValue(postEntity, 'is_incognito', true);
    let location = ApiHelper.getObjectValue(postEntity, 'location', {});
    let geoLatitude = ApiHelper.getObjectValue(location, 'lat', '');
    let geoLongitude = ApiHelper.getObjectValue(location, 'lng', '');
    let geoLocation = '';
    if (geoLatitude !== '' && geoLongitude !== '') {
      geoLocation = JSON.stringify({ lat: geoLatitude, lng: geoLongitude });
    }
    let currentTime = ApiHelper.getCurrentUnixTime();

    newId = await DbHelper.dbInsert('posts', {
      user_id: userId,
      content: content,
      tags: JSON.stringify(tags),
      files: JSON.stringify(files),
      type: isPublic ? 'public' : 'private',
      incognito: isIncognito ? 1 : 0,
      created_at: currentTime - ApiHelper.getRandomInt(24 * 60 * 60 * 365 * 3),
      updated_at: currentTime,
      location: geoLocation,
      status: 'active',
    });

    await UserHelper.createUserNotification(userId, userId, 'posted', newId, 'post', newId);

    for (let tag of tags) {
      if (tag > 0) {
        await this.addPostTag(newId, tag);
        await UserHelper.createUserNotification(tag, userId, 'postTagged', newId, 'post', newId);
      }
    }
    for (let file of files) {
      if (file > 0) {
        await this.addPostFile(newId, file);
      }
    }
  } else {
    newId = 0;
  }

  if (newId > 0) {
    await EsHelper.savePost(newId);
  }

  return newId;
};

exports.createNewPost = async (postEntity, currentUserId = 0) => {

  let newId;
  let message;

  if (this.isValidPostEntity(postEntity)) {
    let content = ApiHelper.getObjectValue(postEntity, 'content', '');
    let userId = ApiHelper.getObjectValue(postEntity, 'user_id', 0);
    let tags = ApiHelper.getObjectValue(postEntity, 'tags', []);
    let hashTags = ApiHelper.getObjectValue(postEntity, 'hashTags', []);
    let files = ApiHelper.getObjectValue(postEntity, 'files', []);
    let isPublic = ApiHelper.getObjectValue(postEntity, 'is_public', true);
    let isIncognito = ApiHelper.getObjectValue(postEntity, 'is_incognito', true);
    let isNsfw = ApiHelper.getObjectValue(postEntity, 'is_nsfw', 0);
    let location = ApiHelper.getObjectValue(postEntity, 'location', {});
    let payment = ApiHelper.getObjectValue(postEntity, 'payment', '');
    let paymentLTC = ApiHelper.getObjectValue(postEntity, 'paymentLTC', '');
    let geoLatitude = ApiHelper.parse2Float(ApiHelper.getObjectValue(location, 'lat', ''));
    let geoLongitude = ApiHelper.parse2Float(ApiHelper.getObjectValue(location, 'lon', ''));

    await UserHelper.addUserLocation(userId, geoLatitude, geoLongitude);

    let geoLocation = '';
    if (geoLatitude !== 0 && geoLongitude !== 0) {
      geoLocation = JSON.stringify({ lat: geoLatitude, lng: geoLongitude });
    }
    let currentTime = ApiHelper.getCurrentUnixTime();
    let currency = await WalletHelper.getUserCurrency(userId);
    let currencyRates = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {});
    newId = await DbHelper.dbInsert('posts', {
      user_id: userId,
      content: ApiHelper.base64Encode(content),
      content_format: 'base64',
      tags: JSON.stringify(tags),
      hashTags: JSON.stringify(hashTags),
      files: JSON.stringify(files),
      type: isPublic ? 'public' : 'private',
      incognito: isIncognito ? 1 : 0,
      total_rewards: 0,
      nsfw: isNsfw ? 1 : 0,
      created_by: userId,
      created_at: currentTime,
      updated_at: currentTime,
      location: geoLocation,
      payment: payment,
      payment_ltc: paymentLTC,
      currency: currency,
      payment_rate: currencyRates['currency'],
      status: 'active',
    });

    await UserHelper.createUserNotification(userId, userId, 'posted', newId, 'post', newId);

    let $paymentAmount = 0;
    let hasError = false;

    if (tags.length > 0) {
      $paymentAmount = parseFloat(payment / tags.length);
      $paymentAmount = parseFloat($paymentAmount).toFixed(6);
    }
    if ($paymentAmount > 0) {
      let currency = await WalletHelper.getUserCurrency(userId);

      let sendMoneyRes = await UserHelper.sendMoney(userId, $paymentAmount, tags, content, currency, 'Post', newId);
      if (sendMoneyRes['status'] === 0) {
        hasError = true;
        message = sendMoneyRes['message'];
      }
    }

    if (!hasError) {
      for (let tag of tags) {
        if (tag > 0) {
          await this.addPostTag(newId, tag);
          await UserHelper.makeFriend(userId, tag);
          await UserHelper.createUserNotification(tag, userId, 'postTagged', newId, 'post', newId);
        }
      }
      for (let file of files) {
        if (file > 0) {
          await this.addPostFile(newId, file);
        }
      }
    }
  } else {
    newId = 0;
  }

  if (newId > 0) {
    await EsHelper.savePost(newId);
  }

  return { id: newId, message };
};

exports.addPostTag = async (postId, userId) => {
  return await DbHelper.dbInsert('post_users', {
    post_id: postId,
    user_id: userId,
    created_at: ApiHelper.getCurrentUnixTime(),
    status: 'active',
  });
};

exports.addPostFile = async (postId, fileId) => {
  return await DbHelper.dbInsert('post_files', {
    post_id: postId,
    file_id: fileId,
    created_at: ApiHelper.getCurrentUnixTime(),
    status: 'active',
  });
};
