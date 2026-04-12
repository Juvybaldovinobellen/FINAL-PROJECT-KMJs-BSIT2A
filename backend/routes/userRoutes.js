const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, staffOnly } = require('../middleware/authMiddleware');

// Get all users (Staff only)
router.get('/', protect, staffOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Get single user
router.get('/:id', protect, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
});

// Update user
router.put('/:id', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
});

// Delete user (Staff only)
router.delete('/:id', protect, staffOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;