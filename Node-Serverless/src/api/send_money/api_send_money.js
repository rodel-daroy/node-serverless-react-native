const ApiHelper = require('../../helpers/api-helper');
const UserHelper = require('../../helpers/user-helper');
const WalletHelper = require('../../helpers/wallet-helper');

/**
 * @swagger
 * tags:
 *   name: Send money
 * /send-money
 *   post:
 *     tags:
 *       - Send money
 *     summary: Send reward to the post creator
 *     description: Send money to the another user
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
 *                description: the reason of sending money
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
module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let tags = ApiHelper.getObjectValue(requestBody, 'tags', []);
  let amount = ApiHelper.parseAmount(ApiHelper.getObjectValue(requestBody, 'amount', 0));
  let reason = ApiHelper.getObjectValue(requestBody, 'reason', '');
  let currency = ApiHelper.getObjectValue(requestBody, 'currency', '');

  if (tags.length < 1) {
    hasError = true;
    errors['tags'] = message = 'Receiver is required!';
  }
  if (reason === '') {
    hasError = true;
    errors['reason'] = message = 'Reason is required!';
  }
  if (amount === 0) {
    hasError = true;
    errors['amount'] = message = 'Amount is required!';
  }

  if (hasError) {
    statusCode = 400;
    data['debug'] = requestBody;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);

    if (userId > 0) {
      let receivers = [];
      for (let tag of tags) {
        if (parseInt(tag) > 0) {
          receivers.push(tag);
        }
      }

      let result = await UserHelper.sendMoney(userId, amount, receivers, reason, currency, 'send money', null);

      if (result['status'] == 1) {
        statusCode = 200;
        message = result['message'];
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
