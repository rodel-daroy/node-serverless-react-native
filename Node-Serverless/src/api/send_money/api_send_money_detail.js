const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const EsHelper = require('../../helpers/es-helper');
const PostHelper = require('../../helpers/post-helper');
const UserHelper = require('../../helpers/user-helper');
const WalletHelper = require('../../helpers/wallet-helper');

/**
 * @swagger
 * tags:
 *   name: Send reward
 * /send-money/{id}:
 *   post:
 *     tags:
 *       - Send reward
 *     summary: Send reward to the post creator
 *     description: Send money to the post creator using post id
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *                required: true
 *                description: the amount of money with user setted curreny
 *              currency:
 *                type: string
 *                required: false
 *                description: currency of money which is not mandatory
 *              tags:
 *                type: array
 *                required: true
 *                description: the receiver's user id
 *              reason:
 *                type: string
 *                required: true
 *                description: the reason of reward
 *            example:
 *              amount: 100
 *              tags: 104
 *              reason: for reward on your post
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return with messages
 */
module.exports.post = async (id, request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let amount = ApiHelper.parseAmount(
    ApiHelper.getObjectValue(requestBody, 'amount', 0)
  );
  let reason = ApiHelper.getObjectValue(requestBody, 'reason', '');
  let currency = ApiHelper.getObjectValue(requestBody, 'currency', '');

  let tags = [];
  let postRow = await DbHelper.query(
    'SELECT created_by FROM posts WHERE id = :id',
    { id },
    1
  );
  if (postRow) {
    tags.push(postRow['created_by']);
  }

  if (tags.length < 1) {
    hasError = true;
    errors['tags'] = message = 'Receiver is required!';
  }
  if (amount === 0) {
    hasError = true;
    errors['amount'] = message = 'Amount is required!';
  }
  if (reason === '') {
    hasError = true;
    errors['reason'] = message = 'Reason is required!';
  }

  if (hasError) {
    statusCode = 400;
    data['debug'] = requestBody;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    if (userId > 0) {
      let receivers = [];
      for (let tagUser of tags) {
        if (parseInt(tagUser) > 0) {
          receivers.push(tagUser);
        }
      }
      currency = currency ? currency : 'LTC';

      let result = await UserHelper.sendMoney(
        userId,
        amount,
        receivers,
        reason,
        currency,
        'reward',
        id
      );
      if (result['status'] == 1) {
        statusCode = 200;
        message = result['message'];
        await PostHelper.updateRewardCount(id);
        data = await EsHelper.savePost(id);
      } else {
        statusCode = 500;
        message = result['message'];
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
