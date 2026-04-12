const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { getAllStudents, getDashboardStats, updateStudent, deleteStudent } = require('../controllers/staffController');

router.get('/students', protect, staffOnly, getAllStudents);
router.get('/stats', protect, staffOnly, getDashboardStats);
router.put('/students/:id', protect, staffOnly, updateStudent);
router.delete('/students/:id', protect, staffOnly, deleteStudent);

module.exports = router;