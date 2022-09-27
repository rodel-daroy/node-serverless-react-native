const walletHelper = require("../../src/helpers/wallet-helper");
const ApiHelper = require('../../src/helpers/api-helper');
const expect  = require('chai').expect;

describe('Fee calculation', () => {
  let response;
  it('requestedLtc must be', async () => {  
    response = await walletHelper.feeCalculation(1, 85);
    expect(response.requestedLtc > 0).to.equal(true);
  });
    
  it('Currency code must be USD', () => {
    expect(response.currencyCode).to.equal('USD');
  });

  it('baseFee should be 1.5', () => {
    expect(response.baseFee).to.equal(1.5);
  });

  it('Total charge should be requested amout + fee total', () => {
    const {
      baseFee,
      percentageFee,
      requestedLtc,
      currencyRate,
      feeTotal
    } = response;
    expect((baseFee + percentageFee + (requestedLtc * currencyRate)) > feeTotal).to.equal(true);
  });

  it('fee percentage should be ', () => {
    expect(response.feePercentage > 0).to.equal(true);
  });
});

// ltcBalanceCheck 
describe('Check if Admin has enough balance ', () => {
  let response;
  it('LTC balance must be more than 0', async () => {  
    response = await ApiHelper.liteApiPost(process.env.LITECOIN_API_URL + 'get-balance', { walletCode: '9' }, {})
    expect(response > 0).to.equal(true);
  });
});