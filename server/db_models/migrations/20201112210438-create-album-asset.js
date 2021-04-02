'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AlbumAsset', {
      album: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Album',
          key: 'id'
        }
      },
      asset: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Asset',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('AlbumAsset', 'album').then(() => {
      return queryInterface.removeColumn('AlbumAsset', 'asset')
    }).then(() => {
      return queryInterface.dropTable('AlbumAsset');
    })
  }
};