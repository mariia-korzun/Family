'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PostAsset', 'id')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PostAsset', 'id',
      {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    )
  }
};
