const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');
const WalletHelper = require('../../helpers/wallet-helper');
const ViewHelper = require('../../helpers/view-helper');

const RequestMoneyObject = require('../../models/RequestMoneyObject');

module.exports.post = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};
  let errors = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let reason = ApiHelper.getObjectValue(requestBody, 'reason', '');
  let tags = ApiHelper.getObjectValue(requestBody, 'tags', []);
  let amount = ApiHelper.parse2Float(
    ApiHelper.getObjectValue(requestBody, 'amount', 0)
  );
  let currency = ApiHelper.getObjectValue(requestBody, 'currency', '');

  let receivers = [];

  for (let tag of tags) {
    if (ApiHelper.isNumber(tag)) {
      receivers.push(tag);
    }
  }
  if (reason == '') {
    hasError = true;
    errors['reason'] = message = 'Reason is required!';
  }
  if (!(amount > 0)) {
    hasError = true;
    errors['amount'] = message = 'Amount is required!';
  }
  if (receivers.length < 1) {
    hasError = true;
    errors['tags'] = message = 'Receiver is required!';
  }

  if (hasError) {
    statusCode = 400;
  } else {
    let userId = await UserHelper.checkUserAccessToken(request);
    currency = currency ? currency : 'LTC';

    let ltcAmount =
      currency === 'LTC'
        ? amount
        : await WalletHelper.ltcExchangeByAmount(amount, currency);

    if (userId > 0) {
      let userProfileRow = await DbHelper.query(
        `SELECT up.full_name FROM user_profiles up WHERE up.user_id = :userId`,
        { userId },
        1
      );
      let fullName;
      if (userProfileRow) {
        fullName = userProfileRow['full_name'];
      } else {
        fullName = 'User ' + userId;
      }

      let msgBody = ViewHelper.requestMoney({
        senderName: fullName,
        ltcAmount: ltcAmount,
        amount,
        currency,
        reason: reason,
      });
      let subject = `Request money from ${fullName}`;
      let body = msgBody;
      let nameList = '';
      let requestId = await DbHelper.dbInsert('user_money_requests', {
        user_id: userId,
        amount,
        currency,
        reason,
        created_at: ApiHelper.getCurrentUnixTime(),
      });

      for (let receiverId of receivers) {
        await DbHelper.dbInsert('user_money_request_details', {
          request_id: requestId,
          user_id: receiverId,
          status: 'new',
        });
        let userRow = await DbHelper.query(
          `SELECT u.email, u.id, up.full_name FROM users u INNER JOIN user_profiles up ON u.id = up.user_id WHERE u.id = :userId`,
          { userId: receiverId },
          1
        );
        if (userRow) {
          await UserHelper.createUserAction(
            userId,
            'WALLET_REQUEST_MONEY',
            receiverId,
            amount + currency
          );
          let email = userRow['email'];
          if (ApiHelper.isEmail(email)) {
            nameList += `${userRow['full_name']}, `;
            await ApiHelper.sendMail(email, subject, body, null, fullName);
          }
        }
      }

      if (nameList === '') {
        statusCode = 400;
        message = 'No sent to anyone';
      } else {
        statusCode = 200;
        message = `Payment request sent to ${nameList} you’ll be rich once they approve the request!`;
      }
    } else {
      statusCode = 403;
      message = 'Please check your permission!';
    }
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};

module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let userMoneyRequestRows = await DbHelper.query(
      `SELECT umrd.id, 
          umr.user_id AS sender_user_id, 
          umrd.user_id AS receiver_user_id, 
          umr.amount, 
          umr.reason,
          umr.created_at,
          umrd.status
          FROM user_money_requests umr 
          INNER JOIN user_money_request_details umrd ON umr.id = umrd.request_id
          WHERE umr.user_id = :senderId OR umrd.user_id = :receiverId
          ORDER BY umr.created_at DESC`,
      {
        senderId: userId,
        receiverId: userId,
      }
    );
    let list = [];
    for (let item of userMoneyRequestRows) {
      let tmp = new RequestMoneyObject();
      tmp.id = item['id'];
      tmp.reason = item['reason'];
      tmp.amount = item['amount'];
      tmp.status = item['status'];
      tmp.createdAt = ApiHelper.convertUnixTimeToTime(item['created_at'], '');
      tmp.type = userId === item['sender_user_id'] ? 'send' : 'receive';
      tmp.sender = await UserHelper.getUserInfo(item['sender_user_id']);
      tmp.receiver = await UserHelper.getUserInfo(item['receiver_user_id']);
      list.push(tmp);
    }

    statusCode = 200;
    message = 'Success';
    data['list'] = list;
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.put = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let result = await DbHelper.query(
      `UPDATE user_money_request_details SET status = :status WHERE status IN ('new') AND user_id = :userId`,
      { status: 'done', userId }
    );
    if (result['affectedRows'] > 0) {
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 400;
      message = 'Nothing!';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

module.exports.delete = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {
    let result = await DbHelper.query(
      `UPDATE user_money_request_details SET status = :status WHERE status IN ('new','done') AND user_id = :userId`,
      { status: 'deleted', userId }
    );
    if (result['affectedRows'] > 0) {
      statusCode = 200;
      message = 'Success';
    } else {
      statusCode = 400;
      message = 'Nothing!';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
