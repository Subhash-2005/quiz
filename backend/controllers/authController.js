const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );
};

// ==========================
// REGISTER USER
// ==========================
const register = async (req, res) => {
  console.log("REGISTER BODY:", req.body); // 🔍 DEBUG

  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("VALIDATION ERRORS:", errors.array()); // 🔍 DEBUG
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    console.log("CHECKING USER:", username, email); // 🔍 DEBUG

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log("USER ALREADY EXISTS"); // 🔍 DEBUG
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    console.log("ABOUT TO SAVE USER"); // 🔍 DEBUG
    await user.save();
    console.log("USER SAVED SUCCESSFULLY:", user._id); // 🔍 DEBUG

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
};

// ==========================
// LOGIN USER
// ==========================
const login = async (req, res) => {
  console.log("LOGIN BODY:", req.body); // 🔍 DEBUG

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("LOGIN VALIDATION ERRORS:", errors.array()); // 🔍 DEBUG
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
};

// ==========================
// GET PROFILE
// ==========================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// ==========================
// UPDATE PROFILE
// ==========================
const updateProfile = async (req, res) => {
  try {
    const { bio, favoriteTopics, difficultyPreference } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData['profile.bio'] = bio;
    if (favoriteTopics !== undefined)
      updateData['preferences.favoriteTopics'] = favoriteTopics;
    if (difficultyPreference !== undefined)
      updateData['preferences.difficultyPreference'] = difficultyPreference;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
