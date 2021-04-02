'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Album', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true

      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      },
      owner: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
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
    return queryInterface.removeColumn('Album', 'owner').then(() => {
      return queryInterface.dropTable('Album', { force: true })
    })
  }
};
