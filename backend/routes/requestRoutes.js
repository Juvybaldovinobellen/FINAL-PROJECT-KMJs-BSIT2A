const express = require('express');
const router = express.Router();
const { authenticate, isStaff } = require('../middleware/authMiddleware');
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus } = require('../controllers/requestController');

// Alias for convenience
const protect = authenticate;
const staffOnly = isStaff;

// Student routes
router.post('/', protect, createRequest);
router.get('/myrequests', protect, getMyRequests);

// Staff only routes
router.get('/all', protect, staffOnly, getAllRequests);
router.put('/:id/status', protect, staffOnly, updateRequestStatus);

module.exports = router;