//Set up the database connection using Sequelize and SQLite.

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

module.exports = sequelize;
