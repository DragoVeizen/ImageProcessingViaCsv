'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Requests', {
          id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false
          },
          status: {
              type: Sequelize.STRING,
              allowNull: false
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false
          }
      });
  },
  down: async (queryInterface) => {
      await queryInterface.dropTable('Requests');
  }
};

