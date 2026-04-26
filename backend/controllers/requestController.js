// backend/controllers/requestController.js
const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');

// 1. Create request (Student)
const createRequest = async (req, res) => {
  try {
    const { documentType, purpose, notes } = req.body;
    const student = await User.findById(req.user._id);

    // Create the request first
    const request = await Request.create({
      studentId: req.user._id,
      studentName: student.name,
      studentNumber: student.studentId,
      documentType,
      purpose,
      notes,
    });

    // Notify all staff about the new request (only once)
    const staffUsers = await User.find({ role: 'staff' }).select('_id');
    if (staffUsers.length) {
      const staffNotifications = staffUsers.map(staff => ({
        user: staff._id,
        title: '📄 New Document Request',
        message: `${student.name} requested a ${documentType}.`,
        type: 'info',
      }));
      await Notification.insertMany(staffNotifications);
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get my requests (Student)
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ studentId: req.user._id }).sort({ dateRequested: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get all requests (Staff)
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('studentId', 'name email')
      .sort({ dateRequested: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update request status (Staff)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'processing', 'completed', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.dateProcessed = Date.now();
    request.processedBy = req.user._id;
    await request.save();

    // Notify the student
    await Notification.create({
      user: request.studentId,
      title: `Request ${status}`,
      message: `Your request for ${request.documentType} has been ${status}.`,
      type: status === 'rejected' ? 'warning' : 'info',
    });

    res.json({ message: 'Status updated successfully', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus };