const UserObject = require("./UserObject");

class NotificationObject {
  constructor() {
    this.user = new UserObject();
    this.id = 124;                            // removed User, as we only get notification from the user
    this.title = "";
    this.summary = "";
    this.createdAt = "";
    this.type = "";                           // "commented|commentTagged|posted|postTagged|sendMoney|receiveMoney|likedPost|dislikedPost|likedComment|dislikedComment", //we will define later, but right now we could he:
    this.link = "";                           // use for router and deeplink: -> /post/{id} message/{id}
    this.media = [];                          // [MediaObject],
    this.status = "new|opened|read|deleted";  // to make sure that we still keep
  }

  getFirebaseNotification() {
    return {
      "title": this.user.fullName + " " + this.title,
      "body": this.summary
    };
  }

  getFirebaseData() {
    return {
      link: this.link,
      media: this.media
    };
  }
}

module.exports = NotificationObject;