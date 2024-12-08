const sequelize = require('../config/database'); // Your Sequelize instance
const UserModel = require('./user'); // Import user.js
const ChatModel = require('./Chat'); // Import Chat.js
const MatchModel = require('./Match'); // Import Match.js

// Initialize the User model
const User = UserModel(sequelize, require('sequelize').DataTypes);

// Initialize the Chat model
const Chat = ChatModel(sequelize, require('sequelize').DataTypes);

// Initialize the Match model
const Match = MatchModel(sequelize, require('sequelize').DataTypes);

// Export models and Sequelize instance
module.exports = {
  sequelize,
  User,
  Chat,
  Match
};