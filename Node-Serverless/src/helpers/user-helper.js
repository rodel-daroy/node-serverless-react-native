const ApiHelper = require('./api-helper');
const CryptoHelper = require('./crypto-helper');
const DbHelper = require('./db-helper');
const EsHelper = require('./es-helper');
const FileHelper = require('./file-helper');
const GeoHelper = require('./geo-helper');
const NotificationHelper = require('./notification-helper');
const PostHelper = require('./post-helper');
const StripeHelper = require('./stripe-helper');
const ViewHelper = require('./view-helper');
const WalletHelper = require('./wallet-helper');

const UserObject = require('../models/UserObject');
const MyProfileObject = require('../models/MyProfileObject');
const UserProfileObject = require('../models/UserProfileObject');
const VoteUpDownObject = require('../models/VoteUpDownObject');
const VoteData = require('../models/VoteData');
const CharacterData = require('../models/CharacterData');
const SettingsObject = require('../models/SettingsObject');
const AccountObject = require('../models/AccountObject');
const SkillObject = require('../models/SkillObject');
const TransactionObject = require('../models/TransactionObject');

exports.getOwnerData = async (userId) => {
  let userData = { name: '' };

  let userProfileRow = await DbHelper.query('SELECT full_name FROM user_profiles WHERE user_id = :userId', { userId }, 1);
  if (userProfileRow) {
    userData['name'] = userProfileRow['full_name'];
  }

  return userData;
};

exports.sendMoney = async (userId, payment, receivers, reason, currency, type, postId) => {
  let message = '';
  let hasError = false;
  if (payment > 0) {
    let ltcPayment, $balance;
    ltcPayment = currency === 'LTC' ? payment : await WalletHelper.ltcExchangeByAmount(payment, currency);

    $balance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: userId.toString() }, {});
    if ($balance < ltcPayment * receivers.length) {
      hasError = true;
      message = 'You dont have enough ltc money to send!' + $balance;
    } else {
      payment = parseFloat(payment).toFixed(6);
    }

    if (hasError === false) {
      let $userEmail;
      let userInfo = await DbHelper.query('SELECT email FROM users WHERE id = :userId', { userId }, 1);
      if (userInfo) {
        $userEmail = userInfo['email'];
      }

      for (let $id of receivers) {
        let $selectedUserInfo = await DbHelper.query('SELECT u.email, u.name FROM users u WHERE u.id = :userId', { userId: $id }, 1);
        if ($selectedUserInfo) {
          let $selectedUserAddress = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: $id.toString() }, {});
          let transactionId = await ApiHelper.liteApiPost(
            process.env.LITECOIN_API_URL + 'send-to-address',
            {
              walletCode: userId.toString(),
              address: $selectedUserAddress,
              amount: ltcPayment,
              comment: reason,
              comment_to: reason,
            },
            {}
          );
          if (transactionId) {
            let $info = '';
            let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});
            if (transactionDetail) {
              await DbHelper.dbInsert('contract', {
                user_id: userId,
                date: ApiHelper.getCurrentUnixTime(),
                amount: payment,
                currency: currency,
                base_fee: 0,
                percentage_fee: 0,
                fee_percentage: 0,
                fee_total: 0,
                requested_amount: payment,
                final_amount: payment,
                final_amount_ltc: ltcPayment,
                reward_post_id: postId,
                transaction_id: transactionId,
                transaction_detail: JSON.stringify(transactionDetail),
                status: 'completed',
                type: type === 'reward' ? 'reward' : 'send',
              });
              await DbHelper.dbInsert('transaction_history', {
                transaction_id: transactionId,
                sender_id: await CryptoHelper.encrypt(userId.toString()),
                receiver_id: await CryptoHelper.encrypt($id.toString()),
                comment: reason,
              });
              let $ownerData = await this.getOwnerData(userId);
              let $subject = `You just received ${payment * -1 + ' ' + currency} into your wallet`;
              let createdDate = ApiHelper.convertUnixTimeToTime(transactionDetail['time']);
              let $body = ViewHelper.sendMoney({
                receiver: $selectedUserInfo['name'],
                sender: $ownerData['name'],
                usdAmount: payment,
                currency,
                fee: 0,
                date: createdDate,
                transactionId: transactionDetail.txid,
                transactionDescription: transactionDetail['comment'],
              });
              let $mail_to = $selectedUserInfo['email'];
              await ApiHelper.sendMail([$mail_to], $subject, $body);
              $info += `
                        <p>Recipients Address: ${$selectedUserAddress}</p>
                        <p>Amount: ${transactionDetail['details'][0]['amount']}</p>
                        <p>Fee: 0</p>
                        <p>Recipients Email: ${transactionDetail['to']}</p>
                        <p>Transaction ID: <span class='long-text'>${transactionDetail['txid']}</span></p>
                        <p>Transaction Date (GMT): ${createdDate}</p>
                        </p>Transaction Comment: ${transactionDetail['comment']}</p>
                      `;

              await this.createUserAction(userId, 'WALLET_SEND_MONEY', $id, payment);
            }
            message += `Payment was successful, you'll shortly receive the funds into your account along with an email payment receipt. ${$info}`;
          } else {
            message += `${transactionId} Unfortunately your payment was declined, please try again later.`;
          }
        }
      }
    }
  } else {
    hasError = true;
    message = 'Payment is required!';
  }

  return { status: hasError ? 0 : 1, message };
};

exports.sendLtc = async (userId, payment, addresses, reason) => {
  let message = '';
  let hasError = false;

  if (payment > 0) {
    let $balance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: userId.toString() }, {});

    if ($balance < payment * addresses.length) {
      hasError = true;
      message = 'You dont have enough money to send!' + $balance;
    } else {
      payment = parseFloat(payment).toFixed(6);
    }

    if (hasError === false) {
      let $userEmail;
      let userInfo = await DbHelper.query('SELECT email FROM users WHERE id = :userId', { userId }, 1);
      if (userInfo) {
        $userEmail = userInfo['email'];
      }

      let $rates = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {});
      let $usdAmount = payment * $rates['USD'];
      for (let $selectedUserAddress of addresses) {
        let transactionId = await ApiHelper.liteApiPost(
          process.env.LITECOIN_API_URL + 'send-to-address',
          {
            walletCode: userId.toString(),
            address: $selectedUserAddress,
            amount: payment,
            comment: reason,
            comment_to: reason,
          },
          {}
        );
        if (transactionId) {
          let $info = '';
          let transactionDetail = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transaction', { walletCode: userId.toString(), txid: transactionId }, {});
          if (transactionDetail) {
            let createdDate = ApiHelper.convertUnixTimeToTime(transactionDetail['time']);
            $info += `
                      <p>Recipients Address: ${$selectedUserAddress}</p>
                      <p>Amount: ${transactionDetail['details'][0]['amount']}</p>
                      <p>Fee: ${transactionDetail['details'][0]['fee']}</p>
                      <p>Recipients Email: ${transactionDetail['to']}</p>
                      <p>Transaction ID: <span class='long-text'>${transactionDetail['txid']}</span></p>
                      <p>Transaction Date (GMT): ${createdDate}</p>
                      </p>Transaction Comment: ${transactionDetail['comment']}</p>
                    `;
          }

          await DbHelper.dbInsert('transactions', {
            txid: transactionId,
            reason: reason,
            transaction_data: JSON.stringify(transactionDetail),
            sender_id: await CryptoHelper.encrypt(userId.toString()),
            receiver_id: await CryptoHelper.encrypt('9'),
            amount: payment,
            currency: 'USD',
            currency_amount: payment * $rates['USD'],
            currency_rate: $rates['USD'],
            currency_fee: transactionDetail['details'][0]['fee'] * $rates['USD'],
            wallet_from: $userEmail,
            wallet_to: transactionDetail['to'],
            created_at: ApiHelper.getCurrentUnixTime(),
            status: 'succeed',
          });
          await DbHelper.dbInsert('transaction_history', {
            transaction_id: transactionId,
            sender_id: await CryptoHelper.encrypt(userId.toString()),
            receiver_id: await CryptoHelper.encrypt('9'),
            comment: reason,
          });
          message += `Payment was successful, you'll shortly receive the funds into your account along with an email payment receipt. ${$info}`;
        } else {
          message += `${transactionId} Unfortunately your payment was declined, please try again later.`;
        }
      }
    }
  } else {
    hasError = true;
    message = 'Payment is required!';
  }

  return { status: hasError ? 0 : 1, message };
};

