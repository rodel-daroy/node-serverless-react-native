let UserObject = require("./UserObject");

class WalletObject {
  constructor() {
    this.id = 0;
    this.address = 0;
    this.balance = 0;
    this.currency = "USD";
    this.exchangeRate = "";
    this.cards = [];
    this.bankAccounts = [];
  }
}

module.exports = WalletObject;
