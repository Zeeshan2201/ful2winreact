const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get all chats for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.userId })
      .populate('participants', 'fullName')
      .populate('messages.sender', 'fullName')
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Get chat with specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // Check if users are following each other
    const currentUser = await User.findById(req.user.userId);
    const otherUser = await User.findById(req.params.userId);

    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.userId);
    const isFollowedBy = currentUser.followers.includes(req.params.userId);

    if (!isFollowing && !isFollowedBy) {
      return res.status(403).json({ message: 'You can only chat with users you follow or who follow you' });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [req.user.userId, req.params.userId] }
    }).populate('participants', 'fullName')
      .populate('messages.sender', 'fullName');

    if (!chat) {
      chat = new Chat({
        participants: [req.user.userId, req.params.userId],
        messages: []
      });
      await chat.save();
      chat = await chat.populate('participants', 'fullName');
    }

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

// Send message in chat
router.post('/:userId/messages', authMiddleware, async (req, res) => {
  try {
    console.log('Received request to send message. User ID:', req.user.userId, 'Other User ID:', req.params.userId);
    const { content } = req.body;
    if (!content) {
      console.log('Message content is missing.');
      return res.status(400).json({ message: 'Message content is required' });
    }

    console.log('Fetching users...');
    // Check if users are following each other
    const currentUser = await User.findById(req.user.userId);
    const otherUser = await User.findById(req.params.userId);

    if (!otherUser) {
      console.log('Other user not found.');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Checking follow status...');
    const isFollowing = currentUser.following.includes(req.params.userId);
    const isFollowedBy = currentUser.followers.includes(req.params.userId);

    if (!isFollowing && !isFollowedBy) {
      console.log('Users are not following each other.');
      return res.status(403).json({ message: 'You can only chat with users you follow or who follow you' });
    }

    console.log('Finding or creating chat...');
    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [req.user.userId, req.params.userId] }
    });

    if (!chat) {
      console.log('Chat not found, creating new one.');
      chat = new Chat({
        participants: [req.user.userId, req.params.userId],
        messages: []
      });
    }

    console.log('Adding message...');
    // Add message
    chat.messages.push({
      sender: req.user.userId,
      content,
      timestamp: new Date()
    });

    chat.lastMessage = new Date();
    console.log('Saving chat...');
    await chat.save();

    console.log('Populating chat...');
    // Populate sender and participants before sending response
    chat = await chat.populate([
      { path: 'participants', select: 'fullName' },
      { path: 'messages.sender', select: 'fullName' }
    ]);

    console.log('Message sent successfully.');
    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Mark messages as read
router.put('/:userId/read', authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.user.userId, req.params.userId] }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages from other user as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user.userId.toString()) {
        message.read = true;
      }
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

module.exports = router; 