const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const CryptoHelper = require('../../helpers/crypto-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const StripeHelper = require('../../helpers/stripe-helper');

module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};

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
        let stripeBalance = await StripeHelper.balance();
        if (stripeBalance.available[0].amount >= requestedAmount * 100) {
          let stripeConnectedAccountRow = await DbHelper.query('SELECT * FROM stripe_connected_account WHERE user_id = :userId', { userId: requestedUserId }, 1);
          if (stripeConnectedAccountRow) {
            try {
              // await StripeHelper.createTransfer(requestedAmount, 'USD', stripeConnectedAccountRow['account_id']);
              // await StripeHelper.accountPayout(requestedAmount, 'USD', stripeConnectedAccountRow['account_id']);

              let adminWalletAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: '9' }, {});
              let requestedLtc = parseFloat((requestedAmount * 1.05) / requestedRate).toFixed(6);

              let transactionId = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'send-to-address', { walletCode: requestedUserId.toString(), address: adminWalletAddress, amount: requestedLtc, comment: 'Cash out', comment_to: 'Cash out' }, {});
              await DbHelper.dbInsert('transaction_history', {
                transaction_id: transactionId,
                sender_id: await CryptoHelper.encrypt(requestedUserId.toString()),
                receiver_id: await CryptoHelper.encrypt('9'),
                comment: 'Cash out',
              });
              await DbHelper.dbUpdate(
                'contract',
                { id },
                {
                  update_date: await ApiHelper.getCurrentUnixTime(),
                  ltc_transaction_id: transactionId,
                  status: action,
                }
              );

              let amount = contractRow.amount;
              let currency = contractRow.currency;
              let userProfileRow = await DbHelper.query(`SELECT up.full_name, u.email FROM users u INNER JOIN user_profiles up  ON up.user_id = u.id WHERE u.id = :userId`, { userId }, 1);
              let senderName = userProfileRow.full_name;
              let adminEmails = ['anehzat@eronka.com', 'ben@eronka.com'];
              let toEmails = adminEmails.push(userProfileRow.email);
              let subject = `“${senderName}” has cashed out ${amount} ${currency}`;
              let msgBody = ViewHelper.cashOut({ senderName, amount, transactionId, currency });
              await ApiHelper.sendMail(toEmails, subject, msgBody);
              statusCode = 200;
              message = 'Successfully cashout';
            } catch (e) {
              errors['code'] = e.raw.code;
              errors['message'] = e.raw.message;
              statusCode = 400;
              message = 'Cashout failed';
            }
          } else {
            statusCode = 400;
            message = "Stripe connected account doesn't exist";
          }
        } else {
          statusCode = 400;
          message = "We don't have enough money to cashout!";
          data = { current: stripeBalance.available[0].amount / 100, requested: requestedAmount };
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

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
