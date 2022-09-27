class UserObject {
  constructor() {
    this.id = 0;
    this.fullName = "Kuky User"; //can be Igconito -> if it is igconito
    this.avatarUrl = "";
    this.introduction = "";
    this.address = "102 Le Loi st, HCM, VN";
    this.location = null; //: location, // {lat:11, long:11} geo-point type
    this.distance = null; //, // KM optional in case use for another purpose
    this.score = 0;
    this.occupation = "Kuky citizen"; // anything in the list of DB: engineer,
    // architect, doctor
  }
}

module.exports = UserObject;
