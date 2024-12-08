const Chat = require('../models/chat/Chat');

// Fetch all chats for a logged-in user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure `req.user` is populated by middleware
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const chats = await Chat.find({ match_id: { $in: req.user.matches } });
    res.status(200).json(chats);
  } catch (err) {
    console.error('Error fetching user chats:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
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
