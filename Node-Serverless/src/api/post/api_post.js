const ApiHelper = require('../../helpers/api-helper');
const FileHelper = require('../../helpers/file-helper');
const PostHelper = require('../../helpers/post-helper');
const UserHelper = require('../../helpers/user-helper');

/**
 * @swagger
 * tags:
 *   name: Post
 * /post:
 *   post:
 *     tags:
 *       - Post
 *     summary: Creating post
 *     description: API to create the post
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                required: true
 *                description: post contents
 *              tags:
 *                type: array
 *                required: false
 *                description: include the tags
 *              hashTags:
 *                type: array
 *                required: false
 *                description: include the tags for the search
 *              media:
 *                type: array
 *                required: false
 *                description: include the media
 *              medias:
 *                type: array
 *                required: false
 *                description: include the medias
 *              isPublic:
 *                type: boolean
 *                required: false
 *                description: false if it is private, true if it is public
 *              isIncognito:
 *                type: boolean
 *                required: false
 *                description: true if it is inCognito, false if it is not
 *              isNsfw:
 *                type: number
 *                required: false
 *                description: if it is NSFW(Not safe for work) request with 1, otherwise 0
 *            example:
 *              content: 1,
 *              tags: ['Park', 'Joe'],
 *              hashTags: ['Pizza', 'Humor'],
 *              media: []
 *              medias: []
 *              isPublic: true
 *              isIncognito: false
 *              isNsfw: 0
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the post data includes status, id, isOwner, content, createAt, user, isIncognito, isNsfw, isPubic, location, money, media, voteDate, taggedUsers, comments, totalComments
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let _content = ApiHelper.getObjectValue(requestBody, 'content', '');
  let _tags = ApiHelper.getObjectValue(requestBody, 'tags', []);
  let _hashTags = ApiHelper.getObjectValue(requestBody, 'hashTags', []);
  let _medias = ApiHelper.getObjectValue(requestBody, 'media', []);
  let _medias2 = ApiHelper.getObjectValue(requestBody, 'medias', []);
  let _isPublic = ApiHelper.getObjectValue(requestBody, 'isPublic', true);
  let _isIncognito = ApiHelper.getObjectValue(requestBody, 'isIncognito', false);
  let _isNsfw = ApiHelper.getObjectValue(requestBody, 'isNsfw', 0);
  let _location = ApiHelper.getObjectValue(requestBody, 'location', {});
  let _payment = ApiHelper.parseAmount(ApiHelper.getObjectValue(requestBody, 'payment', '0'));
  let _paymentLTC = 0;
  if (_medias2.length > 0) {
    _medias = _medias2;
  }
  if (_content === '') {
    errors['content'] = message = 'Content is required!';
    hasError = true;
  }
  let tempTags = [];
  for (let id of _tags) {
    if (ApiHelper.isNumber(id) && id > 0) {
      tempTags.push(id);
    }
  }
  _tags = tempTags;

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      if (_payment > 0) {
        let [$rates, userPreferredCurrency] = await Promise.all([
          ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {}),
          UserHelper.getUserCurrency(userId) || 'USD',
        ]);
        _paymentLTC = _payment / $rates[userPreferredCurrency];
        let userBalance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: userId.toString() }, {});

        if (userBalance < _paymentLTC) {
          hasError = true;
          message = 'You dont have enough money to send!';
        } else {
          _paymentLTC = ApiHelper.parse2Float(_paymentLTC).toFixed(6);
        }

        if (_tags.length === 0) {
          hasError = true;
          message = 'Please tag anyone to send the money!';
        }
      }

      if (hasError) {
        statusCode = 400;
      } else {
        let postEntity = {};
        postEntity['content'] = _content;
        postEntity['user_id'] = userId;
        postEntity['tags'] = _tags;
        postEntity['files'] = _medias;
        postEntity['is_public'] = _isPublic;
        postEntity['is_incognito'] = _isIncognito;
        postEntity['is_nsfw'] = _isNsfw;
        postEntity['hashTags'] = _hashTags;
        postEntity['location'] = _location;
        postEntity['payment'] = _payment;
        postEntity['paymentLTC'] = _paymentLTC;
        let newPostRes = await PostHelper.createNewPost(postEntity, userId);
        newId = newPostRes['id'];
        if (newId == 0) {
          message = newPostRes['message'];
          statusCode = 400;
        } else {
          data = await PostHelper.getPostItem(newId, userId);
          statusCode = 200;
          message = 'Success';
        }
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports.postTag = async (request) => {
  const url = 'https://files.slack.com/files-pri/T055RGGV3-F0203TW38HH/image.png';
  const data = await FileHelper.getTagsFromImage(url);
  return ApiHelper.apiResponse(200, {}, data, null);
};

/**
 * @openapi
 * tags:
 *   name: Posts
 * /post:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get post data
 *     description: This is post searching query
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *          type: string
 *         description: This is a searching keyword
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: This is the current userId
 *       - in: query
 *         name: from
 *         schema:
 *          type: integer
 *          description: Pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination
 *       - in: query
 *         name: sorting
 *         description: Sorting feature
 *         schema:
 *          type: string
 *          enum: ['POPULAR', 'LOCATION','LOCAL', 'TIMELINE']
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: float
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: float
 *       - in: query
 *         name: distanceKm
 *         schema:
 *           type: integer
 *       - in: query
 *         name: hashTags
 *         schema:
 *           type: string
 *
 *
 *     responses:
 *       200:
 *        description: return array of dashboard data
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let queryParams = ApiHelper.getObjectValue(request, 'queryStringParameters', {});
  console.log('api post queryParams =====>', JSON.stringify(queryParams));

  let queryUserId = ApiHelper.getObjectValue(queryParams, 'userId', 0);
  let keyword = ApiHelper.getObjectValue(queryParams, 'q', '');
  let from = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'from', 0));
  let limit = ApiHelper.parseInt(ApiHelper.getObjectValue(queryParams, 'limit', 10));
  let sorting = ApiHelper.getObjectValue(queryParams, 'sorting', 'TIMELINE');
  let latitude = ApiHelper.getObjectValue(queryParams, 'latitude', '');
  let longitude = ApiHelper.getObjectValue(queryParams, 'longitude', '');
  let distanceKm = ApiHelper.getObjectValue(queryParams, 'distanceKm', '');
  let hashTags = ApiHelper.getObjectValue(queryParams, 'hashTags', '');
  let nsfwFlag = ApiHelper.getObjectValue(queryParams, 'nsfw', true);
  let eighteenOverFlag = ApiHelper.getObjectValue(queryParams, 'eighteenOver', true);
  if (typeof nsfwFlag === 'string') {
    nsfwFlag = (nsfwFlag === 'true');
    eighteenOverFlag = (eighteenOverFlag === 'true');
  }

  if (latitude === '' || longitude === '') {
    let locationData = await ApiHelper.getLocationFromIpAddress(request.requestContext.identity.sourceIp);
    latitude = locationData['latitude'];
    longitude = locationData['longitude'];
    data['ip2location'] = locationData;
  }

  let userId = await UserHelper.checkUserAccessToken(request);
  let over18 = 0;
  if (userId > 0) {
    let userSettings = await UserHelper.userNsfwSetting(userId);
    over18 = userSettings.over18 ? userSettings.over18 : 0;
  }

  let posts = await PostHelper.getPosts({ queryUserId, keyword, from, limit, sorting, longitude, latitude, distanceKm, hashTags, over18, nsfwFlag, eighteenOverFlag, }, userId);

  statusCode = 200;
  message = 'Success' + request.requestContext.identity.sourceIp;
  data['from'] = from;
  data['limit'] = limit;
  data['next'] = from + limit;
  data['posts'] = posts;

  return ApiHelper.apiResponse(statusCode, message, data);
};
