// server.js
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// ✅ Import authentication middleware (matches your file name)
const { authenticate, isStaff } = require('./middleware/authMiddleware');

// ✅ Body parser middleware (must be before routes)
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Controllers
const { submitFeedback, getAllFeedback } = require('./controllers/feedbackController');

// ========== PUBLIC ROUTES ==========
app.get('/api/status', (req, res) => {
    res.json({ message: 'BU Transakto API is running!' });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is connected!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// ========== FEEDBACK ROUTES ==========
// POST – anyone can submit feedback (or add authenticate if you want only logged-in users)
app.post('/api/feedback', submitFeedback);
// GET – only staff can view all feedback
app.get('/api/feedback', authenticate, isStaff, getAllFeedback);

// ========== API ROUTE GROUPS ==========
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/feedback', require('./routes/feedbackRoutes'));// Optional: if you have a feedback routes file with more endpoints, uncomment next line
// app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Serve static frontend files
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// (Optional) Fallback to index.html for client‑side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ========== ERROR HANDLING MIDDLEWARE (must be last) ==========
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log('\n✅ Available endpoints:');
    console.log('   GET    /');
    console.log('   GET    /api/test');
    console.log('   POST   /api/auth/register');
    console.log('   POST   /api/auth/login');
    console.log('   GET    /api/auth/me');
    console.log('   POST   /api/requests');
    console.log('   GET    /api/requests/myrequests');
    console.log('   GET    /api/requests/all (Staff only)');
    console.log('   PUT    /api/requests/:id/status (Staff only)');
    console.log('   GET    /api/staff/stats (Staff only)');
    console.log('   GET    /api/staff/students (Staff only)');
    console.log('   GET    /api/users (Staff only)');
    console.log('   POST   /api/feedback');
    console.log('   GET    /api/feedback (Staff only)');
});