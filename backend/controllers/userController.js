const { User } = require('../models');
const { getAccessToken, getUserProfile, findOrCreateUser } = require('../services/spotifyServices');
const { Op } = require('sequelize');

exports.spotifyOAuthCallback = async (req, res) => {
  const { code } = req.query;  // Get the authorization code from the query params

  if (!code) {
    return res.status(400).send('Spotify authorization code missing.');
  }

  try {
    // Step 1: Get the access token using the authorization code
    const { access_token } = await getAccessToken(code);
    
    // Step 2: Fetch user profile from Spotify
    const userProfile = await getUserProfile(access_token);

    // Step 3: Find or create the user in your database
    const user = await findOrCreateUser({
      spotifyId: access_token,
      displayName: userProfile.display_name,
      email: userProfile.email,
      accessToken: access_token,
      image: userProfile.images[0].url,
    });

    // Respond with user data or redirect to the main app
    // res.json({ message: 'User logged in successfully', user });
    res.redirect(`http://127.0.0.1:5501/frontend/close.html?accessToken=${access_token}`);
  } catch (error) {
    console.error('Error during Spotify OAuth callback:', error);
    res.status(500).send('Error handling the callback.');
  }
};

exports.fetchColleges = (req, res) => {
  let colleges = [
    'umass',
    'mit'
  ]
  res.json({
    data: colleges
  });
};

exports.updateCollege = (req, res) => {
  res.send('Update College Handler');
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Username, email, and password are required.');
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User created successfully.', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Failed to create user.');
  }
};

// Fetch all users
exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id, username, email } = req.body;
    if (!id) {
      return res.status(400).send('User ID is required.');
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @description Fetch user profiles based on filter parameters, with default query logic and pagination
 * @query {string} artists - Filter by artist name (default: null)
 * @query {string} tracks - Filter by track title (default: null)
 * @query {string} playlists - Filter by playlist name (default: null)
 * @query {number} minCompatibilityScore - Minimum compatibility score (default: 0)
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Number of profiles per page (default: 10)
 */

exports.fetchFilteredUsers = async (req, res) => {
  try {
    const {
      artists,
      tracks,
      playlists,
      compatibilityScore = 0,
      page = 1,
      limit = 50,
      randomize = 'false',
      sort,
    } = req.query;

    // Initialize query conditions
    const conditions = {};

    if (artists) {
      const artistArray = artists.split(',').filter(Boolean);
      if (artistArray.length > 0) {
        conditions.topArtists = {
          [Op.or]: artistArray.map((artist) => ({
            [Op.contains]: [{ name: artist }],
          })),
        };
      }
    }

    if (tracks) {
      const trackArray = tracks.split(',').filter(Boolean);
      if (trackArray.length > 0) {
        conditions.topTracks = {
          [Op.or]: trackArray.map((track) => ({
            [Op.contains]: [{ title: track }],
          })),
        };
      }
    }

    if (playlists) {
      const playlistArray = playlists.split(',').filter(Boolean);
      if (playlistArray.length > 0) {
        conditions.topPlaylists = {
          [Op.or]: playlistArray.map((playlist) => ({
            [Op.contains]: [{ name: playlist }],
          })),
        };
      }
    }

    if (compatibilityScore) {
      conditions.compatibilityScore = {
        [Op.gte]: parseFloat(compatibilityScore),
      };
    }

    // Pagination and Sorting
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const order = sort ? [sort.split(':').map((item) => item.trim())] : [];

    let users = await User.findAll({
      where: conditions,
      limit: parseInt(limit, 10),
      offset,
      order,
    });

    // Randomize results if `randomize=true`
    if (randomize === 'true') {
      users = users.sort(() => 0.5 - Math.random());
    }

    // Format the users to match the expected structure
    const formattedUsers = users.map((user) => {
      // Ensure parsing only if the data is a string
      const parseField = (field) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            console.error(`Failed to parse field: ${field}`);
            return [];
          }
        }
        return Array.isArray(field) ? field : [];
      };

      const topArtists = parseField(user.topArtists);
      const topTracks = parseField(user.topTracks);
      const topPlaylists = parseField(user.topPlaylists);
      const personalityPrompts = parseField(user.personalityPrompts);

      const promptsWithQuestions = [
          {
              question: "If you could meet one artist who would it be?",
              answer: ""
          },
          {
              question: "What's your favorite shower jam?",
              answer: ""
          },
          {
              question: "What's your dream concert?",
              answer: ""
          }
      ]


      return {
        type: 'profile',
        name: user.displayName || 'Unknown User',
        username: user.username || 'unknown',
        image: user.image || 'sample-pfp.jpeg',
        compability: user.compatibilityScore || 0,
        topArtists: topArtists.map((artist) => ({
          name: artist || 'Unknown Artist',
          image: 'path/to/artist/image.jpg',
        })),
        topTracks: topTracks.map((track) => ({
          name: track || 'Unknown Track',
          image: 'path/to/track/image.jpg',
        })),
        topPlaylists: topPlaylists.map((playlist) => ({
          name: playlist || 'Unknown Playlist',
          image: 'path/to/playlist/image.jpg',
        })),
        questions: personalityPrompts.map((prompt, index) => ({
          question: promptsWithQuestions[index].question || 'Unknown Question',
          answer: prompt || 'No Answer',
        })),
      };
    });

    res.status(200).json({
      data: formattedUsers,
      meta: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Error fetching filtered users:', error);
    res.status(500).json({ error: 'Failed to fetch filtered users.' });
  }
};




