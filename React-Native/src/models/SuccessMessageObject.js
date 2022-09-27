class SuccessMessageObject {
  constructor(
    title = "Cash Out",
    headline = "Yay!",
    firstLine = "You have cashed out",
    mainNumber = "350",
    mainCurrency = "AUD",
    secondLine = "to you bank account",
    message = "Let's wait for 24 hours and check your bank account. If there is any issue, please contact to us",
    button = "Done"
  ) {
    this.title = title;
    this.headline = headline;
    this.firstLine = firstLine;
    this.mainNumber = mainNumber;
    this.mainCurrency = mainCurrency;
    this.secondLine = secondLine;
    this.message = message;
    this.button = button;
  }
}

module.exports = SuccessMessageObject;
