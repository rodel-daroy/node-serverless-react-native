const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');


/**
 * @swagger
 * tags:
 *   name: Auth
 * /admin/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Admin login
 *     description: This call is to be used for admin login.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *                example: ben@eronka.com
 *              password:
 *                type: string
 *                required: true
 *                example: ben@eronka.com
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: return firebase user data. data.logged.idToken is to be used as an access-token
 *
 */
module.exports.post = async (request) => {

  let statusCode = 0, message = '', data = {};
  let hasError = false;

  let requestBody = ApiHelper.getRequestRawData(request);
  let email = ApiHelper.getObjectValue(requestBody, 'email', '');
  let password = ApiHelper.getObjectValue(requestBody, 'password', '');
  email = email.toLowerCase();

  if (email === '') {
    hasError = true;
    message = 'Email is required!';
  } else if (!ApiHelper.isEmail(email)) {
    hasError = true;
    message = 'Email is not valid!';
  }
  if (password === '') {
    hasError = true;
    message = 'Password is required!';
  }

  if (!hasError) {
    let userId = await AdminHelper.getAdminUserIdByEmail(email);
    if (userId > 0) {
      let apiUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.FIREBASE_API_KEY;
      let res = await ApiHelper.apiPost(apiUrl, { email, password, returnSecureToken: true });
      statusCode = ApiHelper.getObjectValue(res, 'status', 400);
      message = ApiHelper.getObjectValue(res, 'message', '...');
      let resData = ApiHelper.getObjectValue(res, 'data', {});

      if (statusCode === 200) {
        await DbHelper.dbInsert('admin_user_tokens',
          {
            admin_user_id: userId,
            access_token: ApiHelper.getObjectValue(resData, 'idToken', null),
            refresh_token: ApiHelper.getObjectValue(resData, 'refreshToken', null),
            created_at: ApiHelper.getCurrentUnixTime(),
            updated_at: ApiHelper.getCurrentUnixTime(),
            status: 'active'
          }
        );
        let adminUserRow = await DbHelper.query('SELECT * FROM admin_users WHERE email = :email', { email: resData['email'] }, 1);
        if (adminUserRow) {
          resData['id'] = adminUserRow['id'];
          resData['displayName'] = adminUserRow['display_name'];
          resData['avatar'] = adminUserRow['avatar'];
        }
        data['logged'] = resData;
      } else {
        data['debug'] = ApiHelper.getObjectValue(res, 'data', {});
      }
    } else {
      statusCode = 404;
      message = 'User is not found!';
    }
  } else {
    statusCode = 400;
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};
