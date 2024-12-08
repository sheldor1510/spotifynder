const { User } = require('../models'); // import user models

exports.fetchProfile = async (req, res) => {
    if (!req.query.accessToken) {
        return res.status(400).send("Access Token missing");
    }

    try {
        const userToken = req.query.accessToken;
        const user = await User.findOne({where: { accessToken: userToken} });

        if(!user) {
            return res.status(400).send("User does not exist");
        }

        const topArtists = user.topArtists;
        const topTracks = user.topTracks;
        const topPlaylists = user.topPlaylists;
        const personalityPrompts = user.personalityPrompts;

        return res.json({topArtists, topTracks, topPlaylists, personalityPrompts});
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
    // check if accesstoken 
    // if there is, fetch user
    // if user, send obj back 
};
