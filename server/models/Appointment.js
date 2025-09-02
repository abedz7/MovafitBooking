const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'המשתמש נדרש']
  },
  date: {
    type: Date,
    required: [true, 'תאריך התור נדרש']
  },
  time: {
    type: String,
    required: [true, 'שעת התור נדרשת'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'פורמט שעה לא תקין (HH:MM)']
  },
  gender: {
    type: String,
    required: [true, 'מגדר נדרש'],
    enum: {
      values: ['male', 'female'],
      message: 'המגדר חייב להיות זכר או נקבה'
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    required: [true, 'סוג הטיפול נדרש'],
    enum: {
      values: ['single', 'package'],
      message: 'סוג הטיפול חייב להיות יחיד או חבילה'
    }
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: function() {
      return this.type === 'package';
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'ההערות לא יכולות להכיל יותר מ-500 תווים']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  cancellationReason: {
    type: String,
    maxlength: [200, 'סיבת הביטול לא יכולה להכיל יותר מ-200 תווים']
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  rescheduledTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  if (!this.date || !this.time) return null;
  
  const [hours, minutes] = this.time.split(':');
  const appointmentDate = new Date(this.date);
  appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return appointmentDate;
});

// Virtual for isPast
appointmentSchema.virtual('isPast').get(function() {
  if (!this.appointmentDateTime) return false;
  return this.appointmentDateTime < new Date();
});

// Virtual for isToday
appointmentSchema.virtual('isToday').get(function() {
  if (!this.date) return false;
  const today = new Date();
  const appointmentDate = new Date(this.date);
  return today.toDateString() === appointmentDate.toDateString();
});

// Virtual for isUpcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  if (!this.appointmentDateTime) return false;
  return this.appointmentDateTime > new Date();
});

// Virtual for status in Hebrew
appointmentSchema.virtual('statusHebrew').get(function() {
  const statusMap = {
    'scheduled': 'נקבע',
    'confirmed': 'אושר',
    'completed': 'הושלם',
    'cancelled': 'בוטל',
    'no-show': 'לא הופיע'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for type in Hebrew
appointmentSchema.virtual('typeHebrew').get(function() {
  const typeMap = {
    'single': 'טיפול יחיד',
    'package': 'חבילת טיפולים'
  };
  return typeMap[this.type] || this.type;
});

// Indexes for better query performance
appointmentSchema.index({ user: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ time: 1 });
appointmentSchema.index({ gender: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ type: 1 });
appointmentSchema.index({ 'appointmentDateTime': 1 });

// Compound index for unique appointments
appointmentSchema.index({ date: 1, time: 1, gender: 1 }, { unique: true });

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isModified('time')) {
    const appointmentDate = this.appointmentDateTime;
    const now = new Date();
    
    // Check if appointment is in the past
    if (appointmentDate < now) {
      return next(new Error('לא ניתן לקבוע תור בעבר'));
    }
    
    // Check if appointment is within business hours (8:00-20:00)
    const hour = appointmentDate.getHours();
    if (hour < 8 || hour >= 20) {
      return next(new Error('התור חייב להיות בין השעות 8:00-20:00'));
    }
  }
  next();
});

// Static method to get available slots for a specific date and gender
appointmentSchema.statics.getAvailableSlots = async function(date, gender) {
  const businessHours = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];
  
  // Get booked slots for the date and gender
  const bookedSlots = await this.find({
    date: date,
    gender: gender,
    status: { $nin: ['cancelled'] }
  }).select('time');
  
  const bookedTimes = bookedSlots.map(slot => slot.time);
  
  // Return available slots
  return businessHours.filter(time => !bookedTimes.includes(time));
};

// Static method to check if slot is available
appointmentSchema.statics.isSlotAvailable = async function(date, time, gender) {
  const existingAppointment = await this.findOne({
    date: date,
    time: time,
    gender: gender,
    status: { $nin: ['cancelled'] }
  });
  
  return !existingAppointment;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
