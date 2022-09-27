const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
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
      allowNull: true,
      defaultValue: "POST"
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_format: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    incognito: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    open: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    private: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'comments',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "post_id",
        using: "BTREE",
        fields: [
          { name: "object_id" },
        ]
      },
      {
        name: "parent_id",
        using: "BTREE",
        fields: [
          { name: "parent_id" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
