import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Booking = () => {
  const { user } = useAuth();
  const { getAvailableSlots, bookAppointment } = useBooking();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { register, handleSubmit } = useForm();

  const loadAvailableSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(selectedDate, user.gender);
      console.log('Received slots in Booking component:', slots);
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast.error('שגיאה בטעינת הזמנים הזמינים');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, user.gender, getAvailableSlots]);


  useEffect(() => {
    if (selectedDate && user?.gender) {
      // Add a small delay to prevent constant reloading when user is typing or changing dates quickly
      const timeoutId = setTimeout(() => {
        loadAvailableSlots();
      }, 300); // 300ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [selectedDate, user?.gender, loadAvailableSlots]);

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setIsLoading(true);
      try {
        const bookingData = {
          userId: user._id,
          date: selectedDate,
          time: selectedTime,
          type: 'single',
          notes: data.notes || ''
        };

        await bookAppointment(bookingData);
        toast.success('התור נקבע בהצלחה!');
        setStep(1);
        setSelectedDate('');
        setSelectedTime('');
      } catch (error) {
        console.error('Error booking appointment:', error);
        toast.error('שגיאה בקביעת התור');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Gender-specific days configuration
  const getGenderSpecificDays = (gender) => {
    if (gender === 'male') {
      return ['wednesday', 'saturday', 'monday']; // Wednesday, Saturday, Monday (4pm-9pm)
    } else if (gender === 'female') {
      return ['sunday', 'tuesday', 'thursday', 'friday']; // Sunday, Tuesday, Thursday, Friday
    }
    return [];
  };

  const getGenderSpecificHours = (gender, dayOfWeek) => {
    if (gender === 'male') {
      if (dayOfWeek === 'monday') {
        // Monday: 4pm-9pm (16:00-21:00)
        return ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
      } else {
        // Wednesday & Saturday: 9am-8pm (09:00-20:00)
        return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
      }
    } else if (gender === 'female') {
      // All women days: 9am-8pm (09:00-20:00)
      return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    }
    return [];
  };

  const getMinDate = () => {
    // Start from October 10, 2025
    return '2025-10-10';
  };

  const getMaxDate = () => {
    const maxDate = new Date('2025-10-10');
    maxDate.setDate(maxDate.getDate() + 60); // 60 days from start date
    return maxDate.toISOString().split('T')[0];
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const isDateAvailableForGender = (dateString, gender) => {
    const dayOfWeek = getDayOfWeek(dateString);
    const allowedDays = getGenderSpecificDays(gender);
    return allowedDays.includes(dayOfWeek);
  };


  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            הזמן תור
          </h1>
          <p className="text-gray-300">בחר את התאריך והשעה המתאימים לך</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-300 text-gray-300'
                    }`}
                  >
                    {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 2 && (
                    <div
                      className={`w-16 h-1 ${
                        step > stepNumber ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-300">
              {step === 1 && 'בחר תאריך ושעה'}
              {step === 2 && 'אשר פרטים'}
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Date and Time */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  בחר תאריך ושעה
                </h2>

                {/* Gender-specific info */}
                <div className="bg-gradient-to-r from-primary-900/30 to-secondary-900/30 border border-primary-600/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full ml-3"></div>
                    <div>
                      <h3 className="font-medium text-white">
                        {user?.gender === 'male' ? 'ימים זמינים לגברים' : 'ימים זמינים לנשים'}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {user?.gender === 'male' 
                          ? 'יום רביעי ושבת (9:00-20:00), יום שני (16:00-21:00)'
                          : 'יום ראשון, שלישי, חמישי ושישי (9:00-20:00)'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      בחר תאריך
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime(''); // Reset time when date changes
                        }}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white text-lg"
                        required
                      />
                      <div className="absolute left-3 top-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    {selectedDate && !isDateAvailableForGender(selectedDate, user?.gender) && (
                      <div className="mt-2 p-3 bg-red-900/30 border border-red-600/30 rounded-lg">
                        <p className="text-red-400 text-sm">
                          ❌ תאריך זה לא זמין עבור {user?.gender === 'male' ? 'גברים' : 'נשים'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      בחר שעה
                    </label>
                    
                    {!selectedDate ? (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 text-center">
                        <p className="text-gray-400">בחר תאריך תחילה</p>
                      </div>
                    ) : !isDateAvailableForGender(selectedDate, user?.gender) ? (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 text-center">
                        <p className="text-gray-400">תאריך לא זמין עבור המגדר שלך</p>
                      </div>
                    ) : (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        {loadingSlots ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                            <span className="mr-3 text-gray-300">טוען זמנים זמינים...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                            {getGenderSpecificHours(user?.gender, getDayOfWeek(selectedDate)).map((time) => {
                              const isAvailable = availableSlots && availableSlots.includes(time);
                              const isSelected = selectedTime === time;
                              
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => setSelectedTime(time)}
                                  disabled={!isAvailable}
                                  className={`p-3 text-sm rounded-lg border transition-all font-medium ${
                                    isSelected
                                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg'
                                      : isAvailable
                                      ? 'bg-gray-700 text-gray-200 border-gray-500 hover:border-primary-400 hover:bg-gray-600 hover:shadow-md'
                                      : 'bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        
                        {selectedDate && isDateAvailableForGender(selectedDate, user?.gender) && availableSlots && availableSlots.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-400">אין זמנים זמינים בתאריך זה</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedDate && (
                  <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                    <p className="text-sm text-blue-300">
                      הזמנים הזמינים ל{formatDate(selectedDate)}: {availableSlots ? availableSlots.length : 0} זמנים
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
                  >
                    חזור
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !selectedDate || 
                      !selectedTime || 
                      !isDateAvailableForGender(selectedDate, user?.gender) ||
                      !availableSlots?.includes(selectedTime)
                    }
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                  >
                    המשך
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  אשר פרטי התור
                </h2>

                <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                  <h3 className="font-medium text-white mb-4">פרטי התור</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">תאריך:</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">שעה:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">סוג:</span>
                      <span className="font-medium">טיפול יחיד</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    הערות (אופציונלי)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white placeholder-gray-400"
                    placeholder="הוסף הערות נוספות..."
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
                  >
                    חזור
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        קובע תור...
                      </>
                    ) : (
                      <>
                        קבע תור
                        <Check className="h-4 w-4 mr-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
