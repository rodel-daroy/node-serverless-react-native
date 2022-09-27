const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin_user_tokens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    admin_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_users',
        key: 'id'
      }
    },
    access_token: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING(1500),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'admin_user_tokens',
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
        name: "admin_user_id",
        using: "BTREE",
        fields: [
          { name: "admin_user_id" },
        ]
      },
    ]
  });
};
