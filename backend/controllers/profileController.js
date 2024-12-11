const { User } = require('../models'); // import user models

// Function to update a user's personality prompts in the database
exports.updatePrompts = async (req, res) => {
    // Check if the access token is provided in the query parameters
    if (!req.query.accessToken) {
        return res.status(400).send("Access Token missing"); // Send a 400 response if DNE
    }

    // Validate the personalityPrompts in the request body
    if (!req.body.personalityPrompts || !Array.isArray(req.body.personalityPrompts)) {
        return res.status(400).send('Personality Prompts are required.'); // Ensure prompts present and in array format
    }

    if (req.body.personalityPrompts.length > 3) {
        return res.status(400).send('You can only have up to 3 personality prompts.');
    }
    
    try {
        // Extract access token from query parameters
        const userToken = req.query.accessToken;

        // Find the user in the database using the access token
        const user = await User.findOne({where: { accessToken: userToken} });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        user.personalityPrompts = req.body.personalityPrompts.slice(0, 3); // Limit to 3 prompts
        await user.save(); // Save changes to database


        // Return success response with updated prompts and message
        return res.status(200).json({
            success: true,
            message: "Personality Prompts updated successfully.",
            personalityPrompts: user.personalityPrompts,
        });
    
    } catch (error) {
        console.error('Error updating personality prompts:', error);
        return res.status(500).send('Internal Server Error.');
  }
};

// Function to fetch all profile information
exports.fetchProfile = async (req, res) => {
    // Check if the access token is provided in the query parameters
    if (!req.query.accessToken) {
        return res.status(400).send("Access Token missing"); // Send 404 response if DNE
    }

    try {
        // Extract access token from query parameters
        const userToken = req.query.accessToken;
         // Find the user in the database using the access token
        const user = await User.findOne({where: { accessToken: userToken} });

        // If no user found, send 400 error
        if(!user) {
            return res.status(400).send("User does not exist");
        }

        // Safely retrieve user data and assign fallback values (empty array) if properties missing
        const topArtists = user.topArtists || [];
        const topTracks = user.topTracks || [];
        const topPlaylists = user.topPlaylists || [];
        const personalityPrompts = user.personalityPrompts || [];
        const email = user.email;
        const displayName = user.displayName;
        const spotifyId = user.spotifyId;
        const image = user.image;

        // Return the user profile data in a JSON response
        return res.json({topArtists, topTracks, topPlaylists, personalityPrompts, email, displayName, spotifyId, image});
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};