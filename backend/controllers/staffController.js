const User = require('../models/User');
const Request = require('../models/Request');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const recentRequests = await Request.find().sort({ dateRequested: -1 }).limit(5);
    
    res.json({
      totalRequests,
      pendingRequests,
      completedRequests,
      totalStudents,
      recentRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, getDashboardStats, updateStudent, deleteStudent };