const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Prevent duplicate applications
mentorApplicationSchema.index({ user: 1, college: 1 }, { unique: true });

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema);
