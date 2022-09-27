// @flow
class ContactObject {
  constructor() {
    this.id = 0;
    //media:[mediaObject, mediaObject],
    this.media = [];
    this.description = "";
    this.topic = "posting";
    this.email = "";
    this.phone = "";
  }
}

module.exports = ContactObject;
