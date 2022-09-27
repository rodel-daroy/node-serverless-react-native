exports.permissionError = async () => {
  statusCode = 403;
  message = 'Please login';
  return [statusCode, message];
};

exports.mandatoryInputError = async () => {
  statusCode = 403;
  message = 'Please input all the required data';
  return [statusCode, message];
};

exports.dbError = async () => {
  statusCode = 403;
  message = 'DB error please contact admin';
  return [statusCode, message];
};
