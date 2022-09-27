const UserObject = require("./UserObject");

class NotificationObject {
  constructor() {
    this.user = new UserObject();
    this.id = 114;                            // removed User, as we only get notification from the user
    this.title = 'title';
    this.summary = 'summary';
    this.createdAt = '2022-01-14 16:45:45';
    this.type = '';                           // "commented|commentTagged|posted|postTagged|sendMoney|receiveMoney", we will define later, but right now we could he:
    this.link = '';                           // use for router and deeplink: -> /post/{id} message/{id}
    this.media = [];                          // [MediaObject],
    this.status = 'new|opened|deleted';       // to make sure that we still keep
  }
}

module.exports = NotificationObject;
