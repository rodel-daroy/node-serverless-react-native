'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promotion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      promotion_code: {
        type: Sequelize.STRING,
      },
      promotion_type: {
        type: Sequelize.STRING,
      },
      promotion_expiry_date: {
        type: Sequelize.DATE,
      },
      promotion_reward_usd_amount: {
        type: Sequelize.INTEGER,
      },
      promotion_code_expiry_date: {
        type: Sequelize.DATE,
      },
      promotion_sub_data: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      promotion_status: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('promotion');
  },
};
