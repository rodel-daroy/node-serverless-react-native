'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'First d  Trinh BE ------Go Serverless v1.0! Your function executed successfully!---gooooooo',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY
  // integration return { message: 'Go Serverless v1.0! Your function executed
  // successfully!', event };
};

module.exports.hello2 = async (event) => {
  return {
    statusCode: 200,
    body: 'hello Trinh is here',
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY
  // integration return { message: 'Go Serverless v1.0! Your function executed
  // successfully!', event };
};
