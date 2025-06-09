const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { user, comment } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user, comment });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike a post
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(userId);

    if (index === -1) {
      // User has not liked the post, add their ID
      post.likes.push(userId);
    } else {
      // User has already liked the post, remove their ID (unlike)
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json(post); // Send back the updated post object
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
