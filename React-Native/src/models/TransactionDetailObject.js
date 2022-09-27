let UserObject = require("./UserObject");

class TransactionDetailObject {
  constructor() {
    this.blockchainId = ""; //transaction id,
    this.confirmations = 0;
    this.totalCoin = 0; //LTC or BTC value,
    this.createdAt = new Date();
    this.sender = new UserObject();
    this.receiver = new UserObject();
    this.message = "";
  }
}

module.exports = TransactionDetailObject;