exports.makeFriend = async ($userId, $selectedUserId) => {
  let result;

  if ($userId !== $selectedUserId) {
    let currentUserFriend = await DbHelper.query('SELECT id FROM user_friends WHERE user_id = :userId AND friend_id = :friendId', { userId: $userId, friendId: $selectedUserId }, 1);
    if (currentUserFriend) {
      await DbHelper.dbUpdate('user_friends', { id: currentUserFriend['id'] }, { status: 'active' });
    } else {
      await DbHelper.dbInsert('user_friends', {
        user_id: $userId,
        friend_id: $selectedUserId,
        created_at: ApiHelper.getCurrentUnixTime(),
        status: 'active',
      });
    }
    result = true;
  } else {
    result = false;
  }

  return result;
};

exports.getUserCurrency = async (userId) => {
  let userPreferredCurrency = await DbHelper.query('SELECT preferred_currency FROM user_profiles WHERE user_id = :userId', { userId }, 1);
  if (userPreferredCurrency['preferred_currency']) {
    userPreferredCurrency = userPreferredCurrency['preferred_currency'].toUpperCase();
  } else {
    userPreferredCurrency = 'USD';
  }
  return userPreferredCurrency;
};

exports.getAmountByCurrency = async (ltcAmount, userId) => {
  const [currencyCode, currencyRates] = await Promise.all([this.getUserCurrency(userId), ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {})]);
  let currencyRate = parseFloat(currencyRates[currencyCode]);
  return ltcAmount * currencyRate;
};

exports.getUserTransactionDetail = async (blockchainId) => {
  let transactionDetail = {};
  let query =
    'SELECT contract.reward_post_id AS "Rewarded post", contract.transaction_id AS "Blockchain id", contract.type AS "Type", transaction_history.comment AS "Message", CONCAT(contract.requested_amount, " ", contract.currency) AS "Requested amount", CONCAT(contract.fee_total, " ", contract.currency) AS "Total fee", CONCAT(contract.final_amount, " ", contract.currency) AS "Total amount", FROM_UNIXTIME(contract.date) AS "Created at", contract.status AS "Confirmations" FROM contract INNER JOIN transaction_history ON contract.transaction_id=transaction_history.transaction_id WHERE contract.transaction_id = :blockchainId;';
  let transactionItem = await DbHelper.query(query, { blockchainId });
  transactionDetail = transactionItem[0];

  if (transactionDetail['Rewarded post']) {
    let postData = await DbHelper.query('SELECT content, files FROM posts WHERE id=:postId', { postId: transactionDetail['Rewarded post'] }, []);
    postData = postData ? postData[0] : {};

    if (postData.content.length > 30) {
      transactionDetail['Rewarded post content'] = ApiHelper.base64Decode(postData.content).slice(0, 30) + '...';
    } else {
      transactionDetail['Rewarded post content'] = ApiHelper.base64Decode(postData.content);
    }

    let file_id = postData.files && JSON.parse(postData.files)[0];
    if (file_id) {
      postData.files = await DbHelper.query('SELECT uri FROM files WHERE id=:file_id', { file_id }, '');
      transactionDetail['Rewarded post file'] = postData.files[0].uri;
    }
  }
  delete transactionDetail['Rewarded post'];

  return transactionDetail;
};

