const express = require('express');
const router = express.Router();

const { 
  spotifyOAuthCallback, 
  fetchColleges, 
  updateCollege, 
  createUser, 
  fetchUsers,
  updateUser,
  fetchFilteredUsers, // Import the new controller function
  getFilterOptions, // Import the new controller function
  getRandomizedFilters // Import the new controller function
} = require('../controllers/userController');

const {
  fetchPlaylists,
  savePlaylists
} = require('../controllers/playlistController');

const { savePrompt } = require('../controllers/personalityPromptController');

const { fetchProfile } = require('../controllers/profileController');const { updatePrompts } = require('../controllers/profileController'); 

const {
  fetchTopArtists,
  fetchTopTracks,
  selectTopArtists,
  selectTopTracks,
} = require('../controllers/ArtistandTracksController');

const{
  resetFilters,
  getRandomProfile
}= require ('../controllers/filterController')

const {
  getUserChats,
  sendMessage,
  getChatHistory, // Import chatController functions
} = require('../controllers/chatController');

const {
  fetchRequests,
  acceptRequest,
  rejectRequest
} = require('../controllers/matchesController');

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
const { colleges } = require('../colleges')

// User-related Routes
router.post('/user', createUser);
router.get('/users', fetchUsers);
router.put('/user', updateUser);

// Onboarding2 related routes
router.get('/playlists', fetchPlaylists)
//saving playlists
router.post('/savePlaylists', savePlaylists)
//route for the personality prompt
router.post('/personalityPrompts', savePrompt)

// Discovery Route
router.get('/discovery', fetchFilteredUsers);

// Spotify Login Route
router.get('/login/spotify', (req, res) => {
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;
  res.redirect(SPOTIFY_AUTH_URL);
});

const path = require('path');

// Serve colleges.json from the backend folder
router.get('/colleges', (req, res) => {
  res.send(colleges)
});

router.get('/profile', fetchProfile); // Fetch profile of user
router.get('/profile', updatePrompts); // Update personality prompts

// User Spotify-related Queries
router.get('/fetchTopArtists', fetchTopArtists);
router.get('/fetchTopTracks', fetchTopTracks);
router.post('/selectTopArtists', selectTopArtists);
router.post('/selectTopTracks', selectTopTracks);

//User filter related queries
router.post('/filter-reset-button', resetFilters);
router.get('/random-profile', getRandomProfile);

// Chat Routes
router.get('/chats', getUserChats); // Fetch all chats for a user
router.post('/chats/message', sendMessage); // Send a new chat message
router.get('/chats/:match_id', getChatHistory); // Fetch conversation history for a match_id

// Filters Routes
router.get('/filters', getFilterOptions);
router.get('/filters/randomize', getRandomizedFilters);
// Matches Routes
router.get('/requests', fetchRequests); // Fetch requests
router.post('/requests/accept', acceptRequest); // Accept request
router.post('/requests/reject', rejectRequest); // Reject request

module.exports = router;
