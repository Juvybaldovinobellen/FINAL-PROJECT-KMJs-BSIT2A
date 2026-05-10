const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional if not logged in
  rating: { type: Number, required: true, min: 1, max: 5 },
  category: { 
    type: String, 
    required: true,
    enum: ['Document Request Process', 'System Performance', 'User Interface', 'Notifications', 'Staff Service', 'Others']
},
  message: { type: String, trim: true },
  isAnonymous: { type: Boolean, default: false },  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);