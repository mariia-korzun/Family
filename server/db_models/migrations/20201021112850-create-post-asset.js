'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PostAsset', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      asset: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Asset',
          key: 'id'
        }
      },
      post: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Post',
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
    return queryInterface.removeColumn('PostAsset', 'asset').then(() => {
      return queryInterface.removeColumn('PostAsset', 'post')
    }).then(() => { return queryInterface.dropTable('PostAsset', { force: true }); })
  }
};