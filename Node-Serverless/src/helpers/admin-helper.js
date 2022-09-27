const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');
const UserHelper = require('./user-helper');

const TransactionObject = require('../models/TransactionObject');


exports.getAdminUserIdByEmail = async (email) => {

  let adminUserRow = await DbHelper.query('SELECT id FROM admin_users WHERE email = :email AND status = :status', { email, status: 'active' }, 1);

  if (adminUserRow) {
    return adminUserRow['id'];
  } else {
    return 0;
  }
};

exports.checkAdminUserAccessToken = async (request) => {

  let userToken = ApiHelper.getAccessTokenFromRequest(request);
  let adminUserTokenRow = await DbHelper.query('SELECT admin_user_id, id FROM admin_user_tokens WHERE access_token = :accessToken AND status = :status', { accessToken: userToken, status: 'active' }, 1);
  let userId = ApiHelper.getObjectValue(adminUserTokenRow, 'admin_user_id', 0);

  return userId;
};

exports.verifyAdminUserCode = async (username, token, code) => {

  let isUpdated;
  let devicePushToken;
  let loginId;
  let currentTime = ApiHelper.getCurrentUnixTime();

  let adminUserCodeRow = await DbHelper.query(
    `SELECT id, name, token FROM admin_user_codes WHERE name = :name AND token = :token AND code = :code AND status = :status AND expired_at > :expiredAt`,
    {
      name: username,
      token: token,
      code: code,
      status: 'active',
      expiredAt: currentTime
    },
    1
  );

  if (adminUserCodeRow) {
    loginId = adminUserCodeRow['id'];
    devicePushToken = adminUserCodeRow['token'];
    let changedRows = await DbHelper.dbUpdate('admin_user_codes', { id: loginId }, { status: 'used' });
    isUpdated = changedRows > 0 ? 1 : 0;
  } else {
    isUpdated = -1;
  }

  return { status: isUpdated, loginId, token: devicePushToken }
};

exports.getAdminAccessInfo = async (username, userToken) => {

  let accessUserData;
  let currentTime = ApiHelper.getCurrentUnixTime();
  let userId = await this.getAdminUserIdByEmail(username);
  let affectedRows = await DbHelper.dbInsert('admin_access_tokens',
    {
      admin_user_id: userId,
      access_token: userToken,
      created_at: currentTime,
      updated_at: currentTime,
      expired_at: currentTime + (30 * 24 * 60 * 60),
      status: 'active'
    }
  );

  if (affectedRows > 0) {
    let adminUserRow = await DbHelper.query('SELECT id, display_name FROM admin_users WHERE email = :email', { email: username }, 1);
    accessUserData = {
      id: adminUserRow ? adminUserRow['id'] : userId,
      name: adminUserRow ? adminUserRow['display_name'] : '...',
      email: username,
      token: userToken
    };
  } else {
    accessUserData = {};
  }

  return accessUserData;
};

exports.getUserVerifications = async (filterData, size = 10, page = 0, _status = 'all', sort = 'asc') => {

  size = ApiHelper.parseInt(size)
  page = ApiHelper.parseInt(page)

  let status
  switch (_status) {
    case 'all':
      status = 100
      break
    case 'pending':
      status = 0
      break;
    case 'rejected':
      status = 2
      break;
    case 'approved':
      status = 1
      break;
  }

  let dbResult
  let total = 0
  if (status == 100) {
    total = await DbHelper.query('SELECT COUNT(*) as c FROM user_verification_request');
    if (sort = 'asc')
      dbResult = await DbHelper.query(
        `SELECT uv.*, f.uri, us.email, us.name
          FROM user_verification_request as uv
          LEFT JOIN files f
          ON uv.file_id =  f.id
          LEFT JOIN users us
          ON us.id = uv.user_id
          WHERE true
          ORDER BY uv.updated_at ASC 
          LIMIT :size OFFSET :offset`,
        {
          offset: page * size,
          size: size
        },
        size
      )
    else
      dbResult = await DbHelper.query(
        `SELECT uv.*, f.uri, us.email, us.name
          FROM user_verification_request as uv
          LEFT JOIN files f
          ON uv.file_id =  f.id
          LEFT JOIN users us
          ON us.id = uv.user_id
          WHERE true
          ORDER BY uv.updated_at DESC 
          LIMIT :size OFFSET :offset`,
        {
          offset: page * size,
          size: size
        },
        size
      )
  }
  else {
    total = await DbHelper.query('SELECT COUNT(*) as c FROM user_verification_request WHERE status = :status', { status });
    dbResult = await DbHelper.query(
      `SELECT uv.*, f.uri, us.email, us.name
        FROM user_verification_request as uv
        LEFT JOIN files f
        ON uv.file_id =  f.id
        LEFT JOIN users us
        ON us.id = uv.user_id
        WHERE uv.status = :status
        ORDER BY uv.updated_at DESC 
        LIMIT :size OFFSET :offset`,
      {
        offset: page * size,
        size: size,
        status: status
      },
      size
    )
  }

  if (!dbResult)
    return { total: total[0]['c'], page, size, verificationRequests: [] }

  return { total: total[0]['c'], page, size, verificationRequests: dbResult }
}

