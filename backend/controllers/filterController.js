const { User } = require('../models');

exports.resetFilters = (req, res) => {
    try {
        res.status(200).json({
            artists: [], // Empty array for artist filters
            tracks: [], // Empty array for track filters
            playlists: [], // Empty array for playlist filters
            compatibilityScore: 50, // Default compatibility score
            randomize: false, // No randomization
        });
    } catch (error) {
        console.error('Error resetting filters:', error);
        res.status(500).json({ error: 'Failed to reset filters.' });
    }
};

exports.getRandomProfile = async (req, res) => {
    try {
        // Count the total number of users
        const userCount = await User.count();

        if (userCount === 0) {
            return res.status(404).json({ message: 'No profiles found.' });
        }

        // Generate a random offset
        const randomOffset = Math.floor(Math.random() * userCount);

        // Fetch one random user using the offset
        const randomUser = await User.findOne({ offset: randomOffset });

        // If no user found, handle the edge case
        if (!randomUser) {
            return res.status(404).json({ message: 'No profiles found.' });
        }

        // Return the random user's profile in the format expected by the frontend
        res.status(200).json({
            username: randomUser.username || 'Unknown User',
            profilePic: randomUser.profilePic || 'default-pic.jpg', // Default pic if none provided
            compatibilityScore: randomUser.compatibilityScore || 0,
            topArtists: randomUser.topArtists || [],
            topTracks: randomUser.topTracks || [],
            topPlaylists: randomUser.topPlaylists || [],
        });
    } catch (error) {
        console.error('Error fetching random profile:', error);
        res.status(500).json({ error: 'Failed to fetch random profile.' });
    }
};

