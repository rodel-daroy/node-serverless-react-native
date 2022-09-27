const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const UserHelper = require('../../helpers/user-helper');


/**
 * @swagger
 * tags:
 *   name: Bank account
 * /bank-account:
 *   put:
 *     tags:
 *       - Bank account
 *     summary: Update the bank account for cash out
 *     description: Update the bank account for cash out
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                required: true
 *                description: the id of the user bank account table
 *              country:
 *                type: string
 *                required: true
 *                description: the country in which the bank account is located
 *              currency:
 *                type: string
 *                required: true
 *                description: the currency the bank account is in. This must be a country/currency pairing
 *              accountHolderName:
 *                type: string
 *                required: true
 *                description: the name of the person or business that owns the bank account
 *              accountHolderType:
 *                type: string
 *                required: true
 *                description: the type of entity that holds the account. This can be either "individual" or "company"
 *              routingNumber:
 *                type: string
 *                required: true
 *                description: the routing number, sort code, or other country-appropriate institution number for the bank account
 *              accountNumber:
 *                type: string
 *                required: true
 *                description: the account number for the bank account, in string form. Must be a checking account
 *            example:
 *              id: 1
 *              country: US
 *              currency: aud
 *              accountHolderName: Jenny Rosen
 *              accountHolderType: individual
 *              routingNumber: 110000000
 *              accountNumber: 000123456789
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return the status message of the success or fail
 */
module.exports.put = async (request) => {

  let statusCode = 0;
  let message = '';
  let data = {};
  let hasError = false;
  let errors = {};

  let requestBody = ApiHelper.getRequestRawData(request);
  let id = ApiHelper.getObjectValue(requestBody, 'id', 0);
  let country = ApiHelper.getObjectValue(requestBody, 'country', '');
  let currency = ApiHelper.getObjectValue(requestBody, 'currency', '');
  let accountHolderName = ApiHelper.getObjectValue(requestBody, 'accountHolderName', '');
  let accountHolderType = ApiHelper.getObjectValue(requestBody, 'accountHolderType', '');
  let routingNumber = ApiHelper.getObjectValue(requestBody, 'routingNumber', '');
  let accountNumber = ApiHelper.getObjectValue(requestBody, 'accountNumber', '');

  if (id === 0) {
    hasError = true;
    errors['id'] = 'id is missed';
  }
  if (country === '') {
    hasError = true;
    errors['country'] = 'country is missed';
  }
  if (currency === '') {
    hasError = true;
    errors['currency'] = 'currency is missed';
  }
  if (accountHolderName === '') {
    hasError = true;
    errors['accountHolderName'] = 'accountHolderName is missed';
  }
  if (accountHolderType === '') {
    hasError = true;
    errors['accountHolderType'] = 'accountHolderType is missed';
  }
  if (routingNumber === '') {
    hasError = true;
    errors['routingNumber'] = 'routingNumber is missed';
  }
  if (accountNumber === '') {
    hasError = true;
    errors['accountNumber'] = 'accountNumber is missed';
  }

  let userId = await UserHelper.checkUserAccessToken(request);
  if (userId > 0) {

    if (hasError) {
      statusCode = 400;
      message = 'Params are invalid';
    } else {
      await DbHelper.dbUpdate('user_bank_account', { id }, {
        country: country,
        currency: currency,
        account_holder_name: accountHolderName,
        account_holder_type: accountHolderType,
        routing_number: routingNumber,
        account_number: accountNumber
      });
      statusCode = 200;
      message = 'Success';
    }
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data, errors);
};
