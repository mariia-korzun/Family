'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlbumAsset = sequelize.define('AlbumAsset', {}, {
      tableName: 'AlbumAsset'
  });
  AlbumAsset.associate = function(models) {
    // associations can be defined here
  };
  return AlbumAsset;
};