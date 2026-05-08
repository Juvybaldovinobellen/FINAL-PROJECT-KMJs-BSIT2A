// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, isStaff } = require('../middleware/authMiddleware');
const { 
  getNotifications, 
  markAsRead, 
  markAsUnread, 
  markAllAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');

const protect = authenticate;
const staffOnly = isStaff;

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/unread', protect, markAsUnread);  
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;