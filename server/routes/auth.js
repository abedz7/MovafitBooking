const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('השם הפרטי חייב להכיל בין 2 ל-50 תווים'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('שם המשפחה חייב להכיל בין 2 ל-50 תווים'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('כתובת אימייל לא תקינה'),
  body('phone')
    .matches(/^05\d{8}$/)
    .withMessage('מספר טלפון לא תקין (05X-XXXXXXX)'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('המגדר חייב להיות זכר או נקבה'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('תאריך לידה לא תקין'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('הסיסמה חייבת להכיל לפחות 6 תווים')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'שגיאות אימות',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: 'כתובת האימייל כבר קיימת במערכת'
        });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({
          message: 'מספר הטלפון כבר קיים במערכת'
        });
      }
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password) and token
    res.status(201).json({
      message: 'המשתמש נרשם בהצלחה',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'המשתמש כבר קיים במערכת'
      });
    }

    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('כתובת אימייל לא תקינה'),
  body('password')
    .notEmpty()
    .withMessage('הסיסמה נדרשת')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'שגיאות אימות',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        message: 'פרטי התחברות שגויים'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'פרטי התחברות שגויים'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'התחברת בהצלחה',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'המשתמש לא נמצא'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('השם הפרטי חייב להכיל בין 2 ל-50 תווים'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('שם המשפחה חייב להכיל בין 2 ל-50 תווים'),
  body('phone')
    .optional()
    .matches(/^05\d{8}$/)
    .withMessage('מספר טלפון לא תקין (05X-XXXXXXX)'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('תאריך לידה לא תקין')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'שגיאות אימות',
        errors: errors.array()
      });
    }

    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth'];
    
    // Filter out invalid updates
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Check if phone is already taken by another user
    if (filteredUpdates.phone) {
      const existingUser = await User.findOne({
        phone: filteredUpdates.phone,
        _id: { $ne: req.user.userId }
      });
      
      if (existingUser) {
        return res.status(400).json({
          message: 'מספר הטלפון כבר קיים במערכת'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'המשתמש לא נמצא'
      });
    }

    res.json({
      message: 'הפרופיל עודכן בהצלחה',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword')
    .notEmpty()
    .withMessage('הסיסמה הנוכחית נדרשת'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('הסיסמה החדשה חייבת להכיל לפחות 6 תווים')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'שגיאות אימות',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: 'המשתמש לא נמצא'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'הסיסמה הנוכחית שגויה'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'הסיסמה שונתה בהצלחה'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'המשתמש לא נמצא'
      });
    }

    res.json({
      message: 'החשבון בוטל בהצלחה'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
