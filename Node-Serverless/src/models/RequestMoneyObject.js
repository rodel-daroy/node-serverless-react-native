let UserObject = require("./UserObject");

class RequestMoneyObject {
  constructor() {
    this.id = 0;
    this.sender = new UserObject();
    this.receiver = new UserObject();
    this.type = "";                       // request|receive
    this.amount = 0;
    this.reason = "";
    this.status = "new";                  // new|done
    this.createdAt = "";
  }
}

module.exports = RequestMoneyObject;