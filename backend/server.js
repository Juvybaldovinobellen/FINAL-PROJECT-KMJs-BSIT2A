const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const staffRoutes = require('./routes/staffRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', (req, res, next) => {
  console.log("TEST ROUTE HIT");
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/staff', staffRoutes);

// ✅ ADD THIS TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is connected!', 
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BU Transakto API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('\n✅ Available endpoints:');
  console.log('   GET    /');
  console.log('   GET    /api/test');  // ← BAGONG ENDPOINT
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
});