const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_profiles', {
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
    full_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    avatar_fid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    background_fid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    introduction: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    marital_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    preferred_currency: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    account_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    personality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    over18: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    subscribe_adult_content: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    score: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    es_synz: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    last_updated_at: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_profiles',
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
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
