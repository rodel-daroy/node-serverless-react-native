const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_actions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    object_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_actions',
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
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "object_type",
        using: "BTREE",
        fields: [
          { name: "object_type" },
        ]
      },
      {
        name: "object_id",
        using: "BTREE",
        fields: [
          { name: "object_id" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
