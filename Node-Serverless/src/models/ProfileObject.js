class ProfileObject {
  constructor() {
    this.background = "https://s3.xx.ss/1.jpg";
    this.avatar = "https://s3.xx.ss/1.jpg";
    this.fullName = "Trinh Le";
    this.introduction = "I am a good guy";
    this.gender = "male";
    this.maritalStatus = "married";
    this.country = "vn";
    this.language = "vi-VN";
    this.accountType = "individual";
    this.over18 = true;
    this.subscribeToAdultContent = false;
    this.preferredCurrency = "VND";
    this.exchangeRate = 11;                     // (LTC to PreferCurrency);
  }
}

module.exports = ProfileObject;