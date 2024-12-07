const axios = require('axios');
const { User } = require('../models');

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me';

const getAccessToken = async (code) => {
  const response = await axios.post(SPOTIFY_AUTH_URL, null, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

const getUserProfile = async (accessToken) => {
  const response = await axios.get(SPOTIFY_API_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

const findOrCreateUser = async ({ spotifyId, displayName, email, accessToken }) => {
  let user = await User.findOne({ where: { spotifyId } });
  if (!user) {
    user = await User.create({ spotifyId, displayName, email, accessToken });
  } else {
    user.accessToken = accessToken;
    await user.save();
  }
  return user;
};

module.exports = {
  getAccessToken,
  getUserProfile,
  findOrCreateUser,
};
