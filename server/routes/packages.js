const express = require('express');
const { query, param, validationResult } = require('express-validator');
const Package = require('../models/Package');

const router = express.Router();

// Get all active packages
router.get('/', [
  query('gender').optional().isIn(['male', 'female', 'both']).withMessage('מגדר חייב להיות זכר, נקבה או שניהם'),
  query('category').optional().isIn(['basic', 'premium', 'vip', 'special']).withMessage('קטגוריה לא תקינה'),
  query('popular').optional().isBoolean().withMessage('פופולרי חייב להיות true או false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { gender, category, popular } = req.query;
    let filter = { isActive: true };

    if (gender && gender !== 'both') {
      filter.$or = [
        { gender: 'both' },
        { gender: gender }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (popular === 'true') {
      filter.isPopular = true;
    }

    const packages = await Package.find(filter)
      .sort({ price: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: packages,
      message: 'החבילות נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get popular packages
router.get('/popular', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true, isPopular: true })
      .sort({ price: 1 })
      .limit(6)
      .select('-__v');

    res.json({
      success: true,
      data: packages,
      message: 'החבילות הפופולריות נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching popular packages:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get packages by category
router.get('/category/:category', [
  param('category').isIn(['basic', 'premium', 'vip', 'special']).withMessage('קטגוריה לא תקינה')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { category } = req.params;
    const { gender } = req.query;

    let filter = { isActive: true, category };
    
    if (gender && gender !== 'both') {
      filter.$or = [
        { gender: 'both' },
        { gender: gender }
      ];
    }

    const packages = await Package.find(filter)
      .sort({ price: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: packages,
      message: `החבילות בקטגוריה ${category} נטענו בהצלחה`
    });
  } catch (error) {
    console.error('Error fetching packages by category:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get package details
router.get('/:id', [
  param('id').isMongoId().withMessage('מזהה חבילה לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const packageId = req.params.id;
    const packageDoc = await Package.findById(packageId).select('-__v');

    if (!packageDoc) {
      return res.status(404).json({ message: 'החבילה לא נמצאה' });
    }

    if (!packageDoc.isActive) {
      return res.status(400).json({ message: 'החבילה לא פעילה' });
    }

    res.json({
      success: true,
      data: packageDoc,
      message: 'פרטי החבילה נטענו בהצלחה'
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Search packages
router.get('/search', [
  query('q').isString().trim().isLength({ min: 2 }).withMessage('חיפוש חייב להכיל לפחות 2 תווים')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { q } = req.query;
    const searchRegex = new RegExp(q, 'i');

    const packages = await Package.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { features: searchRegex }
      ]
    })
    .sort({ price: 1 })
    .limit(10)
    .select('-__v');

    res.json({
      success: true,
      data: packages,
      message: `נמצאו ${packages.length} חבילות עבור "${q}"`
    });
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Get package comparison
router.post('/compare', [
  body('packageIds').isArray({ min: 2, max: 4 }).withMessage('יש לבחור בין 2 ל-4 חבילות להשוואה'),
  body('packageIds.*').isMongoId().withMessage('מזהה חבילה לא תקין')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'נתונים לא תקינים', errors: errors.array() });
    }

    const { packageIds } = req.body;
    const packages = await Package.find({
      _id: { $in: packageIds },
      isActive: true
    })
    .select('-__v')
    .sort({ price: 1 });

    if (packages.length !== packageIds.length) {
      return res.status(400).json({ message: 'חלק מהחבילות לא נמצאו' });
    }

    res.json({
      success: true,
      data: packages,
      message: 'ההשוואה נטענה בהצלחה'
    });
  } catch (error) {
    console.error('Error comparing packages:', error);
    res.status(500).json({ 
      message: 'שגיאה בשרת', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

module.exports = router;
