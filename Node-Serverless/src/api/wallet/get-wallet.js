const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');

const WalletObject = require('../../models/WalletObject');


/**
 * @swagger
 * tags:
 *   name: Wallet
 * /wallet:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get user wallet detail
 *     security:
 *       - accessToken: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return firebase user data. data.logged.idToken is to be used as an access-token
 *
 */
module.exports.get = async (request) => {

  let statusCode = 0, message = '', data = {};

  let userId = await UserHelper.checkUserAccessToken(request);

  if (userId > 0) {
    let userWallet = new WalletObject();
    userWallet.id = userId.toString();
    userWallet.address = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-wallet-address', { walletCode: userId.toString() }, {});
    let userPreferredCurrency = await DbHelper.query('SELECT preferred_currency FROM user_profiles WHERE user_id = :userId', { userId }, 1);
    userWallet.currency = userPreferredCurrency['preferred_currency'] || 'USD';
    userWallet.balance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: userId.toString() }, {});
    userWallet.exchangeRate = await UserHelper.getExchangeRate(userWallet.currency);
    userWallet['balance' + userWallet.currency] = userWallet.balance * userWallet.exchangeRate;
    userWallet.bankAccounts = [];
    userWallet.cards = [];

    statusCode = 200;
    message = 'Success';
    data = userWallet;
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
