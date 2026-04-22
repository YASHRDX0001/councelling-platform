const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Get own profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('mentorColleges', 'name slug image');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile - Update own profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, bio, whatsapp, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (whatsapp !== undefined) user.whatsapp = whatsapp;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/mentor/:id - Get mentor's public profile
router.get('/mentor/:id', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id)
      .select('name email avatar bio phone whatsapp mentorColleges')
      .populate('mentorColleges', 'name slug image');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes for mentor management
// GET /api/users/admin/mentors - Get all mentors (Admin only)
router.get('/admin/mentors', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const mentors = await User.find({ role: 'mentor' })
      .select('name email avatar bio phone whatsapp mentorColleges isSpecial')
      .populate('mentorColleges', 'name slug');
    res.json({ mentors });
  } catch (error) {
    console.error('List mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/admin/mentors - Create a new mentor (Admin only)
router.post('/admin/mentors', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name, email, password, bio, phone, whatsapp, mentorColleges, isSpecial } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const mentor = await User.create({
      name,
      email,
      password,
      role: 'mentor',
      bio,
      phone,
      whatsapp,
      mentorColleges,
      isSpecial: !!isSpecial
    });

    res.status(201).json({ mentor: mentor.toJSON() });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/admin/mentors/:id - Delete a mentor (Admin only)
router.delete('/admin/mentors/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/special-mentors - Public featured mentors
router.get('/special-mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', isSpecial: true })
      .select('name email avatar bio phone whatsapp mentorColleges')
      .populate('mentorColleges', 'name slug');
    res.json({ mentors });
  } catch (error) {
    console.error('List special mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/admin/mentors/:id/special - Toggle special status (Admin only)
router.patch('/admin/mentors/:id/special', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { isSpecial } = req.body;
    const mentor = await User.findByIdAndUpdate(req.params.id, { isSpecial }, { new: true });
    res.json({ mentor });
  } catch (error) {
    console.error('Toggle special status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes for professor management
// GET /api/users/admin/professors - Get all professors (Admin only)
router.get('/admin/professors', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const professors = await User.find({ role: 'professor' })
      .select('name email avatar bio phone whatsapp mentorColleges isSpecial')
      .populate('mentorColleges', 'name slug');
    res.json({ professors });
  } catch (error) {
    console.error('List professors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/admin/professors - Create a new professor (Admin only)
router.post('/admin/professors', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name, email, password, bio, phone, whatsapp, mentorColleges, isSpecial } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const professor = await User.create({
      name,
      email,
      password,
      role: 'professor',
      bio,
      phone,
      whatsapp,
      mentorColleges,
      isSpecial: !!isSpecial
    });

    res.status(201).json({ professor: professor.toJSON() });
  } catch (error) {
    console.error('Create professor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/admin/professors/:id - Delete a professor (Admin only)
router.delete('/admin/professors/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    console.error('Delete professor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
