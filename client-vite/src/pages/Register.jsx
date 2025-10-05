import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalPassword, setModalPassword] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Show password modal
  const displayPasswordModal = (password) => {
    setModalPassword(password);
    setShowPasswordModal(true);
    
    // Auto close modal after 60 seconds and redirect to login
    setTimeout(() => {
      setShowPasswordModal(false);
      navigate('/login');
    }, 60000);
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(modalPassword);
      toast.success('הסיסמה הועתקה ללוח!');
    } catch (error) {
      toast.error('שגיאה בהעתקת הסיסמה');
    }
  };

  // Single step registration
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Call backend to create user and get password
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movafit-booking-server.vercel.app';
      const response = await fetch(`${apiUrl}/api/users/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          gender: data.gender,
          isAdmin: false,
          weight: null,
          measurements: {
            chest: null,
            waist: null,
            hips: null,
            lastUpdated: null
          },
          isActive: true
        })
      });

      const result = await response.json();
      console.log('Server response:', result);
      console.log('Response status:', response.status);
      
      if (response.ok && result.user) {
        // Get the generated password from the response
        const password = result.password;
        
        // Show password modal first
        displayPasswordModal(password);
        toast.success('החשבון נוצר בהצלחה!');
        
        // Don't navigate immediately - let user see the modal first
      } else {
        console.error('Server error:', result);
        throw new Error(result.error || result.message || 'שגיאה ביצירת המשתמש');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'שגיאה ביצירת המשתמש');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            יצירת חשבון חדש
          </h2>
          <p className="text-gray-300">
            הירשם למערכת שלנו וקבל גישה להזמנת תורים מתקדמת
          </p>
        </div>

        {/* Registration Form */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  שם מלא *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    {...register('fullName', {
                      required: 'השם המלא נדרש',
                      minLength: {
                        value: 2,
                        message: 'השם המלא חייב להכיל לפחות 2 תווים'
                      }
                    })}
                    className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors bg-gray-800 text-white placeholder-gray-400 ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-300 focus:ring-red-500'
                        : 'border-gray-600 focus:border-primary-400 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="הכנס את השם המלא שלך"
                  />
                </div>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400 text-right"
                  >
                    {errors.fullName.message}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  מספר טלפון *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('phone', {
                      required: 'מספר הטלפון נדרש',
                      pattern: {
                        value: /^05\d{8}$/,
                        message: 'מספר טלפון לא תקין (05X-XXXXXXX)'
                      }
                    })}
                    className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors bg-gray-800 text-white placeholder-gray-400 ${
                      errors.phone
                        ? 'border-red-400 focus:border-red-300 focus:ring-red-500'
                        : 'border-gray-600 focus:border-primary-400 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="05X-XXXXXXX"
                  />
                </div>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400 text-right"
                  >
                    {errors.phone.message}
                  </motion.p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                  מגדר *
                </label>
                <select
                  id="gender"
                  {...register('gender', {
                    required: 'בחירת מגדר נדרשת'
                  })}
                  className={`block w-full pr-3 pl-3 py-3 border rounded-lg text-right transition-colors bg-gray-800 text-white ${
                    errors.gender
                      ? 'border-red-400 focus:border-red-300 focus:ring-red-500'
                      : 'border-gray-600 focus:border-primary-400 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                >
                  <option value="">בחר מגדר</option>
                  <option value="male">זכר</option>
                  <option value="female">נקבה</option>
                </select>
                {errors.gender && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400 text-right"
                  >
                    {errors.gender.message}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    הירשם עכשיו
                    <CheckCircle className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                יש לך כבר חשבון?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  התחבר עכשיו
                </Link>
              </p>
            </div>
          </motion.form>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">הסיסמה שלך</h3>
                <p className="text-gray-300 mb-4">החשבון נוצר בהצלחה! שמור את הסיסמה במקום בטוח</p>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono text-white font-bold">{modalPassword}</span>
                    <button
                      onClick={copyPassword}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      העתק
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  <p>המודל הזה ייסגר אוטומטית בעוד 60 שניות</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    navigate('/login');
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  הבנתי - עבור להתחברות
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
