'use strict';

const dbConfig = {
    "username": 'root',
    "password": '',
    "database": 'iconvert',
    "port":3306,
    "host": 'localhost',
    "dialect": 'mysql'
};

const config = {
"development": dbConfig,
"test": dbConfig,
"production": dbConfig
};

module.exports = config;
