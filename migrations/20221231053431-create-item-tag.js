'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('ItemTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ItemId: {
        type: Sequelize.INTEGER,
        references: { model: { tableName: "Items" }, key: "id" },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      TagId: {
        type: Sequelize.INTEGER,
        references: { model: { tableName: "Tags" }, key: "id" },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('ItemTags');
  }
};