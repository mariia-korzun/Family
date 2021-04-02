'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false
    },
    text: DataTypes.STRING
  },
    { tableName: 'Post' });
  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: 'owner', as: "Owner" });
    Post.belongsToMany(models.Asset, { through: models.PostAsset, foreignKey: 'post', as: "Assets" })
    Post.belongsTo(models.User, { foreignKey: 'recipient', as: "Recipient" });
  };
  return Post;
};
