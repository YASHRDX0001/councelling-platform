const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { authenticate, generateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: user.toJSON(), token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error during login' });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: user.toJSON(), token });
  })(req, res, next);
});

// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Admin-specific routes
// POST /api/auth/admin/login (password only)
router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let settings = await Settings.findOne();
    // Fallback to admin user if Settings doesn't exist yet (first run)
    if (!settings) {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        return res.status(500).json({ message: 'Admin not initialized. Please run seed script.' });
      }
      const isMatch = await adminUser.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid admin password' });
      
      const token = generateToken(adminUser._id);
      return res.json({ user: adminUser, token, isAdmin: true });
    }

    const isMatch = await settings.compareAdminPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    // Find the admin user to generate a valid token
    const adminUser = await User.findOne({ role: 'admin' });
    const token = generateToken(adminUser._id);

    res.json({ user: adminUser, token, isAdmin: true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// POST /api/auth/admin/change-password
router.post('/admin/change-password', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ adminPassword: newPassword });
    } else {
      settings.adminPassword = newPassword;
    }
    await settings.save();

    // Also update the admin user's password to keep them in sync
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      adminUser.password = newPassword;
      await adminUser.save();
    }

    res.json({ message: 'Admin password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password update' });
  }
});

module.exports = router;
