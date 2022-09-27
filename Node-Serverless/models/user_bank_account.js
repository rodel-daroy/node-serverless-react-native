const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_bank_account', {
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
    country: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    account_holder_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    account_holder_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    routing_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_bank_account',
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