exports.updateUserVerifications = async (id, body) => {
  return DbHelper.dbUpdate('user_verification_request', { id, updated_at: Date.now() }, body);
}

exports.getPageItem = async (id) => {

  let item;

  let staticPageRow = await DbHelper.query('SELECT id, code, title, body, status FROM static_pages WHERE id = :pageId', { pageId: id }, 1);
  if (staticPageRow) {
    item = {
      type: 'node_item',
      _type: 'page',
      _id: id,
      _source: {
        id: staticPageRow['id'],
        title: staticPageRow['title'],
        code: staticPageRow['code'],
        status: staticPageRow['status']
      },
      data: {
        buttons: [{ title: 'Edit', type: 'edit' }],
        id: id,
        type: 'page',
        content: `${staticPageRow['code']} - ${staticPageRow['title']}`
      }
    };
  } else {
    item = null;
  }

  return item;
};

exports.getTransactions = async (type, count = 10, skip = 0) => {

  count = ApiHelper.parseInt(count);
  skip = ApiHelper.parseInt(skip);
  count = 1000;

  let list;
  let transactionList = {};

  let listtransactions = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-transactions', { walletCode: '9', count, skip }, {});
  if (ApiHelper.isArray(listtransactions)) {
    if (type != '') {

      let arr00 = [];

      for (let value of listtransactions) {
        if (type === 'sent') {
          if (value['category'] === 'send' && value['confirmations'] > 5) {
            arr00.push(value);
          }
        }
        if (type === 'received') {
          if (value['category'] === 'receive' && value['confirmations'] > 5) {
            arr00.push(value);
          }
        }
        if (type === 'pending') {
          if (value['confirmations'] < 6) {
            arr00.push(value);
          }
        }
        if (type === 'completed') {
          if (value['confirmations'] > 5) {
            arr00.push(value);
          }
        }
        if (type === 'all') {
          arr00.push(value);
        }
      }

      listtransactions = arr00;
    }

    for (let value of listtransactions) {

      let item = new TransactionObject();
      item.createdAt = ApiHelper.convertUnixTimeToTime(value['time']);
      item.type = value['category'];

      let receiverId;
      let senderId;
      switch (item.type) {
        case 'send':
          senderId = 1;
          receiverId = value['to'];
          break;
        default:
          senderId = value['to'];
          receiverId = 1;
          break;
      }

      let senderUserId;
      if (ApiHelper.isEmail(senderId)) {
        senderUserId = await UserHelper.getUserIdByName(senderId);
      } else {
        senderUserId = senderId;
      }
      item.sender = await UserHelper.getUserInfo(senderUserId);

      let receiverUserId;
      if (ApiHelper.isEmail(receiverId)) {
        receiverUserId = await UserHelper.getUserIdByName(receiverId);
      } else {
        receiverUserId = receiverId;
      }
      item.receiver = await UserHelper.getUserInfo(receiverUserId);

      item.totalCoin = value['amount'];
      item.blockchainId = value['txid'];
      item.confirmations = value['confirmations'];
      item.account = value['account'];
      item.message = value['comment'];
      item.label = value['label'];
      item.to = value['to'];

      transactionList[value['time']] = {
        type: 'node_item',
        _type: 'transaction',
        _id: ApiHelper.parseInt(key) + 1,
        _source: {
          id: ApiHelper.parseInt(key) + 1,
          tix: item.blockchainId,
          created_at: item.createdAt,
          sender: { name: item.sender.fullName },
          receiver: { name: item.receiver.fullName },
          total: item.totalCoin,
          type: item.type,
        },
        data: {
          type: 'transaction',
          buttons: [],
          content: `
                    <h2>${item.type}</h2>
                    <h2>${item.totalCoin}</h2>
                    <p>Message: <strong>${item.message}</strong></p>
                    <p>Date: <strong>${item.createdAt}</strong></p>
                    <p>Receiver: <strong>${item.receiver.fullName}</strong></p>
                    <p>Sender: <strong>${item.sender.fullName}</strong></p>
                  `
        }
      };
    }
  }

  list = ApiHelper.convertObject2Array(transactionList);
  total = list.length;

  return { title: 'Transactions', skip, next: skip + count, count, total: 0, list }
};


exports.getFiles = async () => {
  return DbHelper.query("SELECT * FROM files WHERE cron IS NULL AND mime_type LIKE '%image%' ORDER BY id DESC LIMIT 5")
}


exports.getPosts = async () => {
  return DbHelper.query("SELECT * FROM posts WHERE cron=1 ORDER BY id DESC LIMIT 5")
}
