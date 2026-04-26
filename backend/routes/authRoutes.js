// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', registerUser);   // ✅ now matches export
router.post('/login', loginUser);         // ✅ now matches export
router.get('/me', authenticate, getMe);   // ✅ getMe works

module.exports = router;