// backend/controllers/staffController.js
const User = require('../models/User');
const Request = require('../models/Request');

const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Count all request statuses
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const processingRequests = await Request.countDocuments({ status: 'processing' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
    
    // Calculate total
    const totalRequests = pendingRequests + processingRequests + completedRequests + rejectedRequests;

    // Get recent 5 requests for dashboard
    const recentRequests = await Request.find()
      .sort({ dateRequested: -1 })
      .limit(5)
      .populate('studentId', 'name studentId');

    res.json({
      totalRequests,
      pendingRequests,
      processingRequests,
      completedRequests,
      rejectedRequests,
      totalStudents,
      recentRequests
    });
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
    const recentRequests = await Request.find()
      .sort({ dateRequested: -1 })
      .limit(10)
      .populate('studentId', 'name studentId');
    
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pending = await Request.countDocuments({ status: 'pending' });
    
    res.json({ totalStudents, pendingRequests: pending, recentRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'processing', 'completed', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const request = await Request.findByIdAndUpdate(
      id,
      { status, dateProcessed: status === 'completed' || status === 'rejected' ? Date.now() : null },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllStudents, getDashboardData, updateRequestStatus };