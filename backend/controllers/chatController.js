// controllers/chatController.js

const { Chat } = require('../models');

// Fetch all chats for a logged-in user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ match_id: { $in: req.user.matches } });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
};

// Send a new chat message
exports.sendMessage = async (req, res) => {
  try {
    const { matchId, message } = req.body;
    const chat = await Chat.findOne({ match_id: matchId });
    if (chat) {
      chat.conversation_history.push(message);
      await chat.save();

      res.status(200).json(chat);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Sending failed', err });
  }
};
