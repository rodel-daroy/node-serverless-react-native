const AdminHelper = require('../../helpers/admin-helper');
const ApiHelper = require('../../helpers/api-helper');
const DbHelper = require('../../helpers/db-helper');
const ErrorHelper = require('../../helpers/error-helper');
const models = require('../../../models');
const sequelize = require('sequelize');

/**
 * @openapi
 * tags:
 *   name: Dashboard
 * /admin/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     security:
 *       - accessToken: []
 *     summary: Dashboard data
 *     description: Get the dashboard data
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *        description: return array of dashboard data
 *
 */

module.exports.get = async (request) => {
  let statusCode = 0,
    message = '',
    data = {};

  let userId = await AdminHelper.checkAdminUserAccessToken(request);
  userId = 2;
  if (userId > 0) {
    statusCode = 200;
    message = 'Success';
    data['list'] = await dashboardData();
  } else {
    [statusCode, message] = await ErrorHelper.permissionError();
  }

  return ApiHelper.apiResponse(statusCode, message, data);
};

const dashboardData = async () => {
  let parameters = {
    users: {
      dashboardTitle: 'Users',
      total: await models.user_profiles.count(),
    },
    verifiedUsers: {
      dashboardTitle: 'Verified users',
      total: await models.user_passbase_verification.count({ where: { status: 1 } }),
    },
    posts: {
      dashboardTitle: 'Posts',
      total: await models.posts.count(),
    },
    comments: {
      dashboardTitle: 'Comments',
      total: await models.comments.count(),
    },
    votes: {
      dashboardTitle: 'Voteup and down',
      total: await models.posts.findAll({
        attributes: ['total_votes', [sequelize.fn('sum', sequelize.col('total_votes')), 'total']],
        group: ['posts.total_votes'],
        raw: true,
        order: sequelize.literal('total DESC'),
      }),
    },
    reports: {
      dashboardTitle: 'Reports',
      total: await models.posts.findAll({
        attributes: ['total_reports', [sequelize.fn('sum', sequelize.col('total_reports')), 'total']],
        group: ['posts.total_reports'],
        raw: true,
        order: sequelize.literal('total DESC'),
      }),
    },
    transactionNumbers: {
      dashboardTitle: 'Transaction',
      total: await models.transaction_history.count(),
    },
    topUpNumbers: {
      dashboardTitle: 'Top up',
      total: await models.contract.count({ where: { type: 'topup' } }),
    },
    cashOutNumbers: {
      dashboardTitle: 'Cash out',
      total: await models.contract.count({ where: { type: 'cashout' } }),
    },
    collectedFees: {
      dashboardTitle: 'Amount of fees collected',
      total: await totalFee(),
    },
    totalTransactionAmount: {
      dashboardTitle: 'Amount of total transaction',
      total: await models.contract.count(),
    },
  };

  return parameters;
};

const totalFee = async () => {
  let feeList = await models.contract.findAll({
    attributes: ['id', 'fee_total', 'currency'],
    where: {
      fee_total: {
        [sequelize.Op.gt]: 0,
      },
    },
  });
  let feeTotalObj = {};
  feeList.map((el) => {
    if (feeTotalObj[el.currency]) {
      feeTotalObj[el.currency] += el.fee_total;
    } else {
      feeTotalObj[el.currency] = el.fee_total;
    }
  });
  for (let el in feeTotalObj) {
    feeTotalObj[el] = +feeTotalObj[el].toFixed(2);
  }

  return feeTotalObj;
};