exports.getUserTransactions = async (userId, type = 'all') => {
  let transactionList = [];
  let [rates, transactions, filterId] = await Promise.all([ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {}), ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transactions', { walletCode: userId.toString(), count: 100, skip: 0 }, {}), CryptoHelper.encrypt(userId.toString())]);
  let transactionRows = await DbHelper.query('SELECT * FROM transaction_history WHERE sender_id = :senderId OR receiver_id = :receiverId', { senderId: filterId, receiverId: filterId });
  let tempTransactions = [];
  if (ApiHelper.isArray(transactions)) {
    for (let item of transactions) {
      let temp = {};

      let category = item.category;
      let confirmations = item.confirmations;

      let index = transactionRows.findIndex((element) => element.transaction_id == item.txid);
      if (index > -1) {
        [temp['sender_id'], temp['receiver_id']] = await Promise.all([parseInt(await CryptoHelper.decrypt(transactionRows[index].sender_id)), parseInt(await CryptoHelper.decrypt(transactionRows[index].receiver_id))]);
        temp['transaction_id'] = item.txid;
        temp['comment'] = transactionRows[index].comment;
        temp['transaction_data'] = item;
      } else {
        if (category === 'send') {
          temp['sender_id'] = userId;
          temp['receiver_id'] = ApiHelper.getObjectValue(item, 'to', -1);
        } else {
          temp['sender_id'] = ApiHelper.getObjectValue(item, 'to', -1);
          temp['receiver_id'] = userId;
        }
        temp['transaction_id'] = item.txid;
        temp['comment'] = item.comment;
        temp['transaction_data'] = item;
      }

      if (type == 'all') {
        tempTransactions.push(temp);
      } else if (type == 'sent') {
        if (category === 'send' && confirmations > 5) {
          tempTransactions.push(temp);
        }
      } else if (type == 'received') {
        if (category === 'receive' && confirmations > 5) {
          tempTransactions.push(temp);
        }
      } else if (type == 'pending') {
        if (confirmations < 6) {
          tempTransactions.push(temp);
        }
      } else if (type == 'completed') {
        if (confirmations > 5) {
          tempTransactions.push(temp);
        }
      }
    }
    for (let item of tempTransactions) {
      let transactionData = ApiHelper.getObjectValue(item, 'transaction_data', '');

      let transactionItem = new TransactionObject();
      [transactionItem.sender, transactionItem.receiver, transactionItem.currency] = await Promise.all([this.getUserName(item.sender_id), this.getUserName(item.receiver_id), this.getUserCurrency(userId)]);
      transactionItem.type = transactionData.category;

      switch (true) {
        case transactionItem.type === 'send' && transactionItem.receiver.id === 9:
          transactionItem.type = 'cashout';
          break;
        case transactionItem.type === 'receive' && transactionItem.sender.id === 9:
          transactionItem.type = 'topup';
          break;
      }

      transactionItem.blockchainId = ApiHelper.getObjectValue(item, 'transaction_id', '');
      transactionItem.message = ApiHelper.getObjectValue(item, 'comment', '');
      transactionItem.totalCoin = transactionData.amount;
      transactionItem.exchangeRate = ApiHelper.parse2Float(rates.hasOwnProperty(transactionItem.currency) ? rates[transactionItem.currency] : 0);
      transactionItem.createdAt = ApiHelper.convertUnixTimeToTime(transactionData.time);
      transactionItem.confirmations = transactionData.confirmations;
      transactionItem.account = ApiHelper.getObjectValue(transactionData, 'account', '');
      transactionItem.label = ApiHelper.getObjectValue(transactionData, 'label', '');
      transactionItem.to = ApiHelper.getObjectValue(transactionData, 'to', '');

      transactionList.push(transactionItem);
    }
  }
  return transactionList;
};

exports.createUserNotification = async (selectedUserId, createdBy, objectType, objectId, targetType, targetId) => {
  if (createdBy != selectedUserId) {
    let newId = await DbHelper.dbInsert('user_notifications', {
      user_id: selectedUserId,
      logs: null,
      object_type: objectType,
      object_id: objectId,
      target_type: targetType,
      target_id: targetId,
      created_by: createdBy,
      created_at: ApiHelper.getCurrentUnixTime(),
      status: 'new',
    });
    let notification = await NotificationHelper.sendPushNotification(newId, selectedUserId);

    return { newId, notification };
  } else {
    return { newId: 0, notification: {} };
  }
};

exports.sendCustomNotification = async ($selectedUserId, $type, $refId, $title, $message, $userId) => {
  return await NotificationHelper.sendCustomerPushNotification($selectedUserId, $type, $refId, $title, $message, $userId);
};

exports.getDemoSkills = async () => {
  return [
    'Java',
    'XML',
    'C',
    'C++',
    'JavaScript',
    'SQL',
    'HTML',
    'UML',
    'JBuilder',
    'Dreamweaver',
    'Rational Rose',
    'UltraEdit',
    'Borland C++Builder',
    'Oracle SQL* Plus',
    'Windows XP',
    'Linux',
    'Mac OS X',
    'Data Analysis',
    'Copywriting',
    'Foreign Languages',
    'Accounting',
    'Computer Languages',
    'Mathematics',
    'Graphic Design',
    'Planning / Event Planning',
    'SEO / SEM Marketing',
    'Bookkeeping',
    'Communication',
    'Ability to Work Under Pressure',
    'Decision Making',
    'Time Management',
    'Self-motivation',
    'Conflict Resolution',
    'Leadership',
    'Adaptability',
    'Teamwork',
    'Creativity',
    'Analytical',
    'Adaptable',
    'Quick Learner',
    'Able to Build Relationships',
    'Loyal and Discreet',
    'Flexible',
    'Responsible',
    'Able to Operate Under Pressure',
    'Efficient',
    'Detail-oriented',
  ];
};

exports.isUserActionActive = async (userId, objectType, objectId, value) => {
  let isActive = false;

  let userActionRow = await DbHelper.query(
    'SELECT id, value FROM user_actions WHERE created_by = :createdBy AND object_type = :objectType AND object_id = :objectId AND value = :value AND status = :status',
    {
      createdBy: userId,
      objectType: objectType,
      objectId: objectId,
      value: value,
      status: 'active',
    },
    1
  );
  if (userActionRow) {
    isActive = true;
  }

  return isActive;
};

exports.getUserIdsByAction = async (type, id, value) => {
  let ids = [];

  let userActionRows = await DbHelper.query('SELECT created_by FROM user_actions WHERE object_type = :objectType AND object_id = :objectId AND value = :value AND status = :status', {
    objectType: type,
    objectId: id,
    value: value,
    status: 'active',
  });
  for (let userAction of userActionRows) {
    ids.push(userAction['created_by']);
  }

  return ids;
};

exports.getUserActionTotal = async (objectType, objectId, value) => {
  let total = 0;

  let userActionRow = await DbHelper.query(
    'SELECT COUNT(id) AS total FROM user_actions WHERE object_type = :objectType AND object_id = :objectId AND value = :value AND status = :status',
    {
      objectType: objectType,
      objectId: objectId,
      value: value,
      status: 'active',
    },
    1
  );
  if (userActionRow) {
    total = parseInt(userActionRow['total']);
  }

  return total;
};

exports.createUserAccount = async (userId, username, type) => {
  let status;
  let message;
  let data;
  let id = 0;
  let otpCode = ApiHelper.getRandomOtp();
  let allowSendEdm = false;
  let allowSendSms = false;

  let userAccountRow = await DbHelper.query('SELECT * FROM user_accounts WHERE user_id = :userId AND username = :username', { userId, username }, 1);
  if (userAccountRow) {
    id = userAccountRow['id'];
    switch (userAccountRow['status']) {
      case 'deleted':
        await DbHelper.dbUpdate(
          'user_accounts',
          { id },
          {
            status: 'new',
            code: otpCode,
            updated_at: ApiHelper.getCurrentUnixTime(),
          }
        );
        if (ApiHelper.isEmail(username)) {
          allowSendEdm = true;
        } else if (ApiHelper.isPhone(username)) {
          allowSendSms = true;
        }
        status = 200;
        message = 'Reset';
        break;
      case 'new':
        await DbHelper.dbUpdate(
          'user_accounts',
          { id },
          {
            status: 'new',
            code: otpCode,
            updated_at: ApiHelper.getCurrentUnixTime(),
          }
        );
        if (ApiHelper.isEmail(username)) {
          allowSendEdm = true;
        } else if (ApiHelper.isPhone(username)) {
          allowSendSms = true;
        }
        status = 200;
        message = 'No verify';
        break;
      case 'verified':
        status = 400;
        message = 'Account always existed';
        break;
      default:
        break;
    }
  } else {
    id = await DbHelper.dbInsert('user_accounts', {
      user_id: userId,
      username: username,
      type: type,
      status: 'new',
      created_at: ApiHelper.getCurrentUnixTime(),
      code: otpCode,
    });
    status = 200;
    message = 'Success';
    if (ApiHelper.isEmail(username)) {
      allowSendEdm = true;
    } else if (ApiHelper.isPhone(username)) {
      allowSendSms = true;
    }
  }

  if (allowSendEdm) {
    let subject = `Your verify code is ${otpCode}`;
    let body = `Hi!
                <p>Your verify code is ${otpCode}</p>
               `;
    await ApiHelper.sendMail(username, subject, body).catch((err) => { });
  }
  if (allowSendSms) {
    let smsContent = `Hello, here is your verify code to access Kuky system: ${otpCode}`;
    await ApiHelper.sendSMS(username, smsContent).catch((err) => { });
  }

  let account = new AccountObject();
  account.status = 'new';
  account.type = type;
  account.username = username;

  data = account;

  return { status, message, data };
};

exports.verifyUserAccount = async (userId, username, type, code) => {
  let status;
  let message;
  let data;
  let account = new AccountObject();

  let userAccountRow = await DbHelper.query('SELECT * FROM user_accounts WHERE user_id = :userId AND username = :username AND code = :code', { userId, username, code }, 1);
  if (userAccountRow) {
    account.username = userAccountRow['username'];
    account.type = userAccountRow['type'];
    account.status = userAccountRow['status'];
    if (account.status == 'new') {
      account.status = 'verified';
      await DbHelper.dbUpdate('user_accounts', { username, status: 'verified' }, { status: 'locked' });
      await DbHelper.dbUpdate('user_accounts', { user_id: userId, username, code }, { status: account.status, code: '' });
      await DbHelper.dbUpdate('users', { name: username }, { status: 'alias' });
      status = 200;
      message = 'Success';
    } else {
      status = 200;
      message = 'Existed';
    }
  } else {
    status = 400;
    message = 'Data is invalid';
  }

  data = account;

  return { status, message, data };
};

exports.deleteUserAccount = async (userId, username) => {
  return await DbHelper.dbUpdate('user_accounts', { user_id: userId, username }, { status: 'deleted', code: '' });
};

exports.getUserAccounts = async (userId) => {
  let accountList = [];

  let userAccountRows = await DbHelper.query('SELECT * FROM users WHERE id = :userId AND status != :status', { userId, status: 'deleted' });
  for (let accountRow in userAccountRows) {
    let account = new AccountObject();
    account.status = accountRow['status'];
    accountList.push(account);
  }

  return accountList;
};

exports.getUserPosts = async (selectedUserId, userId) => {
  let from = 0;
  let limit = 100;

  let postList = [];

  let postRows = await DbHelper.query(`SELECT id FROM posts WHERE user_id = :selectedUserId ORDER BY id DESC LIMIT ${from}, ${limit}`, { selectedUserId });
  for (let post of postRows) {
    let item = await PostHelper.getPostItem(post['id'], userId);
    if (item != null) {
      postList.push(item);
    }
  }

  return postList;
};

exports.getExchangeRate = async (currency) => {
  let rates = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {});
  return ApiHelper.parse2Float(ApiHelper.getObjectValue(rates, currency, 0));
};

