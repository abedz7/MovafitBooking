import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, Phone, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const success = await registerUser(data);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            יצירת חשבון חדש
          </h2>
          <p className="text-gray-600">
            הירשם למערכת שלנו וקבל גישה להזמנת תורים מתקדמת
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                שם פרטי *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName', {
                    required: 'השם הפרטי נדרש',
                    minLength: {
                      value: 2,
                      message: 'השם הפרטי חייב להכיל לפחות 2 תווים'
                    }
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.firstName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="הכנס את השם הפרטי שלך"
                />
              </div>
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.firstName.message}
                </motion.p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                שם משפחה *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName', {
                    required: 'שם המשפחה נדרש',
                    minLength: {
                      value: 2,
                      message: 'שם המשפחה חייב להכיל לפחות 2 תווים'
                    }
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.lastName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="הכנס את שם המשפחה שלך"
                />
              </div>
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.lastName.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'כתובת האימייל נדרשת',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'כתובת אימייל לא תקינה'
                    }
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="הכנס את כתובת האימייל שלך"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="05X-XXXXXXX"
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                מגדר *
              </label>
              <select
                id="gender"
                {...register('gender', {
                  required: 'בחירת מגדר נדרשת'
                })}
                className={`block w-full pr-3 pl-3 py-3 border rounded-lg text-right transition-colors ${
                  errors.gender
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
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
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.gender.message}
                </motion.p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                תאריך לידה *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  {...register('dateOfBirth', {
                    required: 'תאריך הלידה נדרש'
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.dateOfBirth
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                />
              </div>
              {errors.dateOfBirth && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.dateOfBirth.message}
                </motion.p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'הסיסמה נדרשת',
                    minLength: {
                      value: 6,
                      message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
                    }
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="הכנס סיסמה"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                אימות סיסמה *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'אימות הסיסמה נדרש',
                    validate: value => value === password || 'הסיסמאות אינן תואמות'
                  })}
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="אמת את הסיסמה"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 text-right"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  יצירת חשבון
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              יש לך כבר חשבון?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                התחבר עכשיו
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;
