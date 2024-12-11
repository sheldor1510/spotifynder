// Import necessary dependencies and services
const { User } = require('../models'); // Import the User model for database interactions
const { getAccessToken, getUserProfile, findOrCreateUser } = require('../services/spotifyServices'); // Import Spotify-related service functions
const { Op } = require('sequelize'); // Import Sequelize operators for query conditions

// Spotify OAuth Callback handler to manage the Spotify authentication process
exports.spotifyOAuthCallback = async (req, res) => {
  const { code } = req.query; // Extract the authorization code from query parameters

  // Validate the presence of the authorization code
  if (!code) {
    return res.status(400).send('Spotify authorization code missing.'); // Respond with error if missing
  }

  try {
    // Step 1: Exchange the authorization code for an access token
    const { access_token } = await getAccessToken(code);
    
    // Step 2: Fetch the user's profile information from Spotify
    const userProfile = await getUserProfile(access_token);

    // Step 3: Find or create a user in the database based on Spotify profile data
    const user = await findOrCreateUser({
      spotifyId: access_token, // Use access token as the unique identifier
      displayName: userProfile.display_name, // Spotify display name
      email: userProfile.email, // Spotify email address
      accessToken: access_token, // Store access token for further use
      image: userProfile.images[0]?.url, // Spotify profile image URL, if available
    });

    // Redirect the user to the frontend application with the access token in the URL
    res.redirect(`http://127.0.0.1:5501/frontend/close.html?accessToken=${access_token}`);
  } catch (error) {
    // Log the error and respond with an error message
    console.error('Error during Spotify OAuth callback:', error);
    res.status(500).send('Error handling the callback.');
  }
};

// Fetch filtered user profiles based on query conditions and pagination
exports.fetchFilteredUsers = async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const {
      artists, // Filter by artist names
      tracks, // Filter by track titles
      playlists, // Filter by playlist names
      compatibilityScore = 0, // Minimum compatibility score (default 0)
      page = 1, // Page number for pagination (default 1)
      limit = 50, // Number of profiles per page (default 50)
      randomize = 'false', // Flag to randomize results (default false)
      sort, // Sorting order
    } = req.query;

    // Initialize conditions object for the database query
    const conditions = {};

    // Add filters for top artists if specified
    if (artists) {
      const artistArray = artists.split(',').filter(Boolean); // Split and clean artist names
      if (artistArray.length > 0) {
        conditions.topArtists = {
          [Op.or]: artistArray.map((artist) => ({
            [Op.contains]: [{ name: artist }], // Match artist names in the database
          })),
        };
      }
    }

    // Add filters for top tracks if specified
    if (tracks) {
      const trackArray = tracks.split(',').filter(Boolean); // Split and clean track titles
      if (trackArray.length > 0) {
        conditions.topTracks = {
          [Op.or]: trackArray.map((track) => ({
            [Op.contains]: [{ title: track }], // Match track titles in the database
          })),
        };
      }
    }

    // Add filters for top playlists if specified
    if (playlists) {
      const playlistArray = playlists.split(',').filter(Boolean); // Split and clean playlist names
      if (playlistArray.length > 0) {
        conditions.topPlaylists = {
          [Op.or]: playlistArray.map((playlist) => ({
            [Op.contains]: [{ name: playlist }], // Match playlist names in the database
          })),
        };
      }
    }

    // Add filter for compatibility score if specified
    if (compatibilityScore) {
      conditions.compatibilityScore = {
        [Op.gte]: parseFloat(compatibilityScore), // Filter users with scores greater than or equal to the given value
      };
    }

    // Calculate pagination and sorting parameters
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10); // Offset for pagination
    const order = sort ? [sort.split(':').map((item) => item.trim())] : []; // Sorting order if provided

    // Fetch users from the database based on the conditions
    let users = await User.findAll({
      where: conditions,
      limit: parseInt(limit, 10), // Apply the limit
      offset, // Apply the offset
      order, // Apply sorting if provided
    });

    // Shuffle the results if randomization is enabled
    if (randomize === 'true') {
      users = users.sort(() => 0.5 - Math.random());
    }

    // Format user data for the response
    const formattedUsers = users.map((user) => {
      /**
       * Helper function to safely parse a field from JSON
       * @param {string|array} field - Field to parse
       * @returns {array} - Parsed data or empty array
       */
      const parseField = (field) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field); // Parse JSON string into an array
          } catch {
            console.error(`Failed to parse field: ${field}`); // Log error if parsing fails
            return [];
          }
        }
        return Array.isArray(field) ? field : []; // Return array if already parsed
      };

      // Parse fields for top artists, tracks, playlists, and personality prompts
      const topArtists = parseField(user.topArtists);
      const topTracks = parseField(user.topTracks);
      const topPlaylists = parseField(user.topPlaylists);
      const personalityPrompts = parseField(user.personalityPrompts);

      // Define questions for the personality prompts
      const promptsWithQuestions = [
        { question: "If you could meet one artist who would it be?", answer: "" },
        { question: "What's your favorite shower jam?", answer: "" },
        { question: "What's your dream concert?", answer: "" },
      ];

      // Return the formatted user profile
      return {
        type: 'profile', // Define the type of data
        name: user.displayName || 'Unknown User', // Use display name or default to 'Unknown User'
        username: user.username || 'unknown', // Use username or default to 'unknown'
        image: user.image || 'sample-pfp.jpeg', // Use user profile image or default to placeholder
        compability: user.compatibilityScore || 0, // User's compatibility score or 0 if not available
        // Map top artists with names and placeholder images
        topArtists: topArtists.map((artist) => ({
          name: artist || 'Unknown Artist', // Artist name or default
          image: 'path/to/artist/image.jpg', // Placeholder image path
        })),
        // Map top tracks with names and placeholder images
        topTracks: topTracks.map((track) => ({
          name: track || 'Unknown Track', // Track name or default
          image: 'path/to/track/image.jpg', // Placeholder image path
        })),
        // Map top playlists with names and placeholder images
        topPlaylists: topPlaylists.map((playlist) => ({
          name: playlist || 'Unknown Playlist', // Playlist name or default
          image: 'path/to/playlist/image.jpg', // Placeholder image path
        })),
        // Map personality prompts with predefined questions
        questions: personalityPrompts.map((prompt, index) => ({
          question: promptsWithQuestions[index]?.question || 'Unknown Question', // Predefined question or default
          answer: prompt || 'No Answer', // Prompt answer or default
        })),
      };
    });

    // Respond with the formatted user profiles and metadata
    res.status(200).json({
      data: formattedUsers, // Array of formatted user profiles
      meta: {
        page: parseInt(page, 10), // Current page number
        limit: parseInt(limit, 10), // Limit of profiles per page
        total: users.length, // Total number of users returned
      },
    });
  } catch (error) {
    // Log the error and respond with an error message
    console.error('Error fetching filtered users:', error);
    res.status(500).json({ error: 'Failed to fetch filtered users.' });
  }
};
