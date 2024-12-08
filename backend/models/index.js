const sequelize = require('../config/database'); // Your Sequelize instance
const UserModel = require('./user'); // Import user.js

// Initialize the User model
const User = UserModel(sequelize, require('sequelize').DataTypes);

// Export models and Sequelize instance
module.exports = {
  sequelize,
  User,
};

// Load models
const Chat = require('./chat/Chat');
module.exports = { Chat };

// Load Match model
const Match = require('./Match');
module.exports = { Match };
