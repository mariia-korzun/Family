'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Asset', 'mimeType', {
      type: Sequelize.STRING,
      allowNull: false
    }).then(queryInterface.addColumn('Asset', 'extension', {
      type: Sequelize.STRING,
      allowNull: false
    }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Asset', 'mimeType', Sequelize.STRING)

  }
}
