'use strict';
const now = require('../../helper/common')
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('user_has_roles', [{
            id: 1,
            created_at:now.getNow(),
            updated_at:now.getNow(),
            role_id:1,
            user_id:1
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};
