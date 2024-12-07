const { User } = require('../models'); // Import the User model
const axios = require('axios');

exports.fetchPlaylists = async (req, res) => {
    try {
        const userToken = req.query.accessToken; // Get the accessToken from the query string


        // Check if the user exists in the database using the provided token
        const user = await User.findOne({ where: { accessToken: userToken } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }


        // Get the user's Spotify token 
        const spotifyToken = user.spotifyId;  

        // Ensure that we have a valid Spotify token
        if (!spotifyToken) {
            return res.status(400).json({ error: "Spotify token is missing." });
        }

        // Make the API call to fetch the playlists from Spotify
        const url = 'https://api.spotify.com/v1/me/playlists';
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${spotifyToken}` 
            }
        });

        const playlists = response.data.items;

        // Return the playlists in the response
        res.json({ playlists });

    

    } catch (error) {
        console.error("Error fetching playlists:", error);
        // Handle errors (e.g., network issues, invalid token)
        res.status(500).json({ error: "Failed to fetch playlists from Spotify." });
    }


};

exports.savedPlaylists = async (req, res) => {
    try {
        const userToken = req.query.accessToken; 
 
        const user = await User.findOne({ where: { accessToken: userToken } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        // body = { playlists: [1,2,3] }
        const usersTopPlaylists = req.body.playlists
        
        // update the user in the database with the playlists they selected
        user.topPlaylists = usersTopPlaylists
        await user.save();

        res.json({ success: true })

    } catch (error) {
        console.error("Error fetching playlists:", error);
        // Handle errors (e.g., network issues, invalid token)
        res.status(500).json({ error: "Failed to fetch playlists from Spotify." });
    }

}
