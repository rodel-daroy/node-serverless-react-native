const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contract', {
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
    date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payment_method_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    base_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    percentage_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fee_percentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fee_total: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    requested_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    final_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    final_amount_ltc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    reward_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    conversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    transaction_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract',
    timestamps: false,
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
