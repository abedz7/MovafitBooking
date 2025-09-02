const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Package = require('../models/Package');
const auth = require('../middleware/auth');

const router = express.Router();

// Get available slots for a specific date and gender
router.get('/available-slots', [
  query('date').isISO8601().withMessage('תאריך לא תקין'),
  query('gender').isIn(['male', 'female']).withMessage('מגדר חייב להיות זכר או נקבה')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { date, gender } = req.query;
    const availableSlots = await Appointment.getAvailableSlots(new Date(date), gender);
    
    res.json({
      success: true,
      data: availableSlots,
      message: 'הזמנים הזמינים נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Book a new appointment
router.post('/book', [
  auth,
  body('date').isISO8601().withMessage('תאריך לא תקין'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('פורמט שעה לא תקין (HH:MM)'),
  body('gender').isIn(['male', 'female']).withMessage('מגדר חייב להיות זכר או נקבה'),
  body('type').isIn(['single', 'package']).withMessage('סוג הטיפול חייב להיות יחיד או חבילה'),
  body('package').optional().isMongoId().withMessage('מזהה חבילה לא תקין'),
  body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('הערות לא יכולות להכיל יותר מ-500 תווים')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { date, time, gender, type, package: packageId, notes } = req.body;
    const userId = req.user.userId;

    // Check if slot is available
    const isSlotAvailable = await Appointment.isSlotAvailable(new Date(date), time, gender);
    if (!isSlotAvailable) {
      return res.status(400).json({ message: 'הזמן הזה לא זמין, אנא בחר זמן אחר' });
    }

    // Validate package if type is package
    if (type === 'package' && packageId) {
      const packageDoc = await Package.findById(packageId);
      if (!packageDoc || !packageDoc.isActive) {
        return res.status(400).json({ message: 'החבילה לא נמצאה או לא פעילה' });
      }
      
      if (packageDoc.gender !== 'both' && packageDoc.gender !== gender) {
        return res.status(400).json({ message: 'החבילה לא מתאימה למגדר שלך' });
      }
    }

    // Create appointment
    const appointment = new Appointment({
      user: userId,
      date: new Date(date),
      time,
      gender,
      type,
      package: type === 'package' ? packageId : undefined,
      notes
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'התור נקבע בהצלחה'
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get user's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await Appointment.find({ user: userId })
      .populate('package', 'name description numberOfSessions')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      data: appointments,
      message: 'התורים נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', [
  auth,
  param('id').isMongoId().withMessage('מזהה תור לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const appointmentId = req.params.id;
    const userId = req.user.userId;

    const appointment = await Appointment.findOne({ _id: appointmentId, user: userId });
    if (!appointment) {
      return res.status(404).json({ message: 'התור לא נמצא' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'התור כבר בוטל' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'לא ניתן לבטל תור שכבר הושלם' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      data: appointment,
      message: 'התור בוטל בהצלחה'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Reschedule appointment
router.put('/:id/reschedule', [
  auth,
  param('id').isMongoId().withMessage('מזהה תור לא תקין'),
  body('date').isISO8601().withMessage('תאריך לא תקין'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('פורמט שעה לא תקין (HH:MM)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const appointmentId = req.params.id;
    const userId = req.user.userId;
    const { date, time } = req.body;

    const appointment = await Appointment.findOne({ _id: appointmentId, user: userId });
    if (!appointment) {
      return res.status(404).json({ message: 'התור לא נמצא' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'לא ניתן לשנות תור שבוטל' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'לא ניתן לשנות תור שכבר הושלם' });
    }

    // Check if new slot is available
    const isSlotAvailable = await Appointment.isSlotAvailable(new Date(date), time, appointment.gender);
    if (!isSlotAvailable) {
      return res.status(400).json({ message: 'הזמן הזה לא זמין, אנא בחר זמן אחר' });
    }

    appointment.date = new Date(date);
    appointment.time = time;
    await appointment.save();

    res.json({
      success: true,
      data: appointment,
      message: 'התור שונה בהצלחה'
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get appointment details
router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('מזהה תור לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const appointmentId = req.params.id;
    const userId = req.user.userId;

    const appointment = await Appointment.findOne({ _id: appointmentId, user: userId })
      .populate('package', 'name description numberOfSessions price');

    if (!appointment) {
      return res.status(404).json({ message: 'התור לא נמצא' });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'פרטי התור נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

module.exports = router;
