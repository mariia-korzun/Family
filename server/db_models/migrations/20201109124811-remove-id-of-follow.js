'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Follow', 'id')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Follow', 'id',
      {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    )
  }
};
