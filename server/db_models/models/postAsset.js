'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostAsset = sequelize.define('PostAsset', {
   // asset: DataTypes.INTEGER
  }, {
    tableName: 'PostAsset'
  });
  PostAsset.associate = function(models) {
    // associations can be defined here
  };
  return PostAsset;
};