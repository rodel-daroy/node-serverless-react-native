class MediaObject {
  constructor() {
    this.id = 1;
    this.url = "https://s3.xx.ss/1.jpg";
    this.description = "nice cat"; //can be null or ''
    this.height = 110;
    this.width = 200;
    this.location = null; //can get from real file, but can be null if nothing
    this.length = 20; //seconds if it is video
    this.type = "photo"; // can be video
  }
}

module.exports = MediaObject;
