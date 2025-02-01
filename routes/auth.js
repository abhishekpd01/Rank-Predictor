// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, pastNeetScore } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, pastNeetScore });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// (Optional) Login endpoint – in production you would return a JWT token or session info.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
