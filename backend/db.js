const { Sequelize } = require('sequelize');
const config = require('./config/config')[process.env.NODE_ENV] || 'development'

const sequelize = new Sequelize(config.database, config.username, config.password,{
    host :config.host,
    dialect:config.dialect,
    ...(config.storage && { storage: config.storage }), 
    logging: false
})

module.exports = sequelize