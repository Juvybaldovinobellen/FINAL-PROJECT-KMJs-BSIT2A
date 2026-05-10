const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Notification = require('../models/Notification');

const submitFeedback = async (req, res) => {
  try {
    const { rating, category, message, isAnonymous } = req.body;
    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.name : 'Anonymous';

    // Create feedback with isAnonymous flag
    const feedback = await Feedback.create({
      user: userId,
      rating,
      category,
      message: message || '',
      isAnonymous: isAnonymous === true || isAnonymous === 'true' ? true : false
    });

      // 🔔 Notify all staff (hide name if anonymous)
    const displayName = (isAnonymous ? 'Someone' : userName);
    const staffUsers = await User.find({ role: 'staff' }).select('_id');
    const staffNotifications = staffUsers.map(staff => ({
      user: staff._id,
      title: '⭐ New Feedback',
      message: `${displayName} rated ${rating}★ (${category})`,
      type: 'info',
    }));
    if (staffNotifications.length) {
      await Notification.insertMany(staffNotifications);
    }

    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Optional: get all feedback (staff only)
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        // Anonymize if needed
        const anonymizedFeedbacks = feedbacks.map(fb => {
            const fbObj = fb.toObject();
            if (fbObj.isAnonymous) {
                fbObj.user = { name: 'Anonymous', email: null };
            }
            return fbObj;
        });
        
        res.json(anonymizedFeedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitFeedback, getAllFeedback };