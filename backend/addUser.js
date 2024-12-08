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
      topArtists: [{ name: 'Artist 1' }, { name: 'Artist 2' }, { name: 'Artist 3' }],
      topTracks: [{ title: 'Track 1' }, { title: 'Track 2' }, { title: 'Track 3' }],
      topPlaylists: [{ name: 'Playlist 1' }],
      college: 'ABC University',
      compatibilityScore: 85.5,
      personalityPrompts: ['Outgoing', 'Adventurous'],
      rejectPile: [{ name: 'User 2' }],
    });
    console.log('First user added successfully:', firstUser.toJSON());

    // Add the second user
    const secondUser = await User.create({
      spotifyId: 'spotify67890',
      displayName: 'John Smith',
      email: 'johnsmith@example.com',
      accessToken: 'access_token_example_2',
      topArtists: [{ name: 'Artist 3' }, { name: 'Artist 4' }, { name: 'Artist 5' }],
      topTracks: [{ title: 'Track 3' }, { title: 'Track 4' }, { title: 'Track 5' }],
      topPlaylists: [{ name: 'Playlist 2' }],
      college: 'XYZ College',
      compatibilityScore: 90.0,
      personalityPrompts: ['Analytical', 'Thoughtful'],
      rejectPile: [{ name: 'User 1' }],
    });
    console.log('Second user added successfully:', secondUser.toJSON());
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
})();