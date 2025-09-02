import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAppointments();
      fetchPackages();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const getAvailableSlots = async (date, gender) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/appointments/slots`, {
        params: { date, gender }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      toast.error('שגיאה בטעינת הזמנים הזמינים');
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (bookingData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/appointments', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAppointments(prev => [...prev, response.data]);
      toast.success('התור נקבע בהצלחה!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בקביעת התור';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      toast.success('התור בוטל בהצלחה');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בביטול התור';
      toast.error(message);
      return false;
    }
  };

  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    try {
      const response = await axios.put(`/api/appointments/${appointmentId}`, {
        date: newDate,
        time: newTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId ? response.data : apt
        )
      );
      toast.success('התור נדחה בהצלחה');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בדחיית התור';
      toast.error(message);
      return false;
    }
  };

  const purchasePackage = async (packageId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/packages/purchase', { packageId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('החבילה נרכשה בהצלחה!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה ברכישת החבילה';
      toast.error(message);
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
    fetchAppointments
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
