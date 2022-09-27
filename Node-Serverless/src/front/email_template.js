const ViewHelper = require('../helpers/view-helper');


module.exports.get = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: ViewHelper.loginCodeView({ loginCode: 'code' }),
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  };
};