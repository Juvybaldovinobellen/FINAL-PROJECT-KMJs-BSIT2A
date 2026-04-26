// backend/controllers/staffController.js
const User = require('../models/User');
const Request = require('../models/Request');

const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    res.json({ totalStudents, pendingRequests, completedRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const recentRequests = await Request.find().sort({ createdAt: -1 }).limit(10).populate('studentId', 'name');
    const stats = await getStats(req, res); // re-use but careful with response
    // Actually compute stats directly
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pending = await Request.countDocuments({ status: 'pending' });
    res.json({ totalStudents, pendingRequests: pending, recentRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  // This might already be in requestController; you can call it or re-implement
  const { id } = req.params;
  const { status } = req.body;
  // ... similar to requestController.updateRequestStatus
  const request = await Request.findByIdAndUpdate(id, { status }, { new: true });
  res.json(request);
};

module.exports = { getStats, getAllStudents, getDashboardData, updateRequestStatus };