const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const UserHelper = require('../../helpers/user-helper');

/**
 * @swagger
 * tags:
 *   name: Get rewards
 * /post-rewards/{postId}:
 *   get:
 *     tags:
 *       - Get rewards
 *     summary: Get post's rewards data
 *     description: Get post's rewards data with when, who, how much sent with inputing post Id parameters
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return reward count, sent id and information, amount, date, post data(content, one file)
 */

module.exports.get = async (postId) => {
  let statusCode = 0,
    message = '',
    data = {};
  statusCode = 200;
  message = 'Success';
  data = await DbHelper.query('SELECT th.sender_id, ct.amount, ct.date, th.comment FROM contract as ct LEFT JOIN transaction_history as th ON ct.transaction_id=th.transaction_id WHERE ct.reward_post_id=:postId', { postId });

  for (el of data) {
    el.sender_id = CryptoHelper.decrypt(el.sender_id);
    el.userData = await UserHelper.getUserSettings(el.sender_id);
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
