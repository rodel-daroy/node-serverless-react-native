let VoteUpDownObject = require("./VoteUpDownObject");
class CommentObject {
  constructor() {
    this.user = null;//UserObject,
    this.isOwner = true; // to identify if the user is own this?
    this.id = 0;//
    this.media = [];// [mediaObject, mediaObject],
    this.children = [];// [commentObject],
    this.voteData = new VoteUpDownObject();
    this.isPublic = true;
    this.isIncognito = false;
    this.createdAt = "";//DateTime;
    this.content = "";
    this.taggedUsers = [];// [userObject]
  }
}

module.exports = CommentObject;
