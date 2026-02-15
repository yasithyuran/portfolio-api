const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({}).select('-password');
    if (!user) return res.status(404).json({ error: 'Profile not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE profile (admin only)
router.put('/', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// UPDATE achievements (admin only)
router.put('/achievements', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {},
      { $set: { achievements: req.body } },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Achievement update error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;