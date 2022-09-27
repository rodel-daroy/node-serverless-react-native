let UserObject = require("./UserObject");
let VoteUpDownObject = require("./VoteUpDownObject");
let LocationObject = require("./LocationObject");
let MoneyObject = require("./MoneyObject");

class PostObject {
  constructor() {
    this.id = 0;
    this.isOwner = true;
    this.content = "";
    this.isPublic = true;
    this.status = "";
    this.locationAddress = "";
    this.createdAt = "";
    this.isIncognito = true;
    this.distance = 0;
    this.location = new LocationObject();
    this.user = new UserObject();
    this.media = [];
    this.voteData = new VoteUpDownObject();
    this.totalComments = 0;
    this.comments = [];
    this.taggedUsers = [];
    this.moneyReceivers = [];
    this.money = new MoneyObject();
  }
}

module.exports = PostObject;