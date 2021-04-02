'use strict';
module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('Album', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    },
        { tableName: 'Album' });
    Album.associate = function (models) {
        Album.belongsTo(models.User, { foreignKey: 'owner', as: "Owner" });
        Album.belongsToMany(models.Asset, { through: models.AlbumAsset, foreignKey: 'album', as: "Assets" })
    };
    return Album;
};
