const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email received:', email);
    console.log('Password received:', password ? '***' + password.slice(-3) : 'undefined');
    console.log('Body:', req.body);

    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Try to find user
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('User ID:', user._id);
      console.log('User email in DB:', user.email);
      console.log('Stored password hash:', user.password);
    } else {
      // Check if any users exist
      const userCount = await User.countDocuments();
      console.log('Total users in database:', userCount);
      
      // Try case-insensitive search
      const userCaseInsensitive = await User.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
      console.log('User found (case-insensitive):', userCaseInsensitive ? 'YES' : 'NO');
      
      if (userCaseInsensitive) {
        console.log('Email case mismatch! DB has:', userCaseInsensitive.email);
      }
    }

    if (!user) {
      console.log('Returning 401: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      // Additional debugging for password issue
      console.log('Password mismatch!');
      console.log('Input password length:', password.length);
      console.log('Hash in DB starts with:', user.password.substring(0, 10));
      
      // Test if the hash is valid
      const testHash = await bcrypt.hash(password, 10);
      console.log('Test hash of input password:', testHash);
      
      console.log('Returning 401: Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful! Generating token...');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Token generated successfully');
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// REGISTER (first time setup only)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== REGISTER ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password ? password.length : 0);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    console.log('Hash starts with:', hashedPassword.substring(0, 10));

    const user = new User({
      email,
      password: hashedPassword,
      profile: { name: 'Admin' },
    });

    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully with ID:', savedUser._id);

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Registration successful!');
    res.status(201).json({ token, user: { id: savedUser._id, email: savedUser.email } });
  } catch (error) {
    console.error('=== REGISTER ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// DEBUG ROUTE - Remove this after debugging!
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('email createdAt');
    res.json({ 
      count: users.length, 
      users: users.map(u => ({ 
        email: u.email, 
        createdAt: u.createdAt 
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;