const sequelize = require('./config/database');
const UserModel = require('./models/user');

// Initialize the User model
const User = UserModel(sequelize, require('sequelize').DataTypes);

(async () => {
  try {
    // Force-sync the database to drop and recreate the table
    await sequelize.sync({ force: true }); // Drops the table and recreates it with the current schema
    console.log('Database synced.');

    // Add the first user
    const firstUser = await User.create({
      spotifyId: 'spotify12345',
      displayName: 'Jane Doe',
      email: 'janedoe@example.com',
      accessToken: 'access_token_example_1',
      college: 'ABC University',
    });
    console.log('First user added successfully:', firstUser.toJSON());

    // Add the second user
    const secondUser = await User.create({
      spotifyId: 'spotify67890',
      displayName: 'BONG Smith',
      email: 'johnsmith@example.com',
      accessToken: 'access_token_example_2',
      college: 'XYZ College',
    });
    console.log('Second user added successfully:', secondUser.toJSON());


  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
})();
