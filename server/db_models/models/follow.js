'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'Follow'
  });
  Follow.associate = function (models) {
    // associations can be defined here
    //  Follow.belongsTo(models.User, {as: 'follow', foreignKey: 'follow'})
    //  Follow.belongsTo(models.User, {as : 'follower', foreignKey: 'follower'})
    // User.hasMany(models.Follow, { as: 'follow', foreignKey: 'follower' })
    // User.hasMany(models.Follow, { as: 'follower', foreignKey: 'follow' })


  };
  return Follow;
};