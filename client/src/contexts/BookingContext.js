import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Mock data for development
const mockPackages = [
  {
    _id: '1',
    name: 'חבילת פיזיותרפיה בסיסית',
    description: 'חבילה בסיסית לטיפולי פיזיותרפיה עם 5 מפגשים',
    numberOfSessions: 5,
    price: 500,
    originalPrice: 600,
    category: 'basic',
    gender: 'both',
    isActive: true,
    features: [
      '5 מפגשי פיזיותרפיה',
      'הערכה ראשונית',
      'תוכנית טיפול מותאמת',
      'מעקב אחר התקדמות'
    ],
    validityDays: 90
  },
  {
    _id: '2',
    name: 'חבילת עיסוי רפואי פרימיום',
    description: 'חבילה מתקדמת לעיסוי רפואי עם 8 מפגשים',
    numberOfSessions: 8,
    price: 1200,
    originalPrice: 1400,
    category: 'premium',
    gender: 'both',
    isActive: true,
    isPopular: true,
    features: [
      '8 מפגשי עיסוי רפואי',
      'הערכה מקיפה',
      'טיפול בכאבים כרוניים',
      'תרגילי בית',
      'מעקב טלפוני'
    ],
    validityDays: 120
  },
  {
    _id: '3',
    name: 'חבילת טיפולי ספורט VIP',
    description: 'חבילה יוקרתית לטיפולי ספורט עם 12 מפגשים',
    numberOfSessions: 12,
    price: 2000,
    originalPrice: 2400,
    category: 'vip',
    gender: 'both',
    isActive: true,
    isPopular: true,
    features: [
      '12 מפגשי טיפול',
      'הערכה ספורטיבית מלאה',
      'תוכנית אימונים מותאמת',
      'טיפול בפציעות ספורט',
      'ייעוץ תזונתי',
      'מעקב שבועי'
    ],
    validityDays: 180
  },
  {
    _id: '4',
    name: 'חבילת טיפולים לנשים',
    description: 'חבילה מיוחדת לטיפולים המותאמים לנשים',
    numberOfSessions: 6,
    price: 800,
    originalPrice: 900,
    category: 'special',
    gender: 'female',
    isActive: true,
    features: [
      '6 מפגשי טיפול',
      'טיפולי רצפת אגן',
      'טיפול בכאבי גב',
      'ייעוץ אורח חיים',
      'תרגילי חיזוק'
    ],
    validityDays: 100
  },
  {
    _id: '5',
    name: 'חבילת טיפולים לגברים',
    description: 'חבילה מיוחדת לטיפולים המותאמים לגברים',
    numberOfSessions: 6,
    price: 800,
    originalPrice: 900,
    category: 'special',
    gender: 'male',
    isActive: true,
    features: [
      '6 מפגשי טיפול',
      'טיפול בכאבי גב',
      'שיקום פציעות',
      'ייעוץ אורח חיים',
      'תרגילי חיזוק'
    ],
    validityDays: 100
  },
  {
    _id: '6',
    name: 'חבילת טיפול יחיד',
    description: 'טיפול בודד לכל סוגי הטיפולים',
    numberOfSessions: 1,
    price: 150,
    category: 'basic',
    gender: 'both',
    isActive: true,
    features: [
      'טיפול יחיד',
      'הערכה ראשונית',
      'המלצות לטיפול המשך'
    ],
    validityDays: 30
  }
];

const mockAppointments = [
  {
    _id: '1',
    date: '2024-01-20',
    time: '10:00',
    status: 'scheduled',
    type: 'single',
    notes: 'כאבי גב'
  },
  {
    _id: '2',
    date: '2024-01-22',
    time: '14:30',
    status: 'confirmed',
    type: 'package',
    package: {
      _id: '2',
      name: 'חבילת עיסוי רפואי פרימיום'
    }
  }
];

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages(); // Always fetch packages (no auth required)
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setPackages(mockPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const getAvailableSlots = async (date, gender) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock available time slots
      const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
      ];
      
      // Randomly remove some slots to simulate availability
      const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
      setAvailableSlots(availableSlots);
    } catch (error) {
      toast.error('שגיאה בטעינת הזמנים הזמינים');
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (bookingData) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new appointment with mock data
      const newAppointment = {
        _id: Date.now().toString(),
        ...bookingData,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('התור נקבע בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה בקביעת התור');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      toast.success('התור בוטל בהצלחה');
      return true;
    } catch (error) {
      toast.error('שגיאה בביטול התור');
      return false;
    }
  };

  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId ? { ...apt, date: newDate, time: newTime } : apt
        )
      );
      toast.success('התור נדחה בהצלחה');
      return true;
    } catch (error) {
      toast.error('שגיאה בדחיית התור');
      return false;
    }
  };

  const purchasePackage = async (packageId) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('החבילה נרכשה בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה ברכישת החבילה');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    appointments,
    packages,
    availableSlots,
    loading,
    getAvailableSlots,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    purchasePackage,
    fetchAppointments,
    fetchPackages
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
