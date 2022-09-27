const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_votes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reports: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reports_sexual: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reports_offensive: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reports_fake: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reports_delete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_rewards: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_shared: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content_format: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    payment: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    payment_ltc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    payment_rate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    incognito: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    nsfw: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    over18: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    es_synz: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    hashTags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internalTags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cron: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'posts',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
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
