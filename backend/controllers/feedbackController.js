const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Notification = require('../models/Notification');

const submitFeedback = async (req, res) => {
  try {
    const { rating, category, message } = req.body;
    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.name : 'Anonymous';

    const feedback = await Feedback.create({
      user: userId,
      rating,
      category,
      message,
    });

    // 🔔 Notify all staff
    const staffUsers = await User.find({ role: 'staff' }).select('_id');
    const staffNotifications = staffUsers.map(staff => ({
      user: staff._id,
      title: '⭐ New Feedback',
      message: `${userName} rated ${rating}★ (${category})`,
      type: 'info',
    }));
    if (staffNotifications.length) {
      await Notification.insertMany(staffNotifications);
    }

    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: get all feedback (staff only)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitFeedback, getAllFeedback };