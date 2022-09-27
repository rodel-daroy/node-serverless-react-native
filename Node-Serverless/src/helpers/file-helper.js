const Fs = require('fs')
const Path = require('path')
const uuid4 = require('uuid4');
const AWS = require('aws-sdk');
const vision = require('@google-cloud/vision');
const sizeOf = require('image-size');
const base64Img = require('base64-img');
const axios = require('axios');

const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');

const MediaObject = require('../models/MediaObject');


const S3_URL = process.env.MEDIA_ENDPOINT;
const S3_REGION = process.env.MEDIA_ENDPOINT_REGION;


module.exports.getRandomFilePath = (mineType) => {

  let ext;

  switch (mineType) {
    case "audio/aac":
      ext = "aac";
      break;
    case "application/x-abiword":
      ext = "abw";
      break;
    case "application/x-freearc":
      ext = "arc";
      break;
    case "video/x-msvideo":
      ext = "avi";
      break;
    case "application/vnd.amazon.ebook":
      ext = "azw";
      break;
    case "application/octet-stream":
      ext = "bin";
      break;
    case "image/bmp":
      ext = "bmp";
      break;
    case "application/x-bzip":
      ext = "bz";
      break;
    case "application/x-bzip2":
      ext = "bz2";
      break;
    case "application/x-csh":
      ext = "csh";
      break;
    case "text/css":
      ext = "css";
      break;
    case "text/csv":
      ext = "csv";
      break;
    case "application/msword":
      ext = "doc";
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ext = "docx";
      break;
    case "application/vnd.ms-fontobject":
      ext = "eot";
      break;
    case "application/epub+zip":
      ext = "epub";
      break;
    case "image/gif":
      ext = "gif";
      break;
    case "text/html":
      ext = "html";
      break;
    case "image/vnd.microsoft.icon":
      ext = "ico";
      break;
    case "text/calendar":
      ext = "ics";
      break;
    case "application/java-archive":
      ext = "jar";
      break;
    case "image/jpeg":
    case "image/jpg":
      ext = "jpg";
      break;
    case "text/javascript":
      ext = "js";
      break;
    case "application/json":
      ext = "json";
      break;
    case "application/ld+json":
      ext = "jsonld";
      break;
    case "audio/midi audio/x-midi":
      ext = "midi";
      break;
    case "abc":
      ext = "mp3";
      break;
    case "audio/mpeg":
      ext = "abc";
      break;
    case "video/mpeg":
      ext = "mpeg";
      break;
    case "application/vnd.apple.installer+xml":
      ext = "mpkg";
      break;
    case "application/vnd.oasis.opendocument.presentation":
      ext = "odp";
      break;
    case "application/vnd.oasis.opendocument.spreadsheet":
      ext = "ods";
      break;
    case "application/vnd.oasis.opendocument.text":
      ext = "odt";
      break;
    case "audio/ogg":
      ext = "oga";
      break;
    case "video/ogg":
      ext = "ogv";
      break;
    case "application/ogg":
      ext = "ogx";
      break;
    case "font/otf":
      ext = "otf";
      break;
    case "image/png":
      ext = "png";
      break;
    case "application/pdf":
      ext = "pdf";
      break;
    case "application/vnd.ms-powerpoint":
      ext = "ppt";
      break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ext = "pptx";
      break;
    case "application/x-rar-compressed":
      ext = "rar";
      break;
    case "application/rtf":
      ext = "rtf";
      break;
    case "application/x-sh":
      ext = "sh";
      break;
    case "image/svg+xml":
      ext = "svg";
      break;
    case "application/x-shockwave-flash":
      ext = "swf";
      break;
    case "application/x-tar":
      ext = "tar";
      break;
    case "image/tiff":
      ext = "tif";
      break;
    case "font/ttf":
      ext = "ttf";
      break;
    case "text/plain":
      ext = "txt";
      break;
    case "application/vnd.visio":
      ext = "vsd";
      break;
    case "audio/wav":
      ext = "wav";
      break;
    case "audio/webm":
      ext = "weba";
      break;
    case "video/webm":
      ext = "webm";
      break;
    case "video/mp4":
      ext = "mp4";
      break;
    case "image/webp":
      ext = "webp";
      break;
    case "font/woff":
      ext = "woff";
      break;
    case "font/woff2":
      ext = "woff2";
      break;
    case "application/xhtml+xml":
      ext = "xhtml";
      break;
    case "application/vnd.ms-excel":
      ext = "xls";
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ext = "xlsx";
      break;
    case "text/xml":
      ext = "xml";
      break;
    case "application/vnd.mozilla.xul+xml":
      ext = "xul";
      break;
    case "application/zip":
      ext = "zip";
      break;
    case "video/3gpp":
    case "audio/3gpp":
      ext = "3gp";
      break;
    case "application/x-7z-compressed":
      ext = "7z";
      break;
    case "video/3gpp2":
      ext = "3g2";
      break;
    default:
      ext = mineType;
      break;
  }

  let date = new Date();
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();
  let filename = ApiHelper.getCurrentUnixTime() + '-' + parseInt(Math.random() * 1000000000);

  return year + '/' + monthIndex + '/' + day + '/' + filename + '.' + ext;
};

module.exports.getS3UploadUrl = async (userId, mimeType) => {

  let s3Bucket = new AWS.S3({ region: S3_REGION });
  let filePath = this.getRandomFilePath(mimeType);
  let params = { Bucket: S3_URL, Expires: 1000, Key: filePath, ContentType: mimeType };

  let uploadUrl = await s3Bucket.getSignedUrl('putObject', params);
  let fileUri = `https://${S3_URL}/${filePath}`;
  let dimensions = JSON.stringify({});
  let status = 'active';
  let newFileId = await this.createFile(userId, fileUri, mimeType, status, dimensions);
  let fileData = await this.getFileObject(newFileId, userId);
  fileData['uploadUrl'] = uploadUrl;

  return fileData;
};

