let UserObject = require('./UserObject');

class FileObject {
    constructor() {
        this.id = 1;
        this.url = "https://s3.xx.ss/1.jpg";
        this.user = new UserObject();
        this.mimeType = "image/jpg";
        this.data = {};
        this.createdAt = Date.now()
        this.status = "new";
    }
}

module.exports = FileObject;