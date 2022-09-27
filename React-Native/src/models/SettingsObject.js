class SettingsObject {
  constructor() {
    this.fullName = "guestName"; //: "Vietnam",
    this.avatarUrl = ""; //: "Vietnam",
    this.backgroundUrl = ""; //: "Vietnam",
    this.introduction = ""; //: "Vietnam",
    this.country = "Australia"; //: "Vietnam",
    this.language = "English"; //: "english|vietnamese",
    this.accountType = "individual"; //: "individual|business",
    this.over18 = true; //: "yes|no",
    this.gender = "male";
    this.maritalStatus = "";
    this.subscribeToAdultContent = true; //: "yes|No",
    this.preferredCurrency = "USD"; //: "VND|AUD|xxxx",
    this.exchangeRate = "110"; //: 11, // (LTC to PreferCurrency),
    this.accounts = [];// [accountObject, accountObject], //  (first one is
    // default),
    // Phone: ["+862222", "+22343535"], // (first one is default),
    this.contactType = "email"; //: "phone/email"
    this.allowPeopleToSeeMe = true;
  }
}

module.exports = SettingsObject;
