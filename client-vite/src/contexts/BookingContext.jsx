import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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


export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages(); // Always fetch packages (no auth required)
    if (token) {
      // We need to get user ID from AuthContext, but we can't use useAuth here
      // So we'll fetch appointments when the Dashboard component calls it
    }
  }, [token]);

  const fetchAppointments = useCallback(async (userId) => {
    try {
      setLoading(true);
      if (!userId) {
        console.log('No user ID provided, skipping appointments fetch');
        setAppointments([]);
        return;
      }
      
      console.log('Fetching appointments for user:', userId);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movafit-booking-server.vercel.app';
      const response = await fetch(`${apiUrl}/api/appointments/getAppointmentsByUserId/${userId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User appointments data:', data);
        setAppointments(data.appointments || []);
      } else {
        console.error('Failed to fetch user appointments, status:', response.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external variables

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
      // Get day of week to determine available hours
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[dayOfWeek];
      
      let possibleHours = [];
      
      if (gender === 'male') {
        if (dayName === 'monday') {
          // Monday: 4pm-9pm (16:00-21:00)
          possibleHours = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
        } else if (dayName === 'wednesday' || dayName === 'saturday') {
          // Wednesday & Saturday: 9am-8pm (09:00-20:00)
          possibleHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
        }
      } else if (gender === 'female') {
        if (['sunday', 'tuesday', 'thursday', 'friday'].includes(dayName)) {
          // All women days: 9am-8pm (09:00-20:00)
          possibleHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
        }
      }
      
      // If no possible hours for this day/gender, return empty
      if (possibleHours.length === 0) {
        console.log('No possible hours for', date, '(', dayName, '), gender:', gender);
        return [];
      }
      
      // Now check server for existing bookings on this date
      console.log('Checking existing bookings for', date, 'gender:', gender);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movafit-booking-server.vercel.app';
      const response = await fetch(`${apiUrl}/api/appointments/getAppointmentsByDate/${date}`);
      
      if (response.ok) {
        const data = await response.json();
        const existingAppointments = data.appointments || [];
        
        // Get list of already booked times
        const bookedTimes = existingAppointments.map(apt => apt.time);
        console.log('Booked times for', date, ':', bookedTimes);
        
        // Filter out booked times from possible hours
        const availableSlots = possibleHours.filter(hour => !bookedTimes.includes(hour));
        
        console.log('Available hours for', date, '(', dayName, '), gender:', gender, 'available slots:', availableSlots);
        return availableSlots;
      } else {
        console.log('Server error, returning all possible hours');
        // If server error, return all possible hours (fallback)
        return possibleHours;
      }
      
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('שגיאה בטעינת הזמנים הזמינים');
      return [];
    }
  };

  const bookAppointment = async (bookingData) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movafit-booking-server.vercel.app';
      const response = await fetch(`${apiUrl}/api/appointments/createAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(prev => [...prev, data.appointment]);
        toast.success('התור נקבע בהצלחה!');
        return true;
      } else {
        toast.error('שגיאה בקביעת התור');
        return false;
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('שגיאה בקביעת התור');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movafit-booking-server.vercel.app';
      const response = await fetch(`${apiUrl}/api/appointments/cancelAppointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
        toast.success('התור בוטל בהצלחה');
        return true;
      } else {
        toast.error('שגיאה בביטול התור');
        return false;
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
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
