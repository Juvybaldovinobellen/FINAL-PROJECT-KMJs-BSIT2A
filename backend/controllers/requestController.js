const Request = require('../models/Request');
const User = require('../models/User');

// Create request (Student)
const createRequest = async (req, res) => {
  try {
    const { documentType, purpose, notes } = req.body;
    const student = await User.findById(req.user._id);
    
    const request = await Request.create({
      studentId: req.user._id,
      studentName: student.name,
      studentNumber: student.studentId,
      documentType,
      purpose,
      notes
    });
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my requests (Student)
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ studentId: req.user._id }).sort({ dateRequested: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests (Staff)
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('studentId', 'name email').sort({ dateRequested: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (Staff)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = status;
    request.dateProcessed = Date.now();
    request.processedBy = req.user._id;
    
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus };