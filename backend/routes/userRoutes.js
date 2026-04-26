// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
// ✅ Import with the correct names from authMiddleware
const { authenticate, isStaff } = require('../middleware/authMiddleware');

// Alias for readability (optional)
const protect = authenticate;
const staffOnly = isStaff;

// Get all users (Staff only)
router.get('/', protect, staffOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Get single user
router.get('/:id', protect, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update user
router.put('/:id', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Delete user (Staff only)
router.delete('/:id', protect, staffOnly, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// PUT /api/users/:id/password
router.put('/:id/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password incorrect' });
    
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;