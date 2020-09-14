'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Follow', ['follow'], {}).then(() => 
    { queryInterface.addIndex('Follow', ['follower'], {}) }).then(() => 
    { queryInterface.addIndex('Follow', ['follower', 'follow'], {}) })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
