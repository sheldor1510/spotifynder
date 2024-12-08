const { User, Match } = require('../models');

exports.fetchRequests = async (req, res) => {
    // check if access token is provided
    if (!req.query.accessToken) {
        return res.status(400).send("Access Token missing");
    }

    // find user by access token
    const userToken = req.query.accessToken;

    // find user by access token
    const user = await User.findOne({where: { accessToken: userToken} });

    // if user does not exist, return an error
    if(!user) {
        return res.status(400).send("User does not exist");
    }
    
    try {
        // find all requests where the user is the requestor
        const requests = await Match.findAll({
            where: {
                user_requested: user.id,
                status: 'pending'
            }
        });

        // for each request, fetch the requestor's profile
        for (let i = 0; i < requests.length; i++) {
            const requestor = await User.findOne({
                where: {
                    id: requests[i].requestor
                }
            });

            requests[i].requestor = requestor;
        }
        
        // if no requests are found, return a message
        if (requests.length === 0) {
            return res.status(200).send({ success: true, message: "No requests found", requests: [] });
        }

        return res.status(200).send({ success: true, requests });
    } catch (error) {
        return res.status(500).send({ success: false, error });
    }
}
