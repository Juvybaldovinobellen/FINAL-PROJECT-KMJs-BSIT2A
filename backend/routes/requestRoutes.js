const express = require('express');
const router = express.Router();
const { authenticate, isStaff } = require('../middleware/authMiddleware');
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus } = require('../controllers/requestController');
const Request = require('../models/Request'); 

// Alias for convenience
const protect = authenticate;
const staffOnly = isStaff;

// Student routes
router.post('/', protect, createRequest);
router.get('/myrequests', protect, getMyRequests);

// Staff only routes
router.get('/all', protect, staffOnly, getAllRequests);
router.put('/:id/status', protect, staffOnly, updateRequestStatus);

// Update a request – owner student (if pending) OR staff
router.put('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner = request.studentId.toString() === req.user._id.toString();
    const isStaffUser = req.user.role === 'staff';

    // Authorization
    if (!isOwner && !isStaffUser) {
      return res.status(403).json({ message: 'Not authorized to edit this request' });
    }
    if (isOwner && request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit a request that is already ' + request.status });
    }

    const allowedUpdates = ['documentType', 'purpose', 'notes', 'copies', 'semesterYear'];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const updatedRequest = await Request.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a request – owner student (if pending) OR staff
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner = request.studentId.toString() === req.user._id.toString();
    const isStaffUser = req.user.role === 'staff';

    if (!isOwner && !isStaffUser) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }
    if (isOwner && request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete a request that is already ' + request.status });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;