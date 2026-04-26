// backend/routes/staffRoutes.js
const express = require('express');
const router = express.Router();
// ✅ Correct imports
const { authenticate, isStaff } = require('../middleware/authMiddleware');
// Aliases for readability
const protect = authenticate;
const staffOnly = isStaff;

// Import your staff controller functions (create this file if missing)
const { getStats, getAllStudents, updateRequestStatus, getDashboardData } = require('../controllers/staffController');

// Example routes – adjust to match your actual endpoints
router.get('/stats', protect, staffOnly, getStats);
router.get('/students', protect, staffOnly, getAllStudents);
router.get('/dashboard', protect, staffOnly, getDashboardData);
router.put('/request/:id', protect, staffOnly, updateRequestStatus);

module.exports = router;