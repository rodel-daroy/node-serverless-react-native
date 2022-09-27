const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const ViewHelper = require('../../helpers/view-helper');

/**
 * @swagger
 * tags:
 *   name: Cash out
 * /admin/update-pending-cashout-request:
 *   post:
 *     tags:
 *       - Cash out
 *     summary: Admin update the status of the cash out request
 *     description: Admin update the status of the cash out request
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *              action:
 *                type: string
 *                required: true
 *              comment:
 *                type: string
 *                required: false
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return
 *
 */
module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let action = ApiHelper.getObjectValue(requestBody, 'action', '');
  let comment = ApiHelper.getObjectValue(requestBody, 'comment', '');
  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {
    if (action === 'completed') {
      let contractRow = await DbHelper.query(`SELECT * FROM contract WHERE id = :id`, { id }, 1);
      let amountUsd = contractRow.amount;
      let currency = contractRow.currency;
      let userProfileRow = await DbHelper.query(`SELECT up.full_name, u.email FROM users u INNER JOIN user_profiles up  ON up.user_id = u.id WHERE u.id = :userId`, { userId }, 1);
      let senderName = userProfileRow.full_name;
      let adminEmails = ['anehzat@eronka.com', 'ben@eronka.com'];
      let toEmails = adminEmails.push(userProfileRow.email);
      let subject = `“${senderName}” has cashed out ${amountUsd} ${currency}`;
      let msgBody = ViewHelper.cashOut({ senderName, amountUsd, currency });
      await ApiHelper.sendMail(toEmails, subject, msgBody);
      await DbHelper.dbUpdate('contract', { id }, { status: action });

      message = 'Success';
    } else {
      let contractRow = await DbHelper.query(`SELECT * FROM contract WHERE id = :id`, { id }, 1);
      let requestedUserId = contractRow.user_id;
      let chargeAmount = contractRow.amount * 1.05;
      let requestedLtc = parseFloat(chargeAmount / contractRow.conversion).toFixed(6);
      let userWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: requestedUserId.toString() }, {});
      let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: '9', address: userWalletAddress, amount: requestedLtc, comment: 'Revert cashout ltc by admin', comment_to: 'Revert cashout ltc by admin' }, {});
      let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});
      await DbHelper.dbInsert('transaction_history', {
        transaction_id: transactionId,
        sender_id: await CryptoHelper.encrypt('9'),
        receiver_id: await CryptoHelper.encrypt(userId.toString()),
        comment: comment || 'Revert cashout ltc by admin',
      });
      await DbHelper.dbUpdate(
        'contract',
        { id },
        {
          transaction_id: transactionId,
          transaction_detail: ApiHelper.jsonEncode(transactionDetail),
          status: action,
        }
      );
      message = action + ' by admin';
    }
    statusCode = 200;
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
