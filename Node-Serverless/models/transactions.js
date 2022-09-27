const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    txid: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transaction_data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sender_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    receiver_id: {
      type: DataTypes.STRING(200),
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
    currency_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currency_rate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currency_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    wallet_from: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    wallet_to: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transactions',
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
      {
        name: "txid",
        using: "BTREE",
        fields: [
          { name: "txid" },
        ]
      },
    ]
  });
};
