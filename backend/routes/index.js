const express = require('express');
const { spotifyOAuthCallback, fetchColleges, updateCollege } = require('../controllers/userController');
const router = express.Router();

router.get('/auth/spotify/callback', spotifyOAuthCallback);
router.get('/colleges', fetchColleges);
router.post('/college', updateCollege);

module.exports = router;
