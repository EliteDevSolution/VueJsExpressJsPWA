import Sequelize from 'sequelize';
import path from 'path';
import _ from 'lodash';
import dbConfig from '../../config/database';
const read = require('fs-readdir-recursive');
const basename  = path.basename(module.filename);
const db        = {};

const sequelize = new Sequelize({
    host: dbConfig.development.host,
    port: dbConfig.development.port,
    username: dbConfig.development.username,
    password: dbConfig.development.password,
    database: dbConfig.development.database,
    dialect: dbConfig.development.dialect,

    define: {
        underscored: true,
        timestamps: false,
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('DB connected.');
    })
    .catch(err => {
        console.error('DB connection faild.', err);
    });

const models = {};

const modelsDir = path.normalize(`${__dirname}`);

read(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

/// Sequelize synchronize ///////////////
sequelize.sync().then(() => {
    console.info('Database synchronized');
}).catch((err) => {
    console.error('An error occured %j', err);
});
///////

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
