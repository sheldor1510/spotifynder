const { User } = require('../models'); // Import the User model from models/index.js
const axios = require('axios');

/*exports.fetchTopArtists = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting user ID as a path parameter
  
      // Find the user in the database
      const user = await User.findOne({where: {accessToken: accessToken}} );
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (!user.spotifyId) {
        return res.status(400).send('Spotify access token is missing for this user.');
      }
  
      // Fetch top artists from Spotify
      const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: { Authorization: `Bearer ${user.spotifyId}` },
        params: { limit: 10 }, // Fetch top 10 artists
      });
  
      const topArtists = topArtistsResponse.data.items.map(artist => ({
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
      }));
  
      res.status(200).json({
        message: 'Top artists fetched successfully.',
        topArtists,
      });
    } catch (error) {
      console.error('Error fetching top artists:', error);
      res.status(500).send('Failed to fetch top artists.');
    }
  };*/

  exports.fetchTopArtists = async (req, res) => {
    try {
        const { accessToken } = req.query; // Access token provided via query parameters
  
        // Find the user in the database using accessToken
        const user = await User.findOne({where: {accessToken: accessToken}});
        if (!user) {
            return res.status(404).send('User not found.');
        }
  
        if (!user.spotifyId) {
            return res.status(400).send('Spotify access token is missing for this user.');
        }
  
        // Fetch top artists from Spotify
        const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${user.spotifyId}` },
            params: { limit: 10 }, // Fetch top 10 artists
        });
  
        const topArtists = topArtistsResponse.data.items.map(artist => ({
            name: artist.name,
            genres: artist.genres,
            popularity: artist.popularity,
            imageUrl: artist.images[0]?.url || 'No image available' // Fetching the first image URL if available
        }));
  
        res.status(200).json({
            message: 'Top artists fetched successfully.',
            topArtists,
        });
    } catch (error) {
        console.error('Error fetching top artists:', error);
        res.status(500).send('Failed to fetch top artists.');
    }
};

 
/*exports.fetchTopTracks = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting Spotify access token in query parameter
  
      // Find the user in the database
      const user = await User.findOne({where: {accessToken: accessToken}} );// Adjusted query to find the user by accessToken
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (!user.spotifyId) {
        return res.status(400).send('Spotify access token is missing for this user.');
      }
  
      // Fetch top tracks from Spotify
      const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${user.spotifyId}` }, // Spotify ID used for authorization
        params: { limit: 10 }, // Fetch top 10 tracks
      });
  
      const topTracks = topTracksResponse.data.items.map(track => ({
        name: track.name,
        album: track.album.name,
        artists: track.artists.map(artist => artist.name),
        popularity: track.popularity,
      }));
  
      res.status(200).json({
        message: 'Top tracks fetched successfully.',
        topTracks,
      });
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      res.status(500).send('Failed to fetch top tracks.');
    }
  };*/

  exports.fetchTopTracks = async (req, res) => {
    try {
        const { accessToken } = req.query; // Access token provided via query parameters
  
        // Find the user in the database using accessToken
        const user = await User.findOne({where: {accessToken: accessToken}});
        if (!user) {
            return res.status(404).send('User not found.');
        }
  
        if (!user.spotifyId) {
            return res.status(400).send('Spotify access token is missing for this user.');
        }
  
        // Fetch top tracks from Spotify
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${user.spotifyId}` },
            params: { limit: 10 }, // Fetch top 10 tracks
        });
  
        const topTracks = topTracksResponse.data.items.map(track => ({
            name: track.name,
            album: track.album.name,
            artists: track.artists.map(artist => artist.name),
            popularity: track.popularity,
            albumImageUrl: track.album.images[0]?.url || 'No album image available' // Fetching the album image URL if available
        }));
  
        res.status(200).json({
            message: 'Top tracks fetched successfully.',
            topTracks,
        });
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        res.status(500).send('Failed to fetch top tracks.');
    }
};

  exports.selectTopArtists = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting Spotify access token in query parameter
      const { topArtists } = req.body; // User-selected artists in request body
  
      // Find the user in the database by accessToken
      const user = await User.findOne({where: {accessToken: accessToken}} );
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (!topArtists || !Array.isArray(topArtists) || topArtists.length !== 3) {
        return res.status(400).send('You must provide exactly 3 artists.');
      }
  
      // Save the selected artists as JSON in the user's record
      user.topArtists = JSON.stringify(topArtists);
  
      await user.save(); // Save changes to the database
  
      res.status(200).json({
        message: 'Top artists saved successfully.',
        topArtists,
      });
    } catch (error) {
      console.error('Error saving top artists:', error);
      res.status(500).send('Failed to save top artists.');
    }
  };

exports.selectTopTracks = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting Spotify access token in query parameter
      const { topTracks } = req.body; // User-selected tracks in request body
  
      // Find the user in the database by accessToken
      const user = await User.findOne({where: {accessToken: accessToken}} );
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (!topTracks || !Array.isArray(topTracks) || topTracks.length !== 3) {
        return res.status(400).send('You must provide exactly 3 tracks.');
      }
  
      // Save the selected tracks as JSON in the user's record
      user.topTracks = JSON.stringify(topTracks);
  
      await user.save(); // Save changes to the database
  
      res.status(200).json({
        message: 'Top tracks saved successfully.',
        topTracks,
      });
    } catch (error) {
      console.error('Error saving top tracks:', error);
      res.status(500).send('Failed to save top tracks.');
    }
  };

  
  
  