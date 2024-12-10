const { User } = require('../models'); // Import the User model
const axios = require('axios');
//playlist controller


exports.fetchPlaylists = async (req, res) => {
    try {
        //getting the access token
        const userToken = req.query.accessToken; // Get the accessToken from the query string


        // Check if the user exists in the database using the provided token
        const user = await User.findOne({ where: { accessToken: userToken } });

        //error handling
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

        //storing it in playlists
        const playlists = response.data.items;

        // Return the playlists in the response
        res.json({ playlists });

    
        //error handling
    } catch (error) {
        console.error("Error fetching playlists:", error);
        // Handle errors (e.g., network issues, invalid token)
        res.status(500).json({ error: "Failed to fetch playlists from Spotify." });
    }


};


//saving the playlists to the db
exports.savePlaylists = async (req, res) => {
    try {
        //getting the access token
        const userToken = req.query.accessToken; 
        //finding the specific user with that access token
        const user = await User.findOne({ where: { accessToken: userToken } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        // body = { playlists: [1,2,3] }
        const usersTopPlaylists = req.body.playlists
        
        console.log(req.body);

        // update the user in the database with the playlists they selected
        user.topPlaylists = usersTopPlaylists
        //saving it
        await user.save();

        //converting to json
        res.json({ success: true })

        //error handling
    } catch (error) {
        console.error("Error fetching playlists:", error);
        // Handle errors (e.g., network issues, invalid token)
        res.status(500).json({ error: "Failed to fetch playlists from Spotify." });
    }

}
