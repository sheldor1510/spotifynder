const { User } = require('../models'); // Import the User model from models/index.js

exports.fetchTopArtists = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting user ID as a path parameter
  
      // Find the user in the database
      const user = await User.find({ accessToken: accessToken });
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (!user.spotifyId) {
        return res.status(400).send('Spotify access token is missing for this user.');
      }
  
      // Fetch top artists from Spotify
      const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: { Authorization: `Bearer ${user.spotifyId}` },
        params: { limit: 10 }, // Fetch top 5 artists
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
  };
 
exports.fetchTopTracks = async (req, res) => {
    try {
      const { accessToken } = req.query; // Expecting Spotify access token in query parameter
  
      // Find the user in the database
      const user = await User.find({  accessToken: accessToken } ); // Adjusted query to find the user by accessToken
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
  };
  