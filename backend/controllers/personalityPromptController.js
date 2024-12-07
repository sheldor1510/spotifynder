const { User } = require('../models'); 



exports.savePrompt = async (req, res) => {
    try {
        const userToken = req.query.accessToken; 
 
        const user = await User.findOne({ where: { accessToken: userToken } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        // body = { playlists: [1,2,3] }
        const userPrompts = req.body.prompt
        
        // update the user in the database with the playlists they selected
        user.personalityPrompts = userPrompts
        await user.save();

        res.json({ success: true })
    } catch (error) {
        console.error("Error fetching prompts:", error);
        res.status(500).json({ error: "Failed to fetch a user's personality prompts." });
    }

}
