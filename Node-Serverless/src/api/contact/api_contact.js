const ApiHelper = require('../../helpers/api-helper');
const ContactObject = require('../../models/ContactObject');

module.exports.post = async (request) => {
  let statusCode = 0;
  let message = '';
  let data = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let description = ApiHelper.getObjectValue(requestBody, 'description', '');
  let topic = ApiHelper.getObjectValue(requestBody, 'topic', '');
  let email = ApiHelper.getObjectValue(requestBody, 'email', '');
  let phone = ApiHelper.getObjectValue(requestBody, 'phone', '');
  let contact = new ContactObject();
  contact.id = ApiHelper.getRandomInt(100);
  contact.description = description;
  contact.topic = topic;
  contact.email = email;
  contact.phone = phone;
  data = contact;

  let edmData = await ApiHelper.getEdmData(
    'CONTACT_US',
    {},
    {
      DESCRIPTION: description,
      TOPIC: topic,
      EMAIL: email,
      PHONE_NUMBER: phone,
    },
    'App Contact information',
    `
      <h4>Contact information:</h4>
      <p><u>Email</u>: [EMAIL]</p>
      <p><u>Phone</u>: [PHONE_NUMBER]</p>
      <p><u>Topic</u>: [TOPIC]</p>
      <p><u>Content</u>: [DESCRIPTION]</p>
    `
  );
  let subject = edmData['subject'];
  let body = edmData['body'];
  await ApiHelper.sendMail('info@eronka.com', subject, body);

  statusCode = 200;
  message = 'Success';

  return ApiHelper.apiResponse(statusCode, message, data);
};
