const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');
const ViewHelper = require('../../helpers/view-helper');


/**
 * @swagger
 * tags:
 *   name: Cash out
 * /cashout-request-update:
 *   post:
 *     tags:
 *       - Cash out
 *     summary: User confirm or cancel cash out request
 *     description: User confirm or cancel cash out request
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the contract table that received from the cash out request api
 *              action:
 *                type: string
 *                required: true
 *                description: the user action for the cash out request, value can be "confirmed" or "cancelled"
 *            example:
 *              id: 2
 *              action: confirmed
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success confirmed or cancelled
 */
module.exports.post = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let action = ApiHelper.getObjectValue(requestBody, 'action', '');

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    if (action === 'cancelled') {
      await DbHelper.dbUpdate('contract', { id }, { status: action });
      statusCode = 200;
      message = 'Successfully cancelled';
    } else {

      let contractRow = await DbHelper.query(`SELECT * FROM contract WHERE id = :id`, { id }, 1);

      if (contractRow.status === 'pendingCashout' || contractRow.status === 'completed') {
        statusCode = 200;
        message = 'This contract is ' + contractRow.status;
      } else {
        let currencyCode = contractRow.currency;
        let chargeAmount = contractRow.amount + contractRow.fee_total;
        let requestedLtc = parseFloat(chargeAmount / contractRow.conversion).toFixed(6);

        let adminWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: '9' }, {});
        let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: userId.toString(), address: adminWalletAddress, amount: requestedLtc, comment: 'Cash out', comment_to: 'Cash out' }, {});
        if (transactionId) {

          let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});

          await DbHelper.dbInsert('transaction_history',
            {
              transaction_id: transactionId,
              sender_id: await CryptoHelper.encrypt(userId.toString()),
              receiver_id: await CryptoHelper.encrypt('9'),
              comment: 'Cash out'
            }
          );
          await DbHelper.dbUpdate('contract', { id },
            {
              transaction_id: transactionId,
              transaction_detail: ApiHelper.jsonEncode(transactionDetail),
              final_amount: chargeAmount,
              final_amount_ltc: requestedLtc,
              status: 'pendingCashout'
            }
          );

          let { amount } = contractRow;
          let userProfileRow = await DbHelper.query('SELECT up.full_name, u.email FROM users u INNER JOIN user_profiles up  ON up.user_id = u.id WHERE u.id = :userId', { userId }, 1);
          let senderName = userProfileRow.full_name;
          let adminEmails = ['anehzat@eronka.com', 'ben@eronka.com'];
          let toEmails = [...adminEmails, userProfileRow.email];
          let subject = `“${senderName}” has cashed out ${amount} ${currencyCode}`;
          let msgBody = ViewHelper.cashOut({ senderName, amount, currencyCode, transactionId });
          await ApiHelper.sendMail(toEmails, subject, msgBody);

          statusCode = 200;
          message = 'Success';
        } else {

          await DbHelper.dbUpdate('contract', { id }, { status: 'paymentFailed' });

          statusCode = 400;
          message = 'paymentFailed';
        }
      }
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
}