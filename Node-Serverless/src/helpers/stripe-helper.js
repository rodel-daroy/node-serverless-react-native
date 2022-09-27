const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ceil = require('math-ceil');

const ApiHelper = require('./api-helper');


// =====   OLD   =====

exports.visaCardCheck = async (requestBody) => {

  let status = 1;
  let hasError;
  let errorData = {
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  };

  let fullName = ApiHelper.getObjectValue(requestBody, 'fullName', '');
  let cardNumber = ApiHelper.getObjectValue(requestBody, 'cardNumber', '');
  let expiryDate = ApiHelper.getObjectValue(requestBody, 'expiryDate', {});
  let expiryDateMonth = ApiHelper.getObjectValue(expiryDate, 'month', '');
  let expiryDateYear = ApiHelper.getObjectValue(expiryDate, 'year', '');
  let cvc = ApiHelper.getObjectValue(requestBody, 'cvc', '');
  let type = ApiHelper.getObjectValue(requestBody, 'type', '');

  if (ApiHelper.isEmptyString(fullName)) {
    hasError = true;
    errorData['fullName'] = 'Name is invalid!';
  }
  if (ApiHelper.isEmptyString(cardNumber)) {
    hasError = true;
    errorData['cardNumber'] = 'Card number is invalid!';
  }
  if (!expiryDateYear || !expiryDateMonth) {
    hasError = true;
    errorData['expiryDate'] = 'Expiry date is invalid!';
  }
  if (cvc === '') {
    hasError = true;
    errorData['cvc'] = 'CVC is invalid!';
  }

  if (hasError) {
    status = 0;
  }

  return { status: status, errors: errorData }
}

exports.retrieveAPaymentMethod = async (paymentMethodId) => {
  return await stripe.paymentMethods.retrieve(paymentMethodId);
}
exports.tokenCreate = async (cardInfo) => {
  return await stripe.tokens.create({ card: cardInfo });
}

exports.customerCreate = async (email, stripeToken) => {
  return await stripe.customers.create({ email: email, source: stripeToken });
}

exports.chargeCreate = async (stripeCustomerId, amount, currency) => {
  return await stripe.charges.create({ customer: stripeCustomerId, amount: ceil(amount * 100), currency: currency.toLowerCase() });
}


// =====   NEW   =====

exports.balance = async () => {
  return await stripe.balance.retrieve();
}

exports.cardToken = async (cardInfo) => {

  let cardObject = cardInfo && cardInfo.cvc ? cardInfo : {
    number: '4242424242424242',
    exp_month: 7,
    exp_year: 2022,
    cvc: '314',
  };

  return await stripe.tokens.create({ card: cardObject });
}

exports.createStripeCustomer = async (email) => {
  return await stripe.customers.create({ email });
}

exports.createCustomer = async (email, cardToken) => {
  return await stripe.customers.create({ email: email, source: cardToken });
}

exports.getCustomer = async (customerId) => {
  return await stripe.customers.retrieve(customerId);
}

exports.createCharge = async (stripeCustomerId, amount, currency) => {
  return await stripe.charges.create({ customer: stripeCustomerId, amount: ceil(amount * 100), currency: currency.toLowerCase() });
}

exports.createPaymentIntent = async (paymentMethodId, amount, currency, customerId, userEmail) => {
  const stripeConvertCurrencyArr = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
  amount = ((stripeConvertCurrencyArr.indexOf(currency) > -1) ? ceil(amount) :ceil(amount * 100));
  return await stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    amount: amount,
    currency: currency.toLowerCase(),
    save_payment_method: true,
    setup_future_usage: 'off_session',
    customer: customerId,
    receipt_email: userEmail,
    error_on_requires_action: true,
    confirm: true,
  });
}

exports.getPaymentIntent = async (paymentIntentId) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

exports.payout = async (amount, currency) => {
  return await await stripe.payouts.create({ amount: ceil(amount * 100), currency: currency.toLowerCase(), });
}

exports.createAccount = async (accountObject) => {
  return await stripe.accounts.create(accountObject);
};

exports.getAccount = async (accountId) => {
  return await stripe.accounts.retrieve(accountId);
}

exports.updateAccount = async (accountId) => {
  return await stripe.accounts.update(
    accountId,
    {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '209.58.133.152',
      }
    }
  );
}

exports.updateCapability = async (accountId) => {
  return await stripe.accounts.updateCapability(accountId, 'card_payments', { requested: true });
}

exports.accountLinks = async (accountId, refreshUrl, returnUrl, type) => {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: type,
  });
}

exports.bankToken = async (bankInfo) => {

  let bankObject = bankInfo && bankInfo.account_number ? bankInfo : {
    country: 'AU',
    currency: 'aud',
    account_holder_name: 'Jenny Rosen',
    account_holder_type: 'individual',
    routing_number: '110000',
    account_number: '000123456',
  }
  return await stripe.tokens.create({ bank_account: bankObject });
}

exports.createExternalAccount = async (accountId, externalAccountId, type) => {

  let externalAccount

  if (type == 'bank') {
    externalAccount = await stripe.accounts.createExternalAccount(accountId, { external_account: externalAccountId });
  }

  if (type == 'card') {
    externalAccount = await stripe.accounts.createExternalAccount(accountId, { external_account: externalAccountId });
  }

  return externalAccount
}

exports.createTransfer = async (amount, currency, accountId) => {
  return await stripe.transfers.create({ amount: ceil(amount * 100), currency: currency.toLowerCase(), destination: accountId });
}

exports.accountPayout = async (amount, currency, accountId) => {
  return await await stripe.payouts.create({
    amount: ceil(amount * 100),
    currency: currency.toLowerCase(),
  }, {
    stripe_account: accountId,
  });
}


exports.getStripeCurrencies = async () => {
  return [
    "usd",
    "aed",
    "afn",
    "all",
    "amd",
    "ang",
    "aoa",
    "ars",
    "aud",
    "awg",
    "azn",
    "bam",
    "bbd",
    "bdt",
    "bgn",
    "bif",
    "bmd",
    "bnd",
    "bob",
    "brl",
    "bsd",
    "bwp",
    "bzd",
    "cad",
    "cdf",
    "chf",
    "clp",
    "cny",
    "cop",
    "crc",
    "cve",
    "czk",
    "djf",
    "dkk",
    "dop",
    "dzd",
    "egp",
    "etb",
    "eur",
    "fjd",
    "fkp",
    "gbp",
    "gel",
    "gip",
    "gmd",
    "gnf",
    "gtq",
    "gyd",
    "hkd",
    "hnl",
    "hrk",
    "htg",
    "huf",
    "idr",
    "ils",
    "inr",
    "isk",
    "jmd",
    "jpy",
    "kes",
    "kgs",
    "khr",
    "kmf",
    "krw",
    "kyd",
    "kzt",
    "lak",
    "lbp",
    "lkr",
    "lrd",
    "lsl",
    "mad",
    "mdl",
    "mga",
    "mkd",
    "mmk",
    "mnt",
    "mop",
    "mro",
    "mur",
    "mvr",
    "mwk",
    "mxn",
    "myr",
    "mzn",
    "nad",
    "ngn",
    "nio",
    "nok",
    "npr",
    "nzd",
    "pab",
    "pen",
    "pgk",
    "php",
    "pkr",
    "pln",
    "pyg",
    "qar",
    "ron",
    "rsd",
    "rub",
    "rwf",
    "sar",
    "sbd",
    "scr",
    "sek",
    "sgd",
    "shp",
    "sll",
    "sos",
    "srd",
    "std",
    "svc",
    "szl",
    "thb",
    "tjs",
    "top",
    "try",
    "ttd",
    "twd",
    "tzs",
    "uah",
    "ugx",
    "uyu",
    "uzs",
    "vnd",
    "vuv",
    "wst",
    "xaf",
    "xcd",
    "xof",
    "xpf",
    "yer",
    "zar",
    "zmw",
    "eek",
    "lvl",
    "vef"
  ];
}
