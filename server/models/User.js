const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'השם הפרטי נדרש'],
    trim: true,
    minlength: [2, 'השם הפרטי חייב להכיל לפחות 2 תווים'],
    maxlength: [50, 'השם הפרטי לא יכול להכיל יותר מ-50 תווים']
  },
  lastName: {
    type: String,
    required: [true, 'שם המשפחה נדרש'],
    trim: true,
    minlength: [2, 'שם המשפחה חייב להכיל לפחות 2 תווים'],
    maxlength: [50, 'שם המשפחה לא יכול להכיל יותר מ-50 תווים']
  },
  email: {
    type: String,
    required: [true, 'כתובת האימייל נדרשת'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'כתובת אימייל לא תקינה']
  },
  phone: {
    type: String,
    required: [true, 'מספר הטלפון נדרש'],
    match: [/^05\d{8}$/, 'מספר טלפון לא תקין (05X-XXXXXXX)']
  },
  gender: {
    type: String,
    required: [true, 'בחירת מגדר נדרשת'],
    enum: {
      values: ['male', 'female'],
      message: 'המגדר חייב להיות זכר או נקבה'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'תאריך הלידה נדרש']
  },
  password: {
    type: String,
    required: [true, 'הסיסמה נדרשת'],
    minlength: [6, 'הסיסמה חייבת להכיל לפחות 6 תווים']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
