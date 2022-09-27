let UserObject = require("./UserObject");
let VoteUpDownObject = require("./VoteUpDownObject");
let LocationObject = require("./LocationObject");
let MoneyObject = require("./MoneyObject");

class PostObject {
  constructor() {
    this.user = new UserObject();
    this.isOwner = true;
    this.id = 0;
    this.media = [];
    this.content = "";
    this.comments = [];
    this.voteData = new VoteUpDownObject();
    this.distance = 0;
    this.locationAddress = "";
    this.location = new LocationObject();
    this.isPublic = true;
    this.createdAt = "";
    this.isIncognito = true;
    this.taggedUsers = [];
    this.moneyReceivers = [];
    this.money = new MoneyObject();
  }
}

module.exports = PostObject;
