const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'אין הרשאת גישה, נדרש טוקן'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({
      _id: decoded.userId,
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        message: 'הטוקן לא תקין'
      });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'הטוקן לא תקין'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'הטוקן פג תוקף'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'שגיאה בשרת',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = auth;
