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
    name: 'טיפול יחיד - אינפרבייק',
    description: 'טיפול יחיד במכונת האינפרבייק - 45 דקות של שריפת קלוריות מהירה',
    numberOfSessions: 1,
    price: 150,
    category: 'single',
    gender: 'both',
    isActive: true,
    features: [
      '45 דקות אימון באינפרבייק',
      'עד 2000+ קלוריות בטיפול',
      'שריפת קלוריות מהירה ויעילה',
      'הדרכה מקצועית',
      'מעקב אחר ביצועים'
    ],
    validityDays: 30,
    machine: 'Infrabike',
    duration: '45 דקות',
    calories: 'עד 2000+ קלוריות'
  },
  {
    _id: '2',
    name: 'חבילת 10+1 - אינפרבייק',
    description: 'חבילה משתלמת של 10 טיפולים + 1 חינם במכונת האינפרבייק',
    numberOfSessions: 11,
    price: 1500,
    originalPrice: 1650,
    category: 'package',
    gender: 'both',
    isActive: true,
    isPopular: true,
    features: [
      '11 מפגשי אינפרבייק (10+1 חינם)',
      '45 דקות לכל מפגש',
      'עד 2000+ קלוריות בטיפול',
      'חיסכון של 150 ש"ח',
      'תוקף 6 חודשים',
      'הדרכה מקצועית',
      'מעקב אחר התקדמות'
    ],
    validityDays: 180,
    machine: 'Infrabike',
    duration: '45 דקות',
    calories: 'עד 2000+ קלוריות',
    savings: 150
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
