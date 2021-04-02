'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {}, {
    tableName: 'Follow'
  });
  Follow.associate = function (models) {
    // associations can be defined here
    //  Follow.belongsTo(models.User, {as: 'Follow', foreignKey: 'follow'})
    //  Follow.belongsTo(models.User, {as : 'Follower', foreignKey: 'follower'})
    // User.hasMany(models.Follow, { as: 'Follow', foreignKey: 'follower' })
    // User.hasMany(models.Follow, { as: 'Follower', foreignKey: 'follow' })


  };
  return Follow;
};