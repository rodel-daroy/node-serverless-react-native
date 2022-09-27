class FilterFriendsObject {
  constructor() {
    this.location = {
      lon: 0,
      lat: 0,
      address: ""
    };
    this.maritalStatus = "";
    this.gender = "";
    this.skills = [];
    this.selectedCharacter = 0;
  }
}
module.exports = FilterFriendsObject;
