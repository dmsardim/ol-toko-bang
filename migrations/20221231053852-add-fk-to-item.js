'use strict';

const { DataTypes } = require('sequelize');
//ini require karena pake ini : return queryInterface.addColumn('Items', 'UserId', { type: DataTypes.INTEGER, references: {model: {tableName: "Users"}, key: "id"} })
// kalo gapake require maka cuman type: Sequelize.INTEGER

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('Items', 'UserId', { type: DataTypes.INTEGER, references: {model: {tableName: "Users"}, key: "id"} })
  },

  down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('Items', 'UserId')
  }
};
