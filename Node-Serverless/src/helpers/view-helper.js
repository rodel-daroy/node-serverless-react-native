const Twig = require('twig'),
  twig = Twig.twig;
const fs = require('fs');
require.extensions['.twig'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

exports.renderView = (view, data) => {
  const words = require('../views/' + view + '.twig');
  const template = twig({ data: words });
  return template.render(data);
};

exports.loginCodeView = (params) => {
  let data = { loginCode: params.loginCode, email: params.email };
  return this.renderView('email/loginCode', data);
};

exports.passbaseApproved = () => {
  return this.renderView('email/passbaseApproved', {});
};

exports.passbaseDeclined = () => {
  return this.renderView('email/passbaseDeclined', {});
};

exports.requestMoney = (params) => {
  let data = {
    senderName: params.senderName,
    ltcAmount: params.ltcAmount,
    amount: params.amount,
    currency: params.currency,
    reason: params.reason,
  };
  return this.renderView('email/requestMoney', data);
};

exports.sendMoney = (params) => {
  let data = {
    receiver: params.receiver,
    sender: params.sender,
    usdAmount: params.usdAmount,
    currency: params.currency,
    fee: 0,
    date: params.date,
    transactionId: params.transactionId,
    transactionDescription: params.transactionDescription,
  };
  return this.renderView('email/sendMoney', data);
};

exports.promotionNotice = (params) => {
  let data = {
    EXPLANATION: params.EXPLANATION,
    promotionCode: params.promotionCode,
    promotionCodeExpiryDate: params.promotionCodeExpiryDate,
  };
  return this.renderView('email/promotion', data);
};

exports.topUp = (params) => {
  let data = {
    fullName: params.fullName,
    amountUsd: params.amountUsd,
    currency: params.currency,
  };
  return this.renderView('email/topUp', data);
};

exports.cashOut = (params) => {
  let data = {
    senderName: params.senderName,
    amount: params.amount,
    transactionId: params.transactionId,
    currency: params.currency,
  };
  return this.renderView('email/cashOut', data);
};
