const models = require('../../models');
const { sendMoney } = require('./view-helper');
const UserHelper = require('./user-helper');

const PROMOTION_INVITATION_REWARD = 1;
const PROMOTION_INVITATION_MESSAGE = 'Invitation promotion reward';

exports.validatePromotionCodeRegister = async (promotion_code, email) => {
  let result = {};
  let data = await models.Promotions.findOne({ attributes: ['promotion_sub_data', 'promotion_type', 'promotion_code_expiry_date', 'promotion_status'], where: { promotion_code: promotion_code } });
  switch (true) {
    case data['promotion_code_expiry_date'] < new Date():
      result.statusCode = 400;
      result.message = 'Promotion code is expired';
      break;
    case data['promotion_sub_data'] !== email:
      result.statusCode = 400;
      result.message = 'Promotion code and email unmatches';
      break;
    case data['promotion_status'] === 'completed':
      result.statusCode = 400;
      result.message = 'Promotion already completed with this code';
      break;
    default:
      result.statusCode = 200;
      break;
  }
  return result;
};

exports.sendMoneyAfterInvitationPromotionRegister = async (promotion_code, newUserId) => {
  let receivers = [];
  let currency = 'USD';
  let invitedUser = await models.Promotions.findOne({ attributes: ['user_id'], where: { promotion_code: promotion_code } });
  receivers = [invitedUser['user_id'], newUserId];
  let sendMoneyResult = await UserHelper.sendMoney(9, PROMOTION_INVITATION_REWARD, receivers, PROMOTION_INVITATION_MESSAGE, currency, 'send money', null);
  await models.Promotions.update({ promotion_status: 'completed' }, { where: { promotion_code: promotion_code } });
  return sendMoneyResult.status ? true : false;
};
