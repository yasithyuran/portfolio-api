const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// GET all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single post by ID (for admin edit) - MUST come BEFORE /:slug
router.get('/admin/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single post by slug (for public view)
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE post (admin only)
router.post('/', async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    const savedPost = await post.save();
    console.log('✅ Blog post created:', savedPost._id);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// UPDATE post (admin only)
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    console.log('✅ Blog post updated:', post._id);
    res.json(post);
  } catch (error) {
    console.error('❌ Error updating post:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE post (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    console.log('✅ Blog post deleted:', req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('❌ Error deleting post:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;