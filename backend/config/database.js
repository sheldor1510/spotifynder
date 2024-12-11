// Import the Sequelize module for working with databases
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance, specifying the SQLite dialect and database file location
const sequelize = new Sequelize({
  dialect: 'sqlite', // Defines the database type as SQLite
  storage: './database.sqlite', // Specifies the file path to store the SQLite database
});

// Export the Sequelize instance to use in other parts of the application
module.exports = sequelize;
