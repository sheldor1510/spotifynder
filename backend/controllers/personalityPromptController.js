const { User } = require('../models'); 


//personality prompt controller
exports.savePrompt = async (req, res) => {
    try {
        //getting their access token
        const userToken = req.query.accessToken; 
        //finding the user from the token
        const user = await User.findOne({ where: { accessToken: userToken } });

        //error handling if it doesnt exist
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        // body = { playlists: [1,2,3] }
        const userPrompts = req.body.prompts
        
        // update the user in the database with the playlists they selected
        user.personalityPrompts = userPrompts
        //saving
        await user.save();

        res.json({ success: true })
        //error handling
    } catch (error) {
        //printing the message in console
        console.error("Error fetching prompts:", error);
        res.status(500).json({ error: "Failed to fetch a user's personality prompts." });
    }

}
