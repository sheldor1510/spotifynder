const Chat = require('../models');
const { Op } = require('sequelize');
// Fetch all chats for a logged-in user

exports.getUserChats = async (req, res) => {
    try {
        //getting access token
      const accessToken = req.query.accessToken;
      //Authenticate user by access token
      if (!accessToken) {
        return res.status(400).json({ message: 'Access Token is required' });
      }
      //store the user which has all its info
      const user = await User.findOne({ where: { accessToken } });
  
      //if user is not found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userId = user.id;
  
      //Get matches where user is either requestor or user_requested
      const matches = await Match.findAll({
        where: {
            //only for accepted matches
          status: 'accepted',
          [sequelize.Op.or]: [
            { requestor: userId },
            { user_requested: userId }
          ]
        }
      });
  
      //find the corresponding match.id
      const chatIds = matches.map(match => match.id);
  
      //Fetch chats associated with these match IDs
      const chats = await Chat.find({ match_id: { $in: chatIds } });
  
      return res.status(200).json(chats);
    } catch (err) {
        //if there is an error - show it
      console.error('Error fetching user chats:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  };
  
  
// Send a new chat message
exports.sendMessage = async (req, res) => {
  try {
    const { matchId, message } = req.body;
    if (!matchId || !message) {
      return res.status(400).json({ message: 'Match ID and message are required' });
    }

    const chat = await Chat.findOne({ match_id: matchId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.conversation_history.push({
      sender: req.user.id, // Assuming `req.user` contains the logged-in user ID
      message,
      timestamp: new Date(),
    });

    await chat.save();
    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Fetch chat history based on match_id
exports.getChatHistory = async (req, res) => {
  try {
    const { match_id } = req.params;
    if (!match_id) {
      return res.status(400).json({ message: 'Match ID is required' });
    }

    const chat = await Chat.findOne({ match_id });
    if (!chat) {
      return res.status(404).json({ message: 'Chat history not found' });
    }

    res.status(200).json(chat.conversation_history);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
