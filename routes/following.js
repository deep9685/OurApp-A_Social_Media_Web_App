// routes/following.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/following', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following', 'userName');
    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error('Error fetching following users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
