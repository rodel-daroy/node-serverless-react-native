let VoteUpDownObject = require("./VoteUpDownObject");
let UserObject = require("./UserObject");

class CommentObject {
  constructor() {
    this.id = 0;
    this.user = new UserObject();
    this.isOwner = true;            // to identify if the user is own this?
    this.media = [];                // [mediaObject, mediaObject],
    this.children = [];             // [commentObject],
    this.voteData = new VoteUpDownObject();
    this.isPublic = true;
    this.isIncognito = false;
    this.createdAt = "";            // DateTime;
    this.content = "";
    this.taggedUsers = [];          // [userObject]
  }
}

module.exports = CommentObject;