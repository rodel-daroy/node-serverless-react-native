let LocationObject = require("./LocationObject");

class UserItemObject {
  constructor() {
    this.id = 0;
    this.fullName = "";                   // can be Igconito -> if it is igconito
    this.avatarUrl = "";
    this.introduction = "";
    this.location = new LocationObject(); //: location, // {lat:11, long:11} geo-point type
    this.distance = 0;                    // KM optional in case use for another purpose
    this.score = 0;
    this.occupation = "";                 // anything in the list of DB: engineer,
  }
}

module.exports = UserItemObject;