exports.userVerificationCompleted = async (passbaseKey) => {
  return await DbHelper.dbUpdate('user_passbase_verification', { passbase_key: passbaseKey }, { updated: ApiHelper.getCurrentUnixTime() });
};

exports.userVerificationFinished = async (passbaseKey, userId) => {
  return await DbHelper.dbInsert('user_passbase_verification', {
    passbase_key: passbaseKey,
    user_id: userId,
    created: ApiHelper.getCurrentUnixTime(),
  });
};

exports.userVerificationReviewed = async (passbaseKey, status) => {
  return await DbHelper.dbUpdate('user_passbase_verification', { passbase_key: passbaseKey }, { status, processed: ApiHelper.getCurrentUnixTime() });
};

exports.userVerificationStatus = async (userId) => {
  return await DbHelper.query('SELECT * from user_passbase_verification WHERE user_id = :userId', { userId });
};

exports.getUserVerificationRequests = async (userId, page, size, sort) => {
  let dbResult;
  if (sort == 'asc')
    dbResult = await DbHelper.query('SELECT uv.*, us.name, us.email FROM user_verification_request as uv LEFT JOIN users as us ON uv.user_id = us.id WHERE uv.user_id = :userId ORDER BY uv.updated_at ASC LIMIT :offset, :size', {
      userId,
      offset: page * size,
      size: size,
      sort: sort,
    });
  else
    dbResult = await DbHelper.query('SELECT uv.*, us.name, us.email FROM user_verification_request as uv LEFT JOIN users as us ON uv.user_id = us.id WHERE uv.user_id = :userId ORDER BY uv.updated_at DESC LIMIT :offset, :size', {
      userId,
      offset: page * size,
      size: size,
      sort: sort,
    });

  let total = await DbHelper.query('SELECT COUNT(*) as count from user_verification_request WHERE user_id = :userId', { userId });

  return [dbResult, total[0]['count']];
};

exports.getUserSettings = async (userId) => {
  let settings = new SettingsObject();

  let userProfileRow = await DbHelper.query('SELECT * FROM user_profiles WHERE user_id = :userId', { userId }, 1);
  if (userProfileRow) {
    settings.avatarUrl = await FileHelper.getFileUrl(userProfileRow['avatar_fid']);
    settings.backgroundUrl = await FileHelper.getFileUrl(userProfileRow['background_fid']);
    settings.exchangeRate = await this.getExchangeRate(userProfileRow['preferred_currency']);
    settings.accounts = await this.getUserAccounts(userId);
    settings.fullName = userProfileRow['full_name'];
    settings.introduction = userProfileRow['introduction'];
    settings.gender = userProfileRow['gender'];
    settings.maritalStatus = userProfileRow['marital_status'];
    settings.country = userProfileRow['country'];
    settings.language = userProfileRow['language'];
    settings.accountType = userProfileRow['account_type'];
    settings.over18 = userProfileRow['over18'];
    settings.subscribeToAdultContent = userProfileRow['subscribe_adult_content'];
    settings.preferredCurrency = userProfileRow['preferred_currency'];
  }

  return settings;
};

exports.updateUserSettings = async (userId, settingsData) => {
  let fullName = ApiHelper.getObjectValue(settingsData, 'fullName', '');
  let introduction = ApiHelper.getObjectValue(settingsData, 'introduction', '');
  let gender = ApiHelper.getObjectValue(settingsData, 'gender', '');
  let maritalStatus = ApiHelper.getObjectValue(settingsData, 'maritalStatus', '');
  let country = ApiHelper.getObjectValue(settingsData, 'country', '');
  let language = ApiHelper.getObjectValue(settingsData, 'language', '');
  let accountType = ApiHelper.getObjectValue(settingsData, 'accountType', '');
  let over18 = ApiHelper.getObjectValue(settingsData, 'over18', '');
  let subscribeToAdultContent = ApiHelper.getObjectValue(settingsData, 'subscribeToAdultContent', '');
  let preferredCurrency = ApiHelper.getObjectValue(settingsData, 'preferredCurrency', '');

  await DbHelper.dbUpdate(
    'user_profiles',
    { user_id: userId },
    {
      full_name: fullName,
      introduction: introduction,
      gender: gender,
      marital_status: maritalStatus,
      country: country,
      language: language,
      account_type: accountType,
      over18: over18,
      subscribe_adult_content: subscribeToAdultContent,
      preferred_currency: preferredCurrency,
    }
  );

  return await this.getUserSettings(userId);
};

exports.updateUserAvatar = async (userId, base64) => {
  let fileInfo = await FileHelper.uploadFileFromBase64(userId, base64, 'active');
  let fileId = fileInfo['id'];
  if (fileId > 0) {
    await DbHelper.dbUpdate('user_profiles', { user_id: userId }, { avatar_fid: fileId });
  }

  return await FileHelper.getFileObject(fileId, userId);
};

exports.updateUserBackground = async (userId, base64) => {
  let fileInfo = await FileHelper.uploadFileFromBase64(userId, base64, 'active');
  let fileId = fileInfo['id'];
  if (fileId > 0) {
    await DbHelper.dbUpdate('user_profiles', { user_id: userId }, { background_fid: fileId });
  }

  return await FileHelper.getFileObject(fileId, userId);
};

exports.getUsersByAction = async (objectType, objectId) => {
  let list = [];

  let userActionRows = await DbHelper.query('SELECT created_by FROM user_actions WHERE object_type = :objectType AND object_id = :objectId AND status = :status', { objectType, objectId, status: 'active' });
  for (let userAction of userActionRows) {
    let item = await this.getUserInfo(userAction['created_by']);
    list.push(item);
  }

  return list;
};

exports.getUserVoteData = async (type, objectId, value, userId) => {
  let voteData = new VoteData();
  voteData.total = await this.getUserActionTotal(type, objectId, value);
  voteData.active = await this.isUserActionActive(userId, type, objectId, value);

  return voteData;
};

exports.getCharacterData = async (id, userId) => {
  let personalityKeys = this.getAllPersonalityKeys();
  let personalityData = this.getPersonalityData();
  let personalityKey = ApiHelper.getArrayRandomValue(personalityKeys);

  let characterData = new CharacterData();
  characterData.name = personalityData[personalityKey]['name'];
  characterData.summary = personalityData[personalityKey]['summary'];
  characterData.code = personalityData[personalityKey]['code'];
  characterData.image = personalityData[personalityKey]['image_src'];
  // group 1
  characterData.introvert.total = await this.getUserActionTotal('VOTE_CHARACTER_IE', id, 'I');
  characterData.introvert.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_IE', id, 'I');
  characterData.extrovert.total = await this.getUserActionTotal('VOTE_CHARACTER_IE', id, 'E');
  characterData.extrovert.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_IE', id, 'E');
  // group 2
  characterData.observant.total = await this.getUserActionTotal('VOTE_CHARACTER_SN', id, 'S');
  characterData.observant.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_SN', id, 'S');
  characterData.intuitive.total = await this.getUserActionTotal('VOTE_CHARACTER_SN', id, 'N');
  characterData.intuitive.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_SN', id, 'N');
  // group 3
  characterData.thinking.total = await this.getUserActionTotal('VOTE_CHARACTER_TF', id, 'T');
  characterData.thinking.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_TF', id, 'T');
  characterData.feeling.total = await this.getUserActionTotal('VOTE_CHARACTER_TF', id, 'F');
  characterData.feeling.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_TF', id, 'F');
  // group 4
  characterData.judging.total = await this.getUserActionTotal('VOTE_CHARACTER_JP', id, 'J');
  characterData.judging.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_JP', id, 'J');
  characterData.prospecting.total = await this.getUserActionTotal('VOTE_CHARACTER_JP', id, 'P');
  characterData.prospecting.active = await this.isUserActionActive(userId, 'VOTE_CHARACTER_JP', id, 'P');

  return characterData;
};

exports.getVoteUpDownData = async (type, objectId, userId) => {
  let voteUpDown = new VoteUpDownObject();
  voteUpDown.upData = await this.getUserVoteData('VOTE_' + type, objectId, 'LIKE', userId);
  voteUpDown.downData = await this.getUserVoteData('VOTE_' + type, objectId, 'DISLIKE', userId);
  voteUpDown.total = voteUpDown.upData.total - voteUpDown.downData.total;
  voteUpDown.votedUsers = await this.getUsersByAction('VOTE_' + type, objectId);
  voteUpDown.reportData = await this.getUserVoteData('REPORT_' + type, objectId, 'REPORT', userId);
  voteUpDown.reportedUsers = await this.getUsersByAction('REPORT_' + type, objectId);
  voteUpDown.nsfwData = await this.getUserVoteData('NSFW_' + type, objectId, 'REPORT', userId);
  voteUpDown.nsfwUsers = await this.getUsersByAction('NSFW_' + type, objectId);
  voteUpDown.votedUpUserIds = await this.getUserIdsByAction('VOTE_' + type, objectId, 'LIKE');
  voteUpDown.votedDownUserIds = await this.getUserIdsByAction('VOTE_' + type, objectId, 'DISLIKE');
  voteUpDown.reportedUserIds = await this.getUserIdsByAction('REPORT_' + type, objectId, 'REPORT');
  voteUpDown.nswfUserIds = await this.getUserIdsByAction('NSFW_' + type, objectId, 'REPORT');

  return voteUpDown;
};

exports.addUserLocation = async (userId, latitude, longitude) => {
  if (userId > 0 && latitude && longitude) {
    let location = { lat: latitude, lng: longitude };
    await DbHelper.dbInsert('user_locations', {
      user_id: userId,
      location: JSON.stringify(location),
      created_at: ApiHelper.getCurrentUnixTime(),
    });
    await DbHelper.dbUpdate('user_profiles', { user_id: userId }, { location: JSON.stringify(location) });
    await EsHelper.saveUser(userId);
  }

  return true;
};

exports.createUserAction = async (userId, objectType, objectId, value) => {
  let currentTime = ApiHelper.getCurrentUnixTime();

  let userActionRow = await DbHelper.query('SELECT * FROM user_actions WHERE created_by = :createdBy AND object_type = :objectType AND object_id = :objectId', { createdBy: userId, objectType, objectId }, 1);
  if (userActionRow) {
    if (userActionRow['value'] === value) {
      await DbHelper.dbUpdate(
        'user_actions',
        { id: userActionRow['id'] },
        {
          updated_by: userId,
          updated_at: currentTime,
          status: userActionRow['status'] === 'active' ? 'deleted' : 'active',
        }
      );
    } else {
      await DbHelper.dbUpdate(
        'user_actions',
        { id: userActionRow['id'] },
        {
          updated_by: userId,
          updated_at: currentTime,
          value: value,
          status: 'active',
        }
      );
    }
  } else {
    await DbHelper.dbInsert('user_actions', {
      object_type: objectType,
      object_id: objectId,
      created_by: userId,
      created_at: currentTime,
      updated_by: userId,
      updated_at: currentTime,
      value: value,
      status: 'active',
    });
  }

  let $selectedUserId = 0;
  let $targetType = '';
  let $targetId = 0;
  let $info;
  switch (objectType) {
    case 'VOTE_POST':
    case 'REPORT_POST':
      $targetType = 'post';
      $targetId = objectId;
      $info = await DbHelper.query('SELECT created_by FROM posts WHERE id = :postId', { postId: objectId }, 1);
      if ($info) {
        $selectedUserId = $info['created_by'];
      }
      break;
    case 'VOTE_COMMENT':
    case 'REPORT_COMMENT':
      $targetType = 'post';
      $info = await DbHelper.query('SELECT created_by, object_id FROM comments WHERE id = :commentId', { commentId: objectId }, 1);
      if ($info) {
        $targetId = $info['object_id'];
        $selectedUserId = $info['created_by'];
      }
      break;
    case 'VOTE_SKILL':
      $targetType = 'user';
      $info = await DbHelper.query('SELECT user_id FROM user_skills WHERE id = :skillId', { skillId: objectId }, 1);
      if ($info) {
        $targetId = $info['user_id'];
        $selectedUserId = $info['user_id'];
      }
      break;
    case 'VOTE_USER':
    case 'VOTE_CHARACTER_IE':
    case 'VOTE_CHARACTER_JP':
    case 'VOTE_CHARACTER_SN':
    case 'VOTE_CHARACTER_TF':
      $targetType = 'user';
      $targetId = objectId;
      $selectedUserId = objectId;
      break;
    case 'WALLET_REQUEST_MONEY':
      $targetType = 'request_money';
      $targetId = objectId;
      $selectedUserId = 0;
      break;
    case 'WALLET_SEND_MONEY':
      $targetType = 'send_money';
      $targetId = objectId;
      $selectedUserId = 0;
      break;
    case 'WALLET_TOP_UP':
      $targetType = 'top_up';
      $targetId = objectId;
      $selectedUserId = 0;
      break;
    case 'WALLET_CASH_OUT':
      $targetType = 'cash_out';
      $targetId = objectId;
      $selectedUserId = 0;
      break;
    default:
      break;
  }

  if ($targetType !== '') {
    await this.createUserNotification($selectedUserId, userId, objectType, objectId, $targetType, $targetId);
  }

  await this.makeFriend(userId, $selectedUserId);

  return true;
};

exports.getUserFriends = async (userId) => {
  let friendList = [];

  let userFriendRows = await DbHelper.query('SELECT user_id, friend_id FROM user_friends WHERE user_id = :userId AND status = :status', { userId, status: 'active' }, 20);
  for (let userFriend of userFriendRows) {
    friendList.push(await this.getUserInfo(userFriend['friend_id']));
  }

  return friendList;
};

exports.getUserFriendsWithFilter = async (filterData, userId) => {
  let ids = [];

  let userFriendRows = await DbHelper.query('SELECT user_id, friend_id FROM user_friends WHERE user_id = :userId AND status = :status', { userId, status: 'active' }, 20);
  for (let userFriend of userFriendRows) {
    ids.push(userFriend['friend_id']);
  }
  filterData['ids'] = ids;

  return await this.getProfiles(filterData, userId);
};

exports.getSuggestFriends = async (filterData, userId) => {
  let userFriendRows1 = await DbHelper.query('SELECT friend_id FROM user_friends WHERE user_id = :userId AND status = :status', { userId, status: 'active' });

  let friendIds = [];
  for (let friendRow of userFriendRows1) {
    friendIds.push(friendRow['friend_id']);
  }
  friendIds.push(userId);

  let userFriendRows2 = await DbHelper.query('SELECT DISTINCT friend_id FROM user_friends WHERE user_id IN (:arr) AND friend_id NOT IN (:arr)AND status = :status', { arr: friendIds, status: 'active' });

  let ids = [];
  for (let friendRow of userFriendRows2) {
    ids.push(friendRow['friend_id']);
  }
  filterData['ids'] = ids;

  return await this.getProfiles(filterData, userId);
};

exports.getNearbyFriends = async (filterData, userId) => {
  return await this.getProfiles(filterData, userId);
};

exports.getMyProfile = async (userId) => {
  let myProfile = new MyProfileObject();
  myProfile.profile = await this.getProfileItem(userId, userId);
  myProfile.settings = await this.getUserSettings(userId);

  return myProfile;
};

exports.getUserInfo = async (userId) => {
  let userData = new UserObject();

  if (userId == 9) {
    userData.id = 9;
    userData.fullName = 'Admin';
  } else {
    let userRow = await DbHelper.query('SELECT u.id, up.full_name, up.introduction, up.avatar_fid, up.score, up.location, up.personality FROM users u INNER JOIN user_profiles up ON u.id = up.user_id WHERE u.id = :userId', { userId }, 1);
    if (userRow) {
      userData.id = userRow['id'];
      userData.introduction = userRow['introduction'];
      userData.occupation = userRow['personality'];
      userData.fullName = userRow['full_name'];
      userData.avatarUrl = await FileHelper.getFileUrl(userRow['avatar_fid']);
      userData.score = parseInt(userRow['score']) / 10;
      userData.location = ApiHelper.parseStringToLocationObject(userRow['location']);
      if (userData.location !== null) {
        userData.address = await GeoHelper.getGeoAddress(userData.location.lat, userData.location.lon, false);
      } else {
        userData.address = '...';
      }
    } else {
      userData.fullName = 'Unknown';
    }
  }

  return userData;
};

exports.getUserName = async (userId, incognito = 0) => {
  let userData = {};

  if (userId == 9) {
    userData.id = 9;
    userData.fullName = 'Admin';
  } else {
    let userRow = await DbHelper.query('SELECT u.id, up.full_name, up.avatar_fid FROM users u INNER JOIN user_profiles up ON u.id = up.user_id WHERE u.id = :userId', { userId }, 1);
    if (userRow) {
      userData.id = userRow['id'];
      userData.fullName = userRow['full_name'];
      userData.avatarUrl = await FileHelper.getFileUrl(userRow['avatar_fid']);
    } else {
      userData.fullName = 'Unknown';
    }
  }
  return userData;
};

exports.getUserItem = async (userId, incognito = 0) => {

  let userData = new UserObject();

  let info = await DbHelper.query('SELECT * FROM user_profiles WHERE user_id = :userId', { userId }, 1);
  if (info) {
    userData.id = info['id'];
    userData.introduction = info['introduction'];
    userData.occupation = '';
    userData.fullName = info['full_name'];
    userData.avatarUrl = await FileHelper.getFileUrl(info['avatar_fid']);
    userData.score = parseInt(info['score']) / 10;
    userData.distance = null;
    userData.location = ApiHelper.parseStringToLocationObject(info['location']);
    userData.lastUpdatedAt = ApiHelper.convertUnixTimeToTime(info['last_updated_at']);
  }

  return userData;
};

exports.getUserIdByName = async (name) => {
  let userId = 0;
  let userRow = await DbHelper.query('SELECT id, status FROM users WHERE name = :name', { name }, 1);
  if (userRow) {
    userId = userRow['id'];
  }

  return userId;
};

exports.getUserIdByEmail = async (email) => {
  let userId = 0;
  let userRow = await DbHelper.query('SELECT id, status FROM users WHERE email = :email', { email }, 1);
  if (userRow) {
    userId = userRow['id'];
  }

  return userId;
};

exports.genUserCode = async (username, length = 6, devicePushToken = '', deviceType = '', deviceVersion = '', smsOrEmail = true) => {

  let newCode = Math.random().toString().substr(2, length);
  let currentTime = ApiHelper.getCurrentUnixTime();
  let insertId = await DbHelper.dbInsert('user_login_codes', {
    name: username,
    code: newCode,
    device_push_token: devicePushToken,
    device_type: deviceType,
    device_version: deviceVersion,
    created_at: currentTime,
    expired_at: currentTime + 30 * 60,
    status: 'active',
  });

  if (smsOrEmail == true) {
    if (ApiHelper.isEmail(username)) {
      let subject = 'Kuky Sign In Code : ' + newCode;
      let body = ViewHelper.loginCodeView({ loginCode: newCode, email: username });
      await ApiHelper.sendMail([username], subject, body);
    } else if (ApiHelper.isPhone(username)) {
      let smsMessage = `Hello, here is your code to access Kuky system: ${newCode}`;
      await ApiHelper.sendSMS(username, smsMessage);
    }
  }

  return insertId ? newCode : 0;
};

exports.verifyUserCode = async (username, code) => {

  let isUpdated, devicePushToken, loginId;

  if (username === 'demo@kuky.com' && code === '112233') {
    isUpdated = 1;
    loginId = 2;
    devicePushToken = 'fake_token';
  } else {
    let currentTime = ApiHelper.getCurrentUnixTime();
    let userLoginCodeRow = await DbHelper.query(
      'SELECT id, name, device_push_token FROM user_login_codes WHERE name = :name AND code = :code AND status = :status AND expired_at > :expiredAt',
      {
        name: username,
        code: code,
        status: 'active',
        expiredAt: currentTime,
      },
      1
    );
    if (userLoginCodeRow) {
      loginId = userLoginCodeRow['id'];
      devicePushToken = userLoginCodeRow['device_push_token'];
      let changedRows = await DbHelper.dbUpdate('user_login_codes', { id: loginId }, { status: 'used' });
      isUpdated = changedRows > 0 ? 1 : 0;
    } else {
      isUpdated = -1;
    }
  }

  return { status: isUpdated, loginId: loginId, token: devicePushToken };
};

exports.genUserToken = async (username) => {
  let currentTime = ApiHelper.getCurrentUnixTime();
  let matrixCode = username + '@' + currentTime + '@' + '-kuky';

  return ApiHelper.hashString(matrixCode);
};

exports.getAccessUserInfo = async (username, devicePushToken = '', loginId = 0) => {

  let accessUserData;

  if (username === 'demo@kuky.com') {
    accessUserData = await this.getUserInfo(2);
    accessUserData['token'] = 'MTU1NTE1NDQ2MQ==NEAxNTU1MTU0NDYxQC1rdemo+kuky2019===';
  } else {
    if (devicePushToken !== null && devicePushToken !== '') {
      await DbHelper.dbUpdate('user_access_tokens', { device_push_token: devicePushToken, status: 'active' }, { updated_at: ApiHelper.getCurrentUnixTime(), status: 'locked' });
    }

    let currentTime = ApiHelper.getCurrentUnixTime();
    let userId = await this.getUserIdByEmail(username);
    let userToken = await this.genUserToken(userId);
    let affectedRows = await DbHelper.dbInsert('user_access_tokens', {
      user_id: userId,
      access_token: userToken,
      device_push_token: devicePushToken,
      created_at: currentTime,
      updated_at: currentTime,
      expired_at: currentTime + 30 * 24 * 60 * 60,
      status: 'active',
    });

    if (affectedRows > 0) {
      accessUserData = await this.getUserInfo(userId);
      accessUserData['token'] = userToken;
    } else {
      accessUserData = { id: 0, name: 'Guest', avatarUrl: '', token: '' };
    }
  }

  accessUserData['email'] = username;

  return accessUserData;
};

exports.checkUserAccessToken = async (request) => {
  let userToken = ApiHelper.getAccessTokenFromRequest(request);
  let currentTime = ApiHelper.getCurrentUnixTime();
  let userRow = await DbHelper.query(
    'SELECT user_id, id, expired_at FROM user_access_tokens WHERE access_token = :accessToken AND expired_at > :expiredAt AND status = :status',
    {
      accessToken: userToken,
      expiredAt: currentTime,
      status: 'active',
    },
    1
  );
  let userId = ApiHelper.getObjectValue(userRow, 'user_id', 0);

  return userId;
};

exports.userLogout = async (request) => {
  let userToken = ApiHelper.getAccessTokenFromRequest(request);

  return await DbHelper.dbUpdate('user_access_tokens', { access_token: userToken, status: 'active' }, { status: 'logout' });
};

exports.userNsfwSetting = async (userId) => {
  return await DbHelper.query('SELECT over18 FROM user_profiles WHERE user_id = :userId', { userId }, 1);
};

