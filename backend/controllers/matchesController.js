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

exports.acceptRequest = async (req, res) => {
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

    // check if requestor id is provided
    if (!req.query.requestorId) {
        return res.status(400).send("Requestor ID missing");
    }

    try {
        // find match where user.id is the user_requested and requestor is requestorId and status is pending
        const match = await Match.findOne({
            where: {
                user_requested: user.id,
                requestor: req.query.requestorId,
                status: 'pending'
            }
        });

        // if match does not exist, return an error
        if (!match) {
            return res.status(400).send("Match does not exist");
        }

        // update match status to accepted
        match.status = 'accepted';
        await match.save();

        return res.status(200).send({ success: true, message: "Request accepted" });
    } catch (error) {
        return res.status(500).send({ success: false, error });
    }
}

exports.rejectRequest = async (req, res) => {
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

    // check if requestor id is provided
    if (!req.query.requestorId) {
        return res.status(400).send("Requestor ID missing");
    }

    try {
        // find match where user.id is the user_requested and requestor is requestorId and status is pending
        const match = await Match.findOne({
            where: {
                user_requested: user.id,
                requestor: req.query.requestorId,
                status: 'pending'
            }
        });

        // if match does not exist, return an error
        if (!match) {
            return res.status(400).send("Match does not exist");
        }

        // update match status to rejected
        match.status = 'rejected';
        await match.save();

        // add the requestorId to the user.rejectedPile array
        user.rejectPile.push(req.query.requestorId);
        await user.save();

        return res.status(200).send({ success: true, message: "Request rejected" });
    } catch (error) {
        return res.status(500).send({ success: false, error });
    }
}