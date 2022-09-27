const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'btwryzu8muisxddf7q9q5t1zhpyte1l8';
const iv = 'ix8he6y08bs01h3b';

exports.encrypt = async (text) => {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

exports.decrypt = (text) => {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}