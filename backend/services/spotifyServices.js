// Import required modules
const axios = require('axios'); // Axios is used for making HTTP requests
const { User } = require('../models'); // Import the User model for database operations

// Spotify API endpoints
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token'; // Endpoint for retrieving access tokens
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me'; // Endpoint for retrieving user profile information

/**
 * Fetches an access token from Spotify using an authorization code.
 * @param {string} code - The authorization code received from Spotify after user login.
 * @returns {Object} - An object containing access_token, refresh_token, and expires_in.
 */
const getAccessToken = async (code) => {
  // Make a POST request to the Spotify API token endpoint
  const response = await axios.post(SPOTIFY_AUTH_URL, null, {
    params: {
      grant_type: 'authorization_code', // Specify grant type as 'authorization_code'
      code, // Include the authorization code in the request
      redirect_uri: process.env.REDIRECT_URI, // Redirect URI defined in the .env file
      client_id: process.env.SPOTIFY_CLIENT_ID, // Spotify Client ID from .env
      client_secret: process.env.SPOTIFY_CLIENT_SECRET, // Spotify Client Secret from .env
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Required content type for token requests
  });

  return response.data; // Return the token data, including access_token, refresh_token, and expires_in
};

/**
 * Fetches the Spotify user profile using an access token.
 * @param {string} accessToken - The access token for the authorized user.
 * @returns {Object} - The user's Spotify profile information.
 */
const getUserProfile = async (accessToken) => {
  // Make a GET request to Spotify's user profile endpoint
  const response = await axios.get(SPOTIFY_API_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }, // Add the access token in the Authorization header
  });

  return response.data; // Return the user's profile data, including id, display_name, email, etc.
};

/**
 * Finds or creates a user in the database based on their Spotify ID.
 * @param {Object} params - The user details, including spotifyId, displayName, email, and accessToken.
 * @returns {Object} - The user object from the database.
 */
const findOrCreateUser = async ({ spotifyId, displayName, email, accessToken }) => {
  // Attempt to find an existing user with the provided Spotify ID
  let user = await User.findOne({ where: { spotifyId } });

  if (!user) {
    // If user does not exist, create a new user record in the database
    user = await User.create({ spotifyId, displayName, email, accessToken });
  } else {
    // If user already exists, update the access token
    user.accessToken = accessToken; // Update the user's access token
    await user.save(); // Save the updated user record
  }

  return user; // Return the user object
};

// Export the functions to be used in other parts of the application
module.exports = {
  getAccessToken, // Function to retrieve Spotify access tokens
  getUserProfile, // Function to fetch Spotify user profiles
  findOrCreateUser, // Function to find or create users in the database
};
