const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const settingsSchema = new mongoose.Schema({
  adminPassword: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
settingsSchema.pre('save', async function (next) {
  if (!this.isModified('adminPassword')) return next();
  const salt = await bcrypt.genSalt(12);
  this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
  next();
});

// Compare password method
settingsSchema.methods.compareAdminPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.adminPassword);
};

module.exports = mongoose.model('Settings', settingsSchema);
