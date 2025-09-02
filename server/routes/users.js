const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    res.json({
      success: true,
      data: user,
      message: 'פרופיל המשתמש נטען בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Update user profile
router.put('/profile', [
  auth,
  body('firstName').optional().isString().trim().isLength({ min: 2, max: 50 }).withMessage('השם הפרטי חייב להכיל בין 2 ל-50 תווים'),
  body('lastName').optional().isString().trim().isLength({ min: 2, max: 50 }).withMessage('שם המשפחה חייב להכיל בין 2 ל-50 תווים'),
  body('phone').optional().matches(/^05\d{8}$/).withMessage('מספר טלפון לא תקין (05X-XXXXXXX)'),
  body('dateOfBirth').optional().isISO8601().withMessage('תאריך לידה לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const userId = req.user.userId;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;
    delete updateData.isActive;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    res.json({
      success: true,
      data: user,
      message: 'הפרופיל עודכן בהצלחה'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Change password
router.put('/change-password', [
  auth,
  body('currentPassword').isString().isLength({ min: 6 }).withMessage('הסיסמה הנוכחית נדרשת'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('הסיסמה החדשה חייבת להכיל לפחות 6 תווים'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('הסיסמה החדשה לא תואמת לאישור');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'הסיסמה הנוכחית שגויה' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'הסיסמה שונתה בהצלחה'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Appointment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          upcomingAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          }
        }
      }
    ]);

    const user = await User.findById(userId).select('firstName lastName email phone gender dateOfBirth createdAt');
    
    const userStats = {
      user,
      appointments: stats[0] || {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        upcomingAppointments: 0
      }
    };

    res.json({
      success: true,
      data: userStats,
      message: 'הסטטיסטיקות נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Deactivate account
router.delete('/account', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    // Check if user has active appointments
    const activeAppointments = await Appointment.find({
      user: userId,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (activeAppointments.length > 0) {
      return res.status(400).json({ 
        message: 'לא ניתן לסגור את החשבון כאשר יש תורים פעילים',
        activeAppointments: activeAppointments.length
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'החשבון נסגר בהצלחה'
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Reactivate account (admin only)
router.put('/:id/reactivate', [
  auth,
  param('id').isMongoId().withMessage('מזהה משתמש לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const adminId = req.user.userId;
    const targetUserId = req.params.id;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { isActive: true },
      { new: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    res.json({
      success: true,
      data: user,
      message: 'החשבון הופעל מחדש בהצלחה'
    });
  } catch (error) {
    console.error('Error reactivating account:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const adminId = req.user.userId;
    
    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });
    }

    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      message: 'כל המשתמשים נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

module.exports = router;
