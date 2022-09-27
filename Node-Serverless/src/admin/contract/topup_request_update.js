const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');


module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let action = ApiHelper.getObjectValue(requestBody, 'action', '');

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  if (userId > 0) {

    let contractRow = await DbHelper.query('SELECT * FROM contract WHERE id = :id', { id }, 1);
    let requestedUserId = contractRow['user_id'];
    let requestedAmount = contractRow['amount'];
    let requestedRate = contractRow['rate'];
    let requestedFee = contractRow['fee'];
    let requestedStatus = contractRow['status'];

    if (action === 'approved') {

      if (requestedStatus === 'confirmed') {

        let adminBalance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: '9' }, {});
        let requestedLtc = parseFloat(requestedAmount / requestedRate).toFixed(6);

        if (requestedLtc < adminBalance) {

          let customerRow = await DbHelper.query('SELECT * FROM stripe_customer WHERE user_id = :userId', { userId: requestedUserId }, 1);
          let stripeCustomerId = customerRow['stripe_customer_id'];
          let chargeAmount = requestedAmount * 1.05;
          let charge = await StripeHelper.createCharge(stripeCustomerId, chargeAmount, 'USD');

          if (charge['status'] === 'succeeded') {

            let userWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: requestedUserId.toString() }, {});
            let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: '9', address: userWalletAddress, amount: requestedLtc, comment: 'Top up', comment_to: 'Top up' }, {});
            await DbHelper.dbInsert('transaction_history',
              {
                transaction_id: transactionId,
                sender_id: await CryptoHelper.encrypt('9'),
                receiver_id: await CryptoHelper.encrypt(requestedUserId.toString()),
                comment: 'Top up'
              }
            );
            await DbHelper.dbUpdate('contract', { id },
              {
                update_date: await ApiHelper.getCurrentUnixTime(),
                stripe_transaction_id: charge.id,
                ltc_transaction_id: transactionId,
                status: action
              }
            );
            adminBalance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: '9' }, {});
            statusCode = 200;
            message = 'Success';
            data = { current: adminBalance, requested: requestedLtc };
          }
        } else {
          statusCode = 400;
          message = 'We don\'t have enough coins to sell!';
          data = { current: adminBalance, requested: requestedLtc };
        }
      } else {
        statusCode = 400;
        message = 'Contract already ' + requestedStatus;
      }
    } else {
      await DbHelper.dbUpdate('contract', { id }, { status: action });

      statusCode = 200;
      message = 'Success';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
}