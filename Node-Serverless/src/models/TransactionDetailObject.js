let UserObject = require("./UserObject");

class TransactionDetailObject {
  constructor() {
    this.blockchainId = '';             // transaction id,
    this.type = '';                     // send|receive
    this.message = '';
    this.sender = new UserObject();
    this.receiver = new UserObject();
    this.totalCoin = 0.00;              // LTC or BTC value,
    this.currency = 'USD';
    this.exchangeRate = 0;
    this.createdAt = new Date();
  }
}

module.exports = TransactionDetailObject;