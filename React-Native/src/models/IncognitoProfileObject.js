import CONSTANTS from '../common/PeertalConstants';

let CharacterData = require("./CharacterData");

class IncognitoProfileObject {
  constructor() {
    this.fullName = "Incognito"; //can be Igconito -> if it is igconito
    this.avatarUrl = CONSTANTS.INCOGNITO_AVATAR;
    this.backgroundUrl = CONSTANTS.INCOGNITO_BACKGROUND;
    this.location = null; //, // {lat:11, long:11} geo-point type
    this.distance = 0; //, // KM optional in case use for another purpose
    this.score = 0; //,
    this.id = 0;
    // this.occupation = "Engineer";
    this.friends = []; // [userObject, userObject],
    this.introduction = `Incognito profiles exist as a way to enable expression of ideas and opinions with Protection against retaliation. What you post will protect your identity but you will be held accountable by our amazing community. 
    We ask you to always be respectful & follow these rules guidelines when acting under a incognito profile:
    Good words,
    Good thoughts
    Good deeds
    If you see something you don’t like, be sure to report it or down vote it. Kuky will be as good as what we make of it in a community.`;
    this.skills = []; // [skillObject],
    this.characterData = new CharacterData();
  }
}

module.exports = IncognitoProfileObject;
