const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentNumber: { type: String },
  documentType: { 
    type: String, 
    enum: ['Transcript of Records (TOR)', 'Certificate of Grades', 'Certificate of Registration', 'Certificate of Enrollment', 'Good Moral Certificate', 'Diploma', 'Copy of Grades', 'Honorable Dismissal', 'Certification of Units Earned', 'Others'],
    required: true 
  },
  purpose: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'rejected'], 
    default: 'pending' 
  },
  dateRequested: { type: Date, default: Date.now },
  dateProcessed: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Request', requestSchema);