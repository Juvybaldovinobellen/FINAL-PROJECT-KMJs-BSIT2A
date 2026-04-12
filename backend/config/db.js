const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS servers for better Atlas connection
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    console.log('🟡 Connecting to MongoDB Atlas...');
    console.log('⏳ This may take up to 30 seconds...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📡 Host: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Atlas Error:', err.message);
    console.log('\n🔧 FIX THESE ISSUES:');
    console.log('   1. Go to MongoDB Atlas → Network Access');
    console.log('   2. Click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)');
    console.log('   3. Click Confirm and WAIT 2 MINUTES');
    console.log('   4. Check your password has no special characters (@, #, $, etc.)');
    console.log('   5. Try using mobile hotspot if on school WiFi\n');
    
    // Don't exit - let server run
    console.log('⚠️ Running without database - some features will not work');
  }
};

module.exports = connectDB;