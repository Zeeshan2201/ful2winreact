const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const dummyUsers = require('../data/dummyUsers');

// Create dummy users
// router.post('/create-dummy', async (req, res) => {
//   try {
//     await User.deleteMany(); // optional: clear existing users
//     const created = await User.insertMany(dummyUsers);
//     res.status(201).json({ message: 'Dummy users created', data: created });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a single user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Follow/Unfollow a user
router.post('/follow/:userId', async (req, res) => {
  try {
    const { followerId } = req.body; // ID of the user who wants to follow
    const followeeId = req.params.userId; // ID of the user to be followed

    // Don't allow users to follow themselves
    if (followerId === followeeId) {
      return res.status(400).json({ message: 'Users cannot follow themselves' });
    }

    // Find both users
    const [follower, followee] = await Promise.all([
      User.findById(followerId),
      User.findById(followeeId)
    ]);

    if (!follower || !followee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize followers/following arrays if they don't exist
    if (!follower.following) follower.following = [];
    if (!followee.followers) followee.followers = [];

    // Check if already following
    const isFollowing = follower.following.includes(followeeId);

    if (isFollowing) {
      // Unfollow: Remove from both arrays
      follower.following = follower.following.filter(id => id.toString() !== followeeId);
      followee.followers = followee.followers.filter(id => id.toString() !== followerId);
    } else {
      // Follow: Add to both arrays
      follower.following.push(followeeId);
      followee.followers.push(followerId);
    }

    // Save both users
    await Promise.all([follower.save(), followee.save()]);

    res.status(200).json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      follower: {
        _id: follower._id,
        following: follower.following
      },
      followee: {
        _id: followee._id,
        followers: followee.followers
      }
    });
  } catch (error) {
    console.error('Follow/Unfollow error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get follow status
router.get('/follow-status/:userId', async (req, res) => {
  try {
    const { followerId } = req.query; // ID of the user who might be following
    const followeeId = req.params.userId; // ID of the user to check

    const follower = await User.findById(followerId);
    if (!follower) {
      return res.status(404).json({ message: 'Follower not found' });
    }

    const isFollowing = follower.following?.includes(followeeId) || false;
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Follow status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
