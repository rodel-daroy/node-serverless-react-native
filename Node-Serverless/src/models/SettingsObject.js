class SettingsObject {
  constructor() {
    this.fullName = "Luat";                 //: "Vietnam",
    this.avatarUrl = "";                    //: "Vietnam",
    this.backgroundUrl = "";                //: "Vietnam",
    this.introduction = "";                 //: "Vietnam",
    this.country = "Vietnam";               //: "Vietnam",
    this.gender = "male";                   //: "Vietnam",
    this.language = "vietnamese";           //: "english|vietnamese",
    this.accountType = "individual";        //: "individual|business",
    this.over18 = "yes";                    //: "yes|no",
    this.subscribeToAdultContent = "yes";   //: "yes|No",
    this.preferredCurrency = "VND";         //: "VND|AUD|xxxx",
    this.exchangeRate = "11";               //: 11, // (LTC to PreferCurrency),
    this.accounts = [];                     // [accountObject, accountObject], //  (first one is  // default),
    // Phone: ["+862222", "+22343535"], // (first one is default),
    this.contactType = "email";             //: "phone/email"
  }
}

module.exports = SettingsObject;