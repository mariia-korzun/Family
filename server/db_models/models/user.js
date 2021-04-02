'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    dataOfBirth: { allowNull: false, type: DataTypes.DATEONLY }
  }, {
    scopes: {
      withoutEmailPasswordCreatedUpdated: {
        attributes:
          { exclude: ['password', 'email', 'createdAt', 'updatedAt'] }
      }
    },
    tableName: 'User'
  });
  User.associate = function (models) {
    // associations can be defined here
    // User.hasMany(models.Follow, { as: 'follow', foreignKey: 'follower' })
    // User.hasMany(models.Follow, { as: 'follower', foreignKey: 'follow' })
    User.hasMany(models.Post, { foreignKey: 'owner' })
    User.hasMany(models.Post, { foreignKey: 'recipient' })
    User.hasMany(models.Asset, { as: 'Assets', foreignKey: 'owner' })
    User.hasMany(models.Album, { as: 'Albums', foreignKey: 'owner' })
    User.belongsToMany(User, { as: 'Follows', through: models.Follow, foreignKey: 'follower', otherKey: 'follow' })
    User.belongsToMany(User, { as: 'Followers', through: models.Follow, foreignKey: 'follow', otherKey: 'follower' })
  };
  return User;
};