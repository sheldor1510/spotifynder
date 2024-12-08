const express = require('express');
const {
  spotifyOAuthCallback,
  fetchColleges,
  updateCollege,
  createUser,
  fetchUsers,
  updateUser,
  fetchFilteredUsers,
} = require('../controllers/userController');

const { fetchProfile } = require('../controllers/profileController');
const {
  fetchTopArtists,
  fetchTopTracks,
  selectTopArtists,
  selectTopTracks,
} = require('../controllers/ArtistandTracksController');

const {
  getUserChats,
  sendMessage,
  getChatHistory, // Import chatController functions
} = require('../controllers/chatController');

const router = express.Router();

// Log the imported functions (for debugging)
console.log({
  spotifyOAuthCallback,
  fetchColleges,
  updateCollege,
  createUser,
  fetchUsers,
  updateUser,
  fetchFilteredUsers,
  fetchProfile,
  fetchTopArtists,
  fetchTopTracks,
  selectTopArtists,
  selectTopTracks,
  getUserChats,
  sendMessage,
  getChatHistory,
});

// Spotify OAuth Callback Route
router.get('/auth/spotify/callback', spotifyOAuthCallback);

// Colleges Routes
router.get('/colleges', fetchColleges);
router.post('/college', updateCollege);

// User-related Routes
router.post('/user', createUser);
router.get('/users', fetchUsers);
router.put('/user', updateUser);

// Discovery Route
router.get('/discovery', fetchFilteredUsers);

// Spotify Login Route
router.get('/login/spotify', (req, res) => {
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;
  res.redirect(SPOTIFY_AUTH_URL);
});

router.get('/profile', fetchProfile);

// User Spotify-related Queries
router.get('/fetchTopArtists', fetchTopArtists);
router.get('/fetchTopTracks', fetchTopTracks);
router.post('/selectTopArtists', selectTopArtists);
router.post('/selectTopTracks', selectTopTracks);

// Chat Routes
router.get('/chats', getUserChats); // Fetch all chats for a user
router.post('/chats/message', sendMessage); // Send a new chat message
router.get('/chats/:match_id', getChatHistory); // Fetch conversation history for a match_id

// Filters Routes
router.get('/filters', getFilterOptions);
router.get('/filters/randomize', getRandomizedFilters);

module.exports = router;
