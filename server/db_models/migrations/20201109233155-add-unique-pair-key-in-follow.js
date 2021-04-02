'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Follow', ['follow', 'follower'], {
      type: 'primary key',
      name: 'custom_unique_constraint_follow'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Follow', 'custom_unique_constraint_follow', {
      type: 'primary key'
    })
  }
};
