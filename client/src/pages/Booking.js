import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Package, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Booking = () => {
  const { user } = useAuth();
  const { packages, fetchPackages, getAvailableSlots, bookAppointment } = useBooking();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentType, setAppointmentType] = useState('single');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { register, handleSubmit } = useForm();

  const loadAvailableSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(selectedDate, user.gender);
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
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    if (selectedDate && user?.gender) {
      loadAvailableSlots();
    }
  }, [selectedDate, user?.gender, loadAvailableSlots]);

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      setIsLoading(true);
      try {
        const bookingData = {
          date: selectedDate,
          time: selectedTime,
          gender: user.gender,
          type: appointmentType,
          package: appointmentType === 'package' ? selectedPackage?._id : undefined,
          notes: data.notes || ''
        };

        await bookAppointment(bookingData);
        toast.success('התור נקבע בהצלחה!');
        setStep(1);
        setSelectedDate('');
        setSelectedTime('');
        setSelectedPackage(null);
        setAppointmentType('single');
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

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const filteredPackages = packages.filter(pkg => 
    pkg.gender === 'both' || pkg.gender === user?.gender
  );

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
              {[1, 2, 3].map((stepNumber) => (
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
                  {stepNumber < 3 && (
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
              {step === 1 && 'בחר סוג תור'}
              {step === 2 && 'בחר תאריך ושעה'}
              {step === 3 && 'אשר פרטים'}
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
            {/* Step 1: Appointment Type */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  בחר סוג תור
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('single')}
                    className={`p-6 border-2 rounded-lg text-right transition-all ${
                      appointmentType === 'single'
                        ? 'border-primary-500 bg-primary-900/30'
                        : 'border-gray-600 hover:border-gray-400 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <User className="h-8 w-8 text-primary-600" />
                      <div>
                        <h3 className="font-medium text-white">טיפול יחיד</h3>
                        <p className="text-sm text-gray-300">תור לטיפול בודד</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType('package')}
                    className={`p-6 border-2 rounded-lg text-right transition-all ${
                      appointmentType === 'package'
                        ? 'border-primary-500 bg-primary-900/30'
                        : 'border-gray-600 hover:border-gray-400 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Package className="h-8 w-8 text-primary-600" />
                      <div>
                        <h3 className="font-medium text-white">חבילת טיפולים</h3>
                        <p className="text-sm text-gray-300">תור כחלק מחבילה</p>
                      </div>
                    </div>
                  </button>
                </div>

                {appointmentType === 'package' && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      בחר חבילה
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPackages.map((pkg) => (
                        <button
                          key={pkg._id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-4 border-2 rounded-lg text-right transition-all ${
                            selectedPackage?._id === pkg._id
                              ? 'border-primary-500 bg-primary-900/30'
                              : 'border-gray-600 hover:border-gray-400 bg-gray-800'
                          }`}
                        >
                          <h4 className="font-medium text-white">{pkg.name}</h4>
                          <p className="text-sm text-gray-300 mb-2">{pkg.description}</p>
                          <p className="text-lg font-bold text-primary-600">
                            ₪{pkg.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={appointmentType === 'package' && !selectedPackage}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    המשך
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date and Time */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  בחר תאריך ושעה
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      תאריך
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      שעה
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {loadingSlots ? (
                        <div className="col-span-3 flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                          <span className="mr-2 text-gray-300">טוען זמנים...</span>
                        </div>
                      ) : (
                        timeSlots.map((time) => {
                          const isAvailable = availableSlots && availableSlots.includes(time);
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              disabled={!isAvailable}
                              className={`p-2 text-sm rounded border transition-all ${
                                selectedTime === time
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : isAvailable
                                  ? 'bg-gray-800 text-gray-300 border-gray-600 hover:border-primary-500 hover:bg-gray-700'
                                  : 'bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })
                      )}
                    </div>
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
                    disabled={!selectedDate || !selectedTime}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    המשך
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
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
                      <span className="font-medium">
                        {appointmentType === 'single' ? 'טיפול יחיד' : 'חבילת טיפולים'}
                      </span>
                    </div>
                    {appointmentType === 'package' && selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">חבילה:</span>
                        <span className="font-medium">{selectedPackage.name}</span>
                      </div>
                    )}
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
                    onClick={() => setStep(2)}
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