module.exports.getBase64FromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    base64Img.requestBase64(url, function (err, res, body) {
      if (err)
        return reject(err);

      return resolve(body);
    });
  });
};

module.exports.uploadFileFromBase64 = async (userId, base64, status = 'new') => {

  let newFileId = 0, fileUri = '', etag = '', message = '';

  if (base64 === '') {
    newFileId = 0;
    etag = '';
    message = 'Not valid';
  } else {

    let fileType = base64.split(';base64,')[0];
    let mimeType = fileType.split(':')[1] || 'image/jpg';
    let onlyBase64 = base64.split(';base64,')[1];
    let filePath = this.getRandomFilePath(mimeType);

    let s3Bucket = new AWS.S3({ params: { Bucket: S3_URL } });

    let buf = new Buffer(onlyBase64, 'base64');
    let data = { Key: filePath, Body: buf, ContentEncoding: 'base64', ContentType: mimeType, ACL: 'public-read' };
    fileUri = `https://${S3_URL}/${filePath}`;

    let esResponse = await s3Bucket.putObject(data).promise()
      .then((res) => { return { etag: JSON.parse(res['ETag'] || ''), message: 'Success' } })
      .catch((err) => { return { etag: '', message: err.toString() } });

    etag = esResponse['etag'];
    message = esResponse['message'];
    if (esResponse['etag'] !== '') {
      let dimensions = sizeOf(buf);
      newFileId = await this.createFile(userId, fileUri, mimeType, status, dimensions);
    } else {
      newFileId = 0;
    }
  }

  return { id: newFileId, url: fileUri, etag: etag, message: message }
};

module.exports.uploadFile = async (userId, fileData, status = 'new') => {

  let newFileId = 0, fileUri = '', etag = '', message = '';

  if (ApiHelper.getObjectValue(fileData, 'filename', '') === '') {
    newFileId = 0;
    etag = '';
    message = 'Not valid';
  } else {

    let mimeType = ApiHelper.getObjectValue(fileData, 'contentType', 'image/jpg');
    let filePath = this.getRandomFilePath(mimeType);

    let s3Bucket = new AWS.S3({ params: { Bucket: S3_URL } });
    let data = { Key: filePath, Body: fileData['content'], ContentType: mimeType, ACL: 'public-read' };
    fileUri = `https://${S3_URL}/${filePath}`;

    let esResponse = await s3Bucket.putObject(data).promise()
      .then((res) => { return { etag: JSON.parse(res['ETag'] || ''), message: 'Success' } })
      .catch((err) => { return { etag: '', message: err.toString() } });

    etag = esResponse['etag'];
    message = esResponse['message'];
    if (esResponse['etag'] !== '') {
      newFileId = await this.createFile(userId, fileUri, mimeType, status);
    } else {
      newFileId = 0;
    }
  }

  return { id: newFileId, url: fileUri, etag: etag, message: message };
};

module.exports.getFileUrl = async (fileId) => {
  let fileRow = await DbHelper.query('SELECT uri FROM files WHERE id = :fileId', { fileId }, 1);
  return ApiHelper.getObjectValue(fileRow, 'uri', null);
};

module.exports.createFile = async (userId, filePath, mimeType, status = 'new', dimensions = {}) => {

  let currentTime = ApiHelper.getCurrentUnixTime();

  return await DbHelper.dbInsert('files',
    {
      user_id: userId,
      uri: filePath,
      mime_type: mimeType,
      created_at: currentTime,
      status: status,
      data: JSON.stringify(dimensions)
    }
  );
};

module.exports.getFileObject = async (fileId) => {

  let mediaObject = new MediaObject();

  let fileRow = await DbHelper.query('SELECT * FROM files WHERE id = :fileId', { fileId }, 1);
  if (fileRow) {
    mediaObject.id = fileRow['id'];
    mediaObject.url = fileRow['uri'];
    mediaObject.description = '';
    mediaObject.type = fileRow['mime_type'];
    mediaObject.data = fileRow['data'];
    mediaObject.image_tag = fileRow['image_tag'] ? fileRow['image_tag'] : '';
  }

  return mediaObject;
};

async function downloadImage(url) {

  const name = uuid4()
  const path = Path.resolve(__dirname, 'tmp', `${name}.png`)

  const response = await axios({
    method: 'GET',
    url: 'https://dlskits.com/wp-content/uploads/2018/05/Dream-League-Soccer-Barcelona-Logo.png',
    responseType: 'stream'
  })

  response.data.pipe(Fs.createWriteStream(path))

  return new Promise((resolve, reject) => {
    response.data.on('end', () => { resolve(path) })
    response.data.on('error', () => { reject() })
  })
}

module.exports.getTagsFromImage = async (fileUrl) => {

  const fpath = await downloadImage(fileUrl)
  const client = new vision.ImageAnnotatorClient({ keyFile: './kuky-vision.json' });

  const [resultObj] = await client.objectLocalization(fpath);

  Fs.unlinkSync(fpath)

  return resultObj
};

module.exports.syncLabelsFromES = async (data) => {

  data.forEach(async item => {
    let filterUri = 'https://media.kuky.com/' + item._source.name;
    await DbHelper.dbUpdate('files', { uri: filterUri }, { image_tag: item._source.labels });
  });

  return
}
