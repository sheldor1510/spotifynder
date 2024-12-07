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
  fetchPlaylists,
  savePlaylists
} = require('../controllers/playlistController');
const { savePrompt 

} = require('../controllers/personalityPromptController');

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

// Onboarding2 related routes
router.get('/playlists', fetchPlaylists)
//saving playlists
router.post('/savePlaylists', savePlaylists)
//route for the personality prompt
router.post('/personalityPrompts', savePrompt)

module.exports = router;
