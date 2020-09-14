'use strict';
module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: {type: DataTypes.UUID, allowNull: false, primaryKey: true},
    owner: {type: DataTypes.INTEGER, allowNull: false}
  }, {});
  Asset.associate = function(models) {
    // associations can be defined here
   Asset.belongsTo(models.User, {as : 'Owner', foreignKey: 'owner'})

  };
  return Asset;
};