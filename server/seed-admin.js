// Seed script to create an admin user
// Run: node seed-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Settings = require('./models/Settings');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@campusconnect.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      // Update role to admin if not already
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`✅ Updated ${ADMIN_EMAIL} to admin role`);
      } else {
        console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
      }
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`✅ Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }

    // Initialize Settings for password-only login
    const settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({ adminPassword: ADMIN_PASSWORD });
      console.log(`✅ Admin settings initialized with default password`);
    } else {
      console.log(`ℹ️  Admin settings already exist`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
