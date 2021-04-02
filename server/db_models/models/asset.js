'use strict';
module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: {
      type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4
    },
    owner: { type: DataTypes.INTEGER, allowNull: false },
    mimeType: {type: DataTypes.STRING, allowNull: false },
    extension: {type: DataTypes.STRING, allowNull: false }

  }, {
    tableName: 'Asset'
  });
  Asset.associate = function (models) {
    // associations can be defined here
    Asset.belongsTo(models.User, { as: 'Owner', foreignKey: 'owner' })
    Asset.belongsToMany(models.Post, { through: models.PostAsset, foreignKey: 'asset', as: "Posts" })
    Asset.belongsToMany(models.Album, { through: models.AlbumAsset, foreignKey: 'asset', as: "Albums" })
  };
  return Asset;
};