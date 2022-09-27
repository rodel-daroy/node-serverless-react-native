let CharacterData = require("./CharacterData");

class UserProfileObject {
  constructor() {
    this.fullName = "KuKy"; //can be Igconito -> if it is igconito
    this.avatarUrl = "https://www.kuky.com/avatar.jpg";
    this.backgroundUrl = "https://www.kuky.com/background.jpg";
    this.location = null; //, // {lat:11, long:11} geo-point type
    this.distance = 0; //, // KM optional in case use for another purpose
    this.score = 0; //,
    this.id = 0;
    // this.occupation = "Engineer";
    this.friends = []; // [userObject, userObject],
    this.introduction = "I am a good guy";
    this.skills = []; // [skillObject],
    this.characterData = new CharacterData();
  }
}

module.exports = UserProfileObject;
