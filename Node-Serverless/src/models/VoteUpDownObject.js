let VoteData = require("./VoteData");

class VoteUpDownObject {
  constructor() {
    this.upData = new VoteData();
    this.downData = new VoteData();
    this.total = 0;
    this.votedUsers = [];               // [userObject, userObject]
    this.reportData = new VoteData();
    this.reportedUsers = [];
    this.nsfwData = new VoteData();
    this.nsfwUsers = [];
  }
}

module.exports = VoteUpDownObject;