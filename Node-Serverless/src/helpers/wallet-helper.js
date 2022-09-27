const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');

exports.feeCalculation = async (requestedAmount, userId) => {
  let [currencyRates, userPreferredCurrency] = await Promise.all([ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {}), DbHelper.query('SELECT preferred_currency FROM user_profiles WHERE user_id = :userId', { userId }, 1)]);

  let currencyCode = userPreferredCurrency['preferred_currency'] || 'USD';
  let currencyRate = parseFloat(currencyRates[currencyCode]);
  let usdCurrencyRate = parseFloat(currencyRates['USD']);
  let requestedAmountUSD = currencyCode === 'USD' ? requestedAmount : requestedAmount * (usdCurrencyRate / currencyRate);
  let requestedLtc = Number(parseFloat(requestedAmount / currencyRate).toFixed(6));

  // Fee calculation
  const BASE_FEE = 1.5; // Base on US dollar
  const PERCENTAGE_FEE_IN_APP_PURCHASE = 0.5;
  const PERCENTAGE_FEE_UNDER_THOUSANDS_DOLLAR = 0.02;
  const PERCENTAGE_FEE_UNDER_TENTHOUSANDS_DOLLAR = 0.01;
  const PERCENTAGE_FEE_UNDER_HUNDREDTHOUSANDS_DOLLAR = 0.005;
  let baseFee = currencyCode === 'USD' ? BASE_FEE : BASE_FEE * (currencyRate / usdCurrencyRate);
  let percentageFee = 0;
  let feePercentage = 0;
  switch (true) {
    case requestedAmountUSD <= 1000:
      percentageFee = requestedAmount * PERCENTAGE_FEE_UNDER_THOUSANDS_DOLLAR;
      feePercentage = PERCENTAGE_FEE_UNDER_THOUSANDS_DOLLAR;
      break;
    case requestedAmountUSD <= 10000:
      percentageFee = requestedAmount * PERCENTAGE_FEE_UNDER_TENTHOUSANDS_DOLLAR;
      feePercentage = PERCENTAGE_FEE_UNDER_TENTHOUSANDS_DOLLAR;
      break;
    default:
      percentageFee = requestedAmount * PERCENTAGE_FEE_UNDER_HUNDREDTHOUSANDS_DOLLAR;
      feePercentage = PERCENTAGE_FEE_UNDER_HUNDREDTHOUSANDS_DOLLAR;
  }

  let feeTotal = baseFee + percentageFee;
  return {
    requestedLtc,
    currencyCode,
    currencyRate,
    baseFee,
    feeTotal,
    percentageFee,
    feePercentage,
  };
};

exports.iapFeeCalculation = async (requestedAmount) => {
  let currencyRates = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {});

  let currencyCode = 'USD';
  let currencyRate = parseFloat(currencyRates[currencyCode]);
  let requestedLtc = Number(parseFloat(requestedAmount / currencyRate).toFixed(6));
  let receivingLtc = requestedLtc * 0.5;

  // Fee calculation
  const PERCENTAGE_FEE_IN_APP_PURCHASE = 0.5;
  let percentageFee = 0;
  let feePercentage = 0;
  percentageFee = requestedAmount * PERCENTAGE_FEE_IN_APP_PURCHASE;
  feePercentage = PERCENTAGE_FEE_IN_APP_PURCHASE;
  let feeTotal = percentageFee;

  return {
    receivingLtc,
    feeTotal,
    percentageFee,
    feePercentage,
  };
};

exports.ltcBalanceCheck = async (requestedLtc, targetUser) => {
  let balance = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: targetUser.toString() }, {});
  return requestedLtc < balance;
};

exports.ltcExchangeByAmount = async (requestedAmount, userPreferredCurrency) => {
  let currencyRates = await ApiHelper.liteApiGet(process.env.LITECOIN_API_URL + 'current-rates', {});
  let currencyCode = userPreferredCurrency || 'USD';
  let currencyRate = parseFloat(currencyRates[currencyCode]);
  let requestedLtc = Number(parseFloat(requestedAmount / currencyRate).toFixed(6));
  return requestedLtc;
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
