const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם החבילה נדרש'],
    trim: true,
    maxlength: [100, 'שם החבילה לא יכול להכיל יותר מ-100 תווים']
  },
  description: {
    type: String,
    required: [true, 'תיאור החבילה נדרש'],
    maxlength: [500, 'תיאור החבילה לא יכול להכיל יותר מ-500 תווים']
  },
  numberOfSessions: {
    type: Number,
    required: [true, 'מספר הטיפולים נדרש'],
    min: [1, 'מספר הטיפולים חייב להיות לפחות 1'],
    max: [50, 'מספר הטיפולים לא יכול להיות יותר מ-50']
  },
  price: {
    type: Number,
    required: [true, 'מחיר החבילה נדרש'],
    min: [0, 'מחיר החבילה לא יכול להיות שלילי']
  },
  originalPrice: {
    type: Number,
    min: [0, 'המחיר המקורי לא יכול להיות שלילי']
  },
  discount: {
    type: Number,
    min: [0, 'ההנחה לא יכולה להיות שלילית'],
    max: [100, 'ההנחה לא יכולה להיות יותר מ-100%']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String,
    maxlength: [200, 'כל תכונה לא יכולה להכיל יותר מ-200 תווים']
  }],
  validityDays: {
    type: Number,
    default: 365,
    min: [1, 'תוקף החבילה חייב להיות לפחות יום אחד']
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'both'],
      message: 'המגדר חייב להיות זכר, נקבה או שניהם'
    },
    default: 'both'
  },
  category: {
    type: String,
    required: [true, 'קטגוריית החבילה נדרשת'],
    enum: {
      values: ['basic', 'premium', 'vip', 'special'],
      message: 'קטגוריית החבילה חייבת להיות בסיסית, פרימיום, VIP או מיוחדת'
    }
  },
  maxBookingsPerDay: {
    type: Number,
    default: 1,
    min: [1, 'מספר ההזמנות המקסימלי ליום חייב להיות לפחות 1']
  },
  requiresConsultation: {
    type: Boolean,
    default: false
  },
  consultationPrice: {
    type: Number,
    min: [0, 'מחיר הייעוץ לא יכול להיות שלילי']
  },
  image: {
    type: String,
    maxlength: [500, 'URL התמונה לא יכול להכיל יותר מ-500 תווים']
  },
  terms: {
    type: String,
    maxlength: [1000, 'תנאי החבילה לא יכולים להכיל יותר מ-1000 תווים']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
packageSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for savings amount
packageSchema.virtual('savingsAmount').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Virtual for savings percentage
packageSchema.virtual('savingsPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for price per session
packageSchema.virtual('pricePerSession').get(function() {
  if (this.numberOfSessions > 0) {
    return Math.round(this.price / this.numberOfSessions);
  }
  return 0;
});

// Virtual for category in Hebrew
packageSchema.virtual('categoryHebrew').get(function() {
  const categoryMap = {
    'basic': 'בסיסית',
    'premium': 'פרימיום',
    'vip': 'VIP',
    'special': 'מיוחדת'
  };
  return categoryMap[this.category] || this.category;
});

// Virtual for gender in Hebrew
packageSchema.virtual('genderHebrew').get(function() {
  const genderMap = {
    'male': 'גברים',
    'female': 'נשים',
    'both': 'כולם'
  };
  return genderMap[this.gender] || this.gender;
});

// Indexes for better query performance
packageSchema.index({ isActive: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ gender: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ isPopular: 1 });

// Pre-save middleware to calculate discount if original price is set
packageSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Static method to get active packages
packageSchema.statics.getActivePackages = function(gender = null) {
  let query = { isActive: true };
  
  if (gender && gender !== 'both') {
    query.$or = [
      { gender: gender },
      { gender: 'both' }
    ];
  }
  
  return this.find(query).sort({ price: 1 });
};

// Static method to get popular packages
packageSchema.statics.getPopularPackages = function(gender = null) {
  let query = { isActive: true, isPopular: true };
  
  if (gender && gender !== 'both') {
    query.$or = [
      { gender: gender },
      { gender: 'both' }
    ];
  }
  
  return this.find(query).sort({ price: 1 });
};

// Static method to get packages by category
packageSchema.statics.getPackagesByCategory = function(category, gender = null) {
  let query = { isActive: true, category: category };
  
  if (gender && gender !== 'both') {
    query.$or = [
      { gender: gender },
      { gender: 'both' }
    ];
  }
  
  return this.find(query).sort({ price: 1 });
};

module.exports = mongoose.model('Package', packageSchema);
