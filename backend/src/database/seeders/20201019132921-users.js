'use strict';

const bcrypt = require('bcryptjs');
const now = require('../../helper/common')
const env = require('../../env')

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            firstname: 'admin',
            lastname: 'Super',
            email: env.ADMIN_EMAIL || 'admin@admin.com',
            password: bcrypt.hashSync(env.ADMIN_PASSWORD, 8) || bcrypt.hashSync('password', 8),
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