exports.getFilterOptions = async (req, res) => {
  try {
    // Query all users
    const users = await User.findAll({
      attributes: ['topArtists', 'topTracks', 'topPlaylists'], // Only fetch these fields
    });

    // Aggregate unique values for filters
    const uniqueArtists = new Set();
    const uniqueTracks = new Set();
    const uniquePlaylists = new Set();

    users.forEach((user) => {
      if (user.topArtists) {
        user.topArtists.forEach((artist) => uniqueArtists.add(artist.name));
      }
      if (user.topTracks) {
        user.topTracks.forEach((track) => uniqueTracks.add(track.title));
      }
      if (user.topPlaylists) {
        user.topPlaylists.forEach((playlist) => uniquePlaylists.add(playlist.name));
      }
    });

    // Respond with unique filter options
    res.status(200).json({
      artists: Array.from(uniqueArtists),
      tracks: Array.from(uniqueTracks),
      playlists: Array.from(uniquePlaylists),
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Failed to fetch filter options.' });
  }
};

/**
 * @description Fetch randomized filter options
 */
exports.getRandomizedFilters = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Aggregate values for randomization
    const allArtists = [];
    const allTracks = [];
    const allPlaylists = [];

    users.forEach((user) => {
      if (user.topArtists) {
        user.topArtists.forEach((artist) => allArtists.push(artist.name));
      }
      if (user.topTracks) {
        user.topTracks.forEach((track) => allTracks.push(track.title));
      }
      if (user.topPlaylists) {
        user.topPlaylists.forEach((playlist) => allPlaylists.push(playlist.name));
      }
    });

    // Shuffle and limit the results
    const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());
    const randomArtists = shuffleArray(allArtists).slice(0, 5); // Limit to 5
    const randomTracks = shuffleArray(allTracks).slice(0, 5);   // Limit to 5
    const randomPlaylists = shuffleArray(allPlaylists).slice(0, 5); // Limit to 5

    // Respond with the randomized filter options
    res.status(200).json({
      randomArtists,
      randomTracks,
      randomPlaylists,
    });
  } catch (error) {
    console.error('Error fetching randomized filters:', error);
    res.status(500).json({ error: 'Failed to fetch randomized filters.' });
  }
};