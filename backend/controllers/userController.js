const { User } = require('../models');
const { getAccessToken, getUserProfile, findOrCreateUser } = require('../services/spotifyServices');
const { Op } = require('sequelize');

exports.spotifyOAuthCallback = async (req, res) => {
  const { code } = req.query;  // Get the authorization code from the query params

  if (!code) {
    return res.status(400).send('Spotify authorization code missing.');
  }

  try {
    // Step 1: Get the access token using the authorization code
    const { access_token } = await getAccessToken(code);
    
    // Step 2: Fetch user profile from Spotify
    const userProfile = await getUserProfile(access_token);

    // Step 3: Find or create the user in your database
    const user = await findOrCreateUser({
      spotifyId: userProfile.id,
      displayName: userProfile.display_name,
      email: userProfile.email,
      accessToken: access_token,
    });

    // Respond with user data or redirect to the main app
    res.json({ message: 'User logged in successfully', user });
  } catch (error) {
    console.error('Error during Spotify OAuth callback:', error);
    res.status(500).send('Error handling the callback.');
  }
};

exports.fetchColleges = (req, res) => {
  res.send('Fetch Colleges Handler');
};

exports.updateCollege = (req, res) => {
  res.send('Update College Handler');
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Username, email, and password are required.');
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User created successfully.', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Failed to create user.');
  }
};

// Fetch all users
exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id, username, email } = req.body;
    if (!id) {
      return res.status(400).send('User ID is required.');
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.fetchFilteredUsers = async (req, res) => {
  try {
    // Extract filter parameters from the request query
    const { artists, tracks, playlists, minCompatibilityScore } = req.query;

    // Initialize query conditions
    const conditions = {};

    // Add conditions for filtering
    if (artists) {
      conditions.topArtists = {
        [Op.contains]: [{ name: artists }], // Check if the artists array contains the given name
      };
    }

    if (tracks) {
      conditions.topTracks = {
        [Op.contains]: [{ title: tracks }], // Check if the tracks array contains the given title
      };
    }

    if (playlists) {
      conditions.topPlaylists = {
        [Op.contains]: [{ name: playlists }], // Check if the playlists array contains the given name
      };
    }

    if (minCompatibilityScore) {
      conditions.compatibilityScore = {
        [Op.gte]: parseFloat(minCompatibilityScore), // Match users with compatibilityScore >= minCompatibilityScore
      };
    }

    // Fetch users matching the conditions
    const users = await User.findAll({ where: conditions });

    // Respond with the filtered users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching filtered users:', error);
    res.status(500).json({ error: 'Failed to fetch filtered users.' });
  }
};