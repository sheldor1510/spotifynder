const express = require('express');
const { 
  spotifyOAuthCallback, 
  fetchColleges, 
  updateCollege, 
  createUser, 
  fetchUsers, 
  updateUser

} = require('../controllers/userController');

const {
  fetchTopArtists,
  fetchTopTracks
} = require ('../controllers/ArtistandTracksController');

const router = express.Router();

console.log({
  spotifyOAuthCallback,
  fetchColleges,
  updateCollege,
  createUser,
  fetchUsers,
  updateUser,
});

// Define routes
router.get('/auth/spotify/callback', spotifyOAuthCallback);
router.get('/colleges', fetchColleges);
router.post('/college', updateCollege);

// User-related routes
router.post('/user', createUser);
router.get('/users', fetchUsers);
router.put('/user', updateUser);

//User Spotify related queries
router.get('/fetchTopArtists', fetchTopArtists);
router.get('/fetchTopTracks', fetchTopTracks);

module.exports = router;
