let UserObject = require("./UserObject");
let FileObject = require("./MediaObject");

class UserVerificationRequestObject {
    constructor() {
        this.id = 0;
        this.location = new UserObject();
        this.status = 0;
        this.file = new FileObject();
    }
}

module.exports = UserVerificationRequestObject;