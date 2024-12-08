// routes.js
const express = require('express');
const { 
  spotifyOAuthCallback, 
  fetchColleges, 
  updateCollege, 
  createUser, 
  fetchUsers, 
  updateUser 
} = require('../controllers/userController');  // Correct path to userController
const router = express.Router();

// Log the imported functions (for debugging)
console.log({
  spotifyOAuthCallback,
  fetchColleges,
  updateCollege,
  createUser,
  fetchUsers,
  updateUser,
});

// Spotify OAuth Callback Route
router.get('/auth/spotify/callback', spotifyOAuthCallback);
const { colleges } = require('../colleges')

// User-related Routes
router.post('/user', createUser);  // Create a new user
router.get('/users', fetchUsers);  // Get all users
router.put('/user', updateUser);   // Update user information

// Spotify Login Route (Redirect to Spotify OAuth)
router.get('/login/spotify', (req, res) => {
  //const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;
  //res.redirect(SPOTIFY_AUTH_URL); // Redirect to Spotify login page
  const redirectUrl = `http://localhost:3000/index.html?access_token=${userData.accessToken}&user_id=${userData.spotifyId}&display_name=${encodeURIComponent(userData.displayName)}`;
  res.redirect(redirectUrl);
});

const path = require('path');

// Serve colleges.json from the backend folder
router.get('/colleges', (req, res) => {
  res.send(colleges)
});

module.exports = router;


