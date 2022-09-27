let LocationObject = require("./LocationObject");

class UserObject {
  constructor() {
    this.id = 0;
    this.fullName = "";       // can be Igconito -> if it is igconito
    this.avatarUrl = "";
    this.address = "";
    this.location = new LocationObject();
    this.distance = null;
    this.score = 0;
    this.occupation = "";     // anything in the list of DB: engineer,
  }
}

module.exports = UserObject;