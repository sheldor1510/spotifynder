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

const { fetchProfile } = require('../controllers/profileController'); // Correct path to profileController

const {
  fetchTopArtists,
  fetchTopTracks,
  selectTopArtists,
  selectTopTracks
} = require ('../controllers/ArtistandTracksController');

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

// Discovery Route
router.get('/discovery', fetchFilteredUsers); // Fetch filtered user profiles

// Spotify Login Route (Redirect to Spotify OAuth)
router.get('/login/spotify', (req, res) => {
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;
  res.redirect(SPOTIFY_AUTH_URL); // Redirect to Spotify login page
});

router.get('/profile', fetchProfile); // Fetch profile of user

//User Spotify related queries
router.get('/fetchTopArtists', fetchTopArtists);
router.get('/fetchTopTracks', fetchTopTracks);
router.post('/selectTopArtists', selectTopArtists);
router.post('/selectTopTracks', selectTopTracks);

// Filters Routes
router.get('/filters', getFilterOptions); // Fetch filter options
router.get('/filters/randomize', getRandomizedFilters); // Fetch randomized filters

// Matches Routes
router.get('/requests', fetchRequests); // Fetch requests
router.post('/requests/accept', acceptRequest); // Accept request
router.post('/requests/reject', rejectRequest); // Reject request

module.exports = router;
