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
app.use(cors());
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
});app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/staff', staffRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BU Transakto API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 Server running on port ${PORT}');
  console.log('\n✅ Available endpoints:');
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
