const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// GET all messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contactMessage = new ContactMessage({ name, email, message });
    const savedMessage = await contactMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: savedMessage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;