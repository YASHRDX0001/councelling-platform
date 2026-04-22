const express = require('express');
const MentorApplication = require('../models/MentorApplication');
const User = require('../models/User');
const College = require('../models/College');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/mentors/apply - Apply to become a mentor
router.post('/apply', authenticate, async (req, res) => {
  try {
    const { collegeId, experience } = req.body;

    if (!collegeId || !experience) {
      return res.status(400).json({ message: 'College and experience are required' });
    }

    // Verify college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Check for existing application
    const existing = await MentorApplication.findOne({
      user: req.user._id,
      college: collegeId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this college' });
    }

    const application = await MentorApplication.create({
      user: req.user._id,
      college: collegeId,
      experience,
    });

    await application.populate(['user', 'college']);

    res.status(201).json({ application });
  } catch (error) {
    console.error('Mentor apply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/mentors/college/:collegeId - Get approved mentors for a college
router.get('/college/:collegeId', async (req, res) => {
  try {
    const mentors = await User.find({
      mentorColleges: req.params.collegeId,
      role: 'mentor',
    }).select('name email avatar bio phone whatsapp');

    res.json({ mentors });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/mentors/applications - List all applications (Admin)
router.get('/applications', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const applications = await MentorApplication.find(query)
      .populate('user', 'name email avatar')
      .populate('college', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/mentors/applications/:id - Approve/reject application (Admin)
router.put('/applications/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const application = await MentorApplication.findById(req.params.id)
      .populate('user')
      .populate('college');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // If approved, update user role and add college to mentorColleges
    if (status === 'approved') {
      const user = await User.findById(application.user._id);
      user.role = 'mentor';
      if (!user.mentorColleges.includes(application.college._id)) {
        user.mentorColleges.push(application.college._id);
      }
      await user.save();
    }

    // If rejected and user has no other approved mentor apps, revert role
    if (status === 'rejected') {
      const otherApproved = await MentorApplication.countDocuments({
        user: application.user._id,
        status: 'approved',
        _id: { $ne: application._id },
      });
      if (otherApproved === 0) {
        const user = await User.findById(application.user._id);
        if (user.role === 'mentor') {
          user.role = 'student';
          user.mentorColleges = user.mentorColleges.filter(
            (c) => !c.equals(application.college._id)
          );
          await user.save();
        }
      }
    }

    res.json({ application });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/mentors/my-applications - Get current user's applications
router.get('/my-applications', authenticate, async (req, res) => {
  try {
    const applications = await MentorApplication.find({ user: req.user._id })
      .populate('college', 'name slug image')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
