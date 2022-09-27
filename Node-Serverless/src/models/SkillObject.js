let VoteUpDownObject = require("./VoteUpDownObject");

class SkillObject {
  constructor() {
    this.id = 0;
    this.name = "Html";
    this.voteData = new VoteUpDownObject();
  }
}

module.exports = SkillObject;