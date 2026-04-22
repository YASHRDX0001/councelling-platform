const express = require('express');
const College = require('../models/College');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/colleges - List all colleges
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const colleges = await College.find(query).sort({ createdAt: -1 });
    res.json({ colleges });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/colleges/:slug - Get single college
router.get('/:slug', async (req, res) => {
  try {
    const college = await College.findOne({ slug: req.params.slug });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Get mentors and professors for this college
    const [mentors, professors] = await Promise.all([
      User.find({
        mentorColleges: college._id,
        role: 'mentor',
      }).select('name email avatar bio phone whatsapp'),
      User.find({
        mentorColleges: college._id,
        role: 'professor',
      }).select('name email avatar bio phone whatsapp'),
    ]);

    res.json({ college, mentors, professors });
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/colleges - Create a college (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, location, image, registrationLink, tags, ranking, fees, website } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: 'Name, description, and location are required' });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existing = await College.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A college with a similar name already exists' });
    }

    const college = await College.create({
      name,
      slug,
      description,
      location,
      image,
      registrationLink,
      tags: tags || [],
      ranking,
      fees,
      website,
      addedBy: req.user._id,
    });

    res.status(201).json({ college });
  } catch (error) {
    console.error('Create college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/colleges/:id - Update a college (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, location, image, registrationLink, tags, ranking, fees, website } = req.body;

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Update fields
    if (name) {
      college.name = name;
      college.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description) college.description = description;
    if (location) college.location = location;
    if (image !== undefined) college.image = image;
    if (registrationLink !== undefined) college.registrationLink = registrationLink;
    if (tags) college.tags = tags;
    if (ranking !== undefined) college.ranking = ranking;
    if (fees !== undefined) college.fees = fees;
    if (website !== undefined) college.website = website;

    await college.save();
    res.json({ college });
  } catch (error) {
    console.error('Update college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/colleges/:id - Delete a college (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Remove college from mentor's mentorColleges arrays
    await User.updateMany(
      { mentorColleges: college._id },
      { $pull: { mentorColleges: college._id } }
    );

    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
