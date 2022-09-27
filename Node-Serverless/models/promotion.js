const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promotion', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    promotion_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    promotion_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    promotion_expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promotion_reward_usd_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    promotion_code_expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promotion_sub_data: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    promotion_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'promotion',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
