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


const { fetchProfile } = require('../controllers/profileController'); // Correct path to profileController

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

// Colleges Routes
router.get('/colleges', fetchColleges); // Fetch list of colleges
router.post('/college', updateCollege); // Update college information

// User-related Routes
router.post('/user', createUser);  // Create a new user
router.get('/users', fetchUsers);  // Get all users
router.put('/user', updateUser);   // Update user information

// Spotify Login Route (Redirect to Spotify OAuth)
router.get('/login/spotify', (req, res) => {
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;
  res.redirect(SPOTIFY_AUTH_URL); // Redirect to Spotify login page
});

router.get('/profile', fetchProfile); // Fetch profile of user
module.exports = router;


