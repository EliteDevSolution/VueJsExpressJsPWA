'use strict';
const now = require('../../helper/common')

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', [{
            id: 1,
            name: 'SuperAdmin',
            comment: 'This users is super Admin.',
            created_at:now.getNow(),
            updated_at:now.getNow(),
        },{
            id: 2,
            name: 'Individual',
            comment: 'This users is individual member.',
            created_at:now.getNow(),
            updated_at:now.getNow(),
        },{
            id: 3,
            name: 'Company',
            comment: 'This user is a Company.',
            created_at:now.getNow(),
            updated_at:now.getNow(),
        },{
            id: 4,
            name: 'Company User',
            comment: 'This users is a Company User.',
            created_at:now.getNow(),
            updated_at:now.getNow(),
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