exports.getSkillIdBySkillName = async (skillName) => {
  skillName = skillName !== null ? skillName.trim() : '';
  let skillSlug = ApiHelper.convertToSlug(skillName);
  let skillRow = await DbHelper.query('SELECT id FROM skills WHERE slug = :slug', { slug: skillSlug }, 1);
  let skillId;
  if (skillRow) {
    skillId = skillRow['id'];
  } else {
    skillId = await DbHelper.dbInsert('skills', {
      slug: skillSlug,
      name: skillName,
      created_at: ApiHelper.getCurrentUnixTime(),
      total: 0,
      status: 'active',
    });
  }

  return skillId;
};

exports.getUserSkillItem = async (skillId, userId) => {
  let skillObject = new SkillObject();

  let userSkillRow = await DbHelper.query('SELECT us.id, s.name FROM user_skills us INNER JOIN skills s ON us.skill_id = s.id WHERE us.id = :skillId', { skillId }, 1);
  if (userSkillRow) {
    skillObject.id = userSkillRow['id'];
    skillObject.name = userSkillRow['name'];
    skillObject.voteData = await this.getVoteUpDownData('SKILL', skillId, userId);
  }

  return skillObject;
};

exports.getUserSkills = async (selectedUserId, userId) => {
  let skillList = [];

  let userSkillRows = await DbHelper.query('SELECT id FROM user_skills WHERE user_id = :userId AND status != :status', { userId: selectedUserId, status: 'deleted' });
  for (let userSkill of userSkillRows) {
    let item = await this.getUserSkillItem(userSkill['id'], userId);
    if (item) {
      skillList.push(item);
    }
  }

  return skillList;
};

exports.deleteUserSkill = async (userSkillId, userId) => {
  return await DbHelper.dbUpdate('user_skills', { id: userSkillId, user_id: userId }, { status: 'deleted' });
};

exports.addUserSkill = async (selectedUserId, skillName, userId) => {
  let userSkillId = 0;

  let skillId = await this.getSkillIdBySkillName(skillName);
  let userSkillRow = await DbHelper.query('SELECT id FROM user_skills WHERE user_id = :selectedUserId AND skill_id = :skillId', { selectedUserId, skillId }, 1);
  if (userSkillRow) {
    userSkillId = userSkillRow['id'];
  } else {
    userSkillId = await DbHelper.dbInsert('user_skills', {
      user_id: selectedUserId,
      skill_id: skillId,
      created_at: ApiHelper.getCurrentUnixTime(),
      status: 'active',
    });
  }
  await this.createUserNotification(selectedUserId, userId, 'addedSkill', skillId, 'user', selectedUserId);

  return await this.getUserSkillItem(userSkillId, userId);
};

exports.createNewUser = async (userEmail, fullName, avatarBase64) => {

  let userId = await this.getUserIdByEmail(userEmail);
  if (userId > 0) {
  } else {
    let email = '';
    if (ApiHelper.isEmail(userEmail)) {
      email = userEmail;
    }
    let currentTime = ApiHelper.getCurrentUnixTime();
    userId = await DbHelper.dbInsert('users', {
      name: fullName,
      email: userEmail,
      created_at: currentTime,
      status: 'new',
    });
    let fileInfo = await FileHelper.uploadFileFromBase64(userId, avatarBase64);
    let avatarFileId = fileInfo['id'];
    await DbHelper.dbInsert('user_profiles', {
      user_id: userId,
      full_name: fullName,
      avatar_fid: avatarFileId,
      preferred_currency: 'USD',
    });
  }
  if (userId > 0) {
    await EsHelper.saveUser(userId);
  }

  return userId;
};

exports.createFakeUser = async (username, type, fullName, avatarUrl, location) => {

  let userId = await this.getUserIdByName(username);
  if (userId > 0) {
  } else {
    let email = '';
    if (ApiHelper.isEmail(username)) {
      email = username;
    }
    let currentTime = ApiHelper.getCurrentUnixTime();
    userId = await DbHelper.dbInsert('users', {
      name: username,
      email: email,
      created_at: currentTime,
      status: 'fake',
    });
    let fileId = await FileHelper.createFile(userId, avatarUrl, 'image/jpg', 'new');
    await DbHelper.dbInsert('user_profiles', {
      user_id: userId,
      full_name: fullName,
      avatar_fid: fileId,
      score: ApiHelper.getRandomInt(50),
      location: JSON.stringify(location),
    });
  }

  return userId;
};

exports.getProfiles = async (filterData, userId = 0) => {
  let from = ApiHelper.getObjectValue(filterData, 'from', 0);
  let limit = ApiHelper.getObjectValue(filterData, 'limit', 10);
  let keyword = ApiHelper.getObjectValue(filterData, 'q', '');
  let ids = ApiHelper.getObjectValue(filterData, 'ids', '');
  let latitude = ApiHelper.getObjectValue(filterData, 'latitude', '');
  let longitude = ApiHelper.getObjectValue(filterData, 'longitude', '');
  let sorting = ApiHelper.getObjectValue(filterData, 'sorting', '');
  let status = ApiHelper.getObjectValue(filterData, 'status', '');
  let skills = ApiHelper.getObjectValue(filterData, 'skills', '');
  let gender = ApiHelper.getObjectValue(filterData, 'gender', '');
  let personalities = ApiHelper.getObjectValue(filterData, 'personalities', '');

  let list = [];
  let result = await EsHelper.esFilterProfiles(
    sorting,
    {
      key: keyword,
      ids: ids,
      latitude: latitude,
      longitude: longitude,
      status: status,
      skills: skills,
      gender: gender,
      personalities: personalities,
    },
    'desc',
    from,
    limit
  );
  let firstHits = ApiHelper.getObjectValue(result, 'hits', {});
  let secondHits = ApiHelper.getObjectValue(firstHits, 'hits', []);
  for (let hit of secondHits) {
    if (userId !== hit['_id']) {
      let item = await this.getUserInfo(hit['_id']);
      if (item != null) {
        let tmp = hit['_source'];
        item.occupation = ApiHelper.getObjectValue(ApiHelper.getObjectValue(tmp, 'characterData', {}), 'name', '');
        let sort = hit['sort'] || [];
        if (sort.length > 0 && sort[0] < 10000) {
          item.distance = ApiHelper.parse2Float(sort[0]).toFixed(3) + 'km';
        }

        list.push(item);
      }
    }
  }

  return list;
};

exports.getPostIds = async () => {
  let postIds = [];

  let postRows = await DbHelper.query('SELECT id FROM posts ORDER BY id DESC LIMIT 0,50', {});
  for (let post of postRows) {
    postIds.push(post['id']);
  }

  return postIds;
};

exports.getUserIds = async () => {
  let userIds = [];

  let userRows = await DbHelper.query('SELECT id FROM users LIMIT 0,1000', {});
  for (let user of userRows) {
    userIds.push(user['id']);
  }

  return userIds;
};

exports.getUnsynzedUserIds = async () => {
  let userIds = [];

  let userProfileRows = await DbHelper.query('SELECT user_id FROM user_profiles WHERE es_synz IS NULL ORDER BY id DESC LIMIT 0,20', {});
  for (let userProfile of userProfileRows) {
    userIds.push(userProfile['user_id']);
  }

  return userIds;
};

exports.getUnsynzedPostIds = async () => {
  let postIds = [];

  let postRows = await DbHelper.query('SELECT id FROM posts WHERE es_synz IS NULL ORDER BY id DESC LIMIT 0,50', {});
  for (let post of postRows) {
    postIds.push(post['id']);
  }

  return postIds;
};

exports.getFileIds = async () => {
  let fileIds = [];

  let fileRows = await DbHelper.query('SELECT id FROM files LIMIT 0,1000', {});
  for (let file of fileRows) {
    fileIds.push(file['id']);
  }

  return fileIds;
};

exports.getAllSkills = async () => {
  return await DbHelper.query('SELECT id, name FROM skills', {});
};

exports.getPersonalityData = ($gender = 'men') => {
  let $personalityData = {};
  $personalityData['istj'] = {
    code: 'istj',
    name: 'Logistician',
    summary: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: 'assets/character/' + $gender + '-Logistician.png',
  };
  $personalityData['istp'] = {
    code: 'istp',
    name: 'Virtuoso',
    summary: 'Bold and practical experimenters, masters of all kinds of tools.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/istp.png',
    app_image_src: 'assets/character/' + $gender + '-Virtuoso.png',
  };
  $personalityData['isfj'] = {
    code: 'isfj',
    name: 'Defender',
    summary: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/isfj.png',
    app_image_src: 'assets/character/' + $gender + '-Defender.png',
  };
  $personalityData['isfp'] = {
    code: 'isfp',
    name: 'Adventurer',
    summary: 'Flexible and charming artists, always ready to explore and experience something new.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/isfp.png',
    app_image_src: 'assets/character/' + $gender + '-Adventurer.png',
  };
  $personalityData['intj'] = {
    code: 'intj',
    name: 'Architect',
    summary: 'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/intj.png',
    app_image_src: 'assets/character/' + $gender + '-Architect.png',
  };
  $personalityData['intp'] = {
    code: 'intp',
    name: 'Logician',
    summary: 'Innovative inventors with an unquenchable thirst for knowledge.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/intp.png',
    app_image_src: 'assets/character/' + $gender + '-Logician.png',
  };
  $personalityData['infj'] = {
    code: 'infj',
    name: 'Advocate',
    summary: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/infj.png',
    app_image_src: 'assets/character/' + $gender + '-Advocate.png',
  };
  $personalityData['infp'] = {
    code: 'infp',
    name: 'Mediator',
    summary: 'Poetic, kind and altruistic people, always eager to help a good cause.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/infp.png',
    app_image_src: 'assets/character/' + $gender + '-Mediator.png',
  };
  $personalityData['estj'] = {
    code: 'estj',
    name: 'Executive',
    summary: 'Excellent administrators, unsurpassed at managing things – or people.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/estj.png',
    app_image_src: 'assets/character/' + $gender + '-Executive.png',
  };
  $personalityData['estp'] = {
    code: 'estp',
    name: 'Entrepreneur',
    summary: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/estp.png',
    app_image_src: 'assets/character/' + $gender + '-Entrepreneur.png',
  };
  $personalityData['esfj'] = {
    code: 'esfj',
    name: 'Consul',
    summary: 'Extraordinarily caring, social and popular people, always eager to help.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/esfj.png',
    app_image_src: 'assets/character/' + $gender + '-Consul.png',
  };
  $personalityData['esfp'] = {
    code: 'esfp',
    name: 'Entertainer',
    summary: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/esfp.png',
    app_image_src: 'assets/character/' + $gender + '-Entertainer.png',
  };
  $personalityData['entj'] = {
    code: 'entj',
    name: 'Commander',
    summary: 'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/entj.png',
    app_image_src: 'assets/character/' + $gender + '-Commander.png',
  };
  $personalityData['entp'] = {
    code: 'entp',
    name: 'Debater',
    summary: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/entp.png',
    app_image_src: 'assets/character/' + $gender + '-Debater.png',
  };
  $personalityData['enfj'] = {
    code: 'enfj',
    name: 'Protagonist',
    summary: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/enfj.png',
    app_image_src: 'assets/character/' + $gender + '-Protagonist.png',
  };
  $personalityData['enfp'] = {
    code: 'enfp',
    name: 'Campaigner',
    summary: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    image_src: 'https://storage.googleapis.com/neris/public/images/types/enfp.png',
    app_image_src: 'assets/character/' + $gender + '-Campaigner.png',
  };

  return $personalityData;
};

exports.getAllPersonalityKeys = () => {
  return ['istj', 'istp', 'isfj', 'isfp', 'intj', 'intp', 'infj', 'infp', 'estj', 'estp', 'esfj', 'esfp', 'entj', 'entp', 'enfj', 'enfp'];
};

exports.getProfileItem = async (id, userId = 0) => {
  let userProfileObject = new UserProfileObject();
  let personalityData = this.getPersonalityData();
  let personalityKeys = this.getAllPersonalityKeys();

  let userProfileRow = await DbHelper.query('SELECT * FROM user_profiles WHERE user_id = :id', { id }, 1);
  if (userProfileRow) {
    userProfileObject.introduction = userProfileRow['introduction'];
    let personalityKey = ApiHelper.getArrayRandomValue(personalityKeys);
    userProfileObject.occupation = personalityData[personalityKey]['name'];
    userProfileObject.characterData = await this.getCharacterData(id, userId);
    userProfileObject.id = userProfileRow['id'];
    userProfileObject.avatarUrl = await FileHelper.getFileUrl(userProfileRow['avatar_fid']);
    userProfileObject.backgroundUrl = await FileHelper.getFileUrl(userProfileRow['background_fid']);
    userProfileObject.fullName = userProfileRow['full_name'];
    userProfileObject.status = userProfileRow['marital_status'];
    userProfileObject.gender = userProfileRow['gender'];
    userProfileObject.score = userProfileRow['score'] / 10;
    userProfileObject.location = ApiHelper.parseStringToLocationObject(userProfileRow['location']);
    userProfileObject.skills = await this.getUserSkills(id, userId);
    userProfileObject.friends = await this.getUserFriends(id);
  }

  return userProfileObject;
};

exports.updateUser = async (userId, userEntity) => {
  let fullName = ApiHelper.getObjectValue(userEntity, 'full_name', '');
  await DbHelper.dbUpdate('user_profiles', { user_id: userId }, { full_name: fullName });

  if (userId > 0) {
    await EsHelper.saveUser(userId);
  }

  return userId;
};

exports.getCommentsTotal = async (type, id) => {
  let commentRow = await DbHelper.query('SELECT COUNT(id) AS total FROM comments WHERE object_type = :type AND object_id = :id', { type, id }, 1);
  return ApiHelper.parseInt(commentRow['total'], 0);
};

exports.userStripeCustomer = async (userId) => {
  let userRow = await DbHelper.query('SELECT * FROM users WHERE id = :userId', { userId }, 1);
  let userEmail = userRow['email'];

  let customer = await StripeHelper.createStripeCustomer(userEmail);
  let id = await DbHelper.dbInsert('user_stripe_customer', { user_id: userId, stripe_customer_id: customer.id });

  return { id, customerId: customer.id };
};

exports.stripeCustomer = async (userId, cardInfo) => {
  let userRow = await DbHelper.query('SELECT * FROM users WHERE id = :userId', { userId }, 1);
  let userEmail = userRow['email'];

  let cardNumber = ApiHelper.getObjectValue(cardInfo, 'cardNumber', '');
  let expiryDate = ApiHelper.getObjectValue(cardInfo, 'expiryDate', {});
  let expiryMonth = ApiHelper.getObjectValue(expiryDate, 'month', '');
  let expiryYear = ApiHelper.getObjectValue(expiryDate, 'year', '');
  let cvc = ApiHelper.getObjectValue(cardInfo, 'cvc', '');

  let cardObject = {
    number: cardNumber,
    exp_month: expiryMonth,
    exp_year: expiryYear,
    cvc: cvc,
  };

  let cardToken = await StripeHelper.cardToken(cardObject);
  let customer = await StripeHelper.createCustomer(userEmail, cardToken.id);

  let id;
  let customerRow = await DbHelper.query('SELECT * FROM stripe_customer WHERE user_id = :userId', { userId }, 1);
  if (customerRow) {
    id = customerRow['id'];
    await DbHelper.dbUpdate('stripe_customer', { id }, { stripe_customer_id: customer.id, card_id: cardToken.id });
  } else {
    id = await DbHelper.dbInsert('stripe_customer', {
      user_id: userId,
      stripe_customer_id: customer.id,
      card_id: cardToken.id,
    });
  }

  return { id, customerId: customer.id };
};
