const UserProfileObject = require("./UserProfileObject");
const ProfileObject = require("./ProfileObject");

class MyProfileObject {
  constructor() {
    this.profile = new UserProfileObject();
    this.settings = new ProfileObject();
    this.accounts = [];
  }
}

module.exports = MyProfileObject;