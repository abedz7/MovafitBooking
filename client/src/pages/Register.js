import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Phone, ArrowLeft, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Step 1: Personal details submission
  const onSubmitStep1 = async (data) => {
    setIsLoading(true);
    try {
      // Generate password
      const password = generatePassword();
      setGeneratedPassword(password);
      
      // Store user data
      setUserData(data);
      
      // Simulate sending password via WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show password to user and open WhatsApp
      toast.success(`הסיסמה שלך: ${password} - אנא העתק אותה`);
      
      // Open WhatsApp with a message to the clinic
      const message = `שלום, אני ${data.fullName} (${data.phone}) ואני רוצה להירשם למערכת. אנא שלחו לי את הסיסמה.`;
      const clinicPhone = '0527771621';
      const url = `https://wa.me/972${clinicPhone.replace('0', '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      // Move to step 2
      setCurrentStep(2);
    } catch (error) {
      toast.error('שגיאה בשליחת הסיסמה');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Password validation
  const onSubmitStep2 = async (data) => {
    setIsLoading(true);
    try {
      if (data.password === generatedPassword) {
        // Complete registration
        const completeUserData = {
          ...userData,
          password: generatedPassword,
          email: `${userData.phone}@movafit.local` // Generate email from phone
        };
        
        const success = await registerUser(completeUserData);
        if (success) {
          toast.success('החשבון נוצר בהצלחה!');
          navigate('/dashboard');
        }
      } else {
        toast.error('הסיסמה שגויה. אנא בדוק את ההודעה בווטסאפ');
      }
    } catch (error) {
      toast.error('שגיאה ביצירת החשבון');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('demo@example.com', 'demo123');
      if (success) {
        navigate('/dashboard');
      }
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
            {currentStep === 1 ? 'יצירת חשבון חדש' : 'אימות סיסמה'}
          </h2>
          <p className="text-gray-300">
            {currentStep === 1 
              ? 'הירשם למערכת שלנו וקבל גישה להזמנת תורים מתקדמת'
              : 'הזן את הסיסמה שקיבלת בווטסאפ'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-600'}`}>
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-600'}`}>
              <span className="text-white text-sm font-bold">2</span>
            </div>
          </div>
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmitStep1)}
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
                    שלח סיסמה לווטסאפ
                    <MessageSquare className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-primary-400 text-sm font-medium rounded-lg text-primary-400 bg-transparent hover:bg-primary-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-400"></div>
                ) : (
                  'התחבר כדמו (Demo Login)'
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
        )}

        {/* Step 2: Password Validation */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-400 ml-2" />
                <p className="text-blue-300 text-sm">
                  שלחת הודעה למרפאה בווטסאפ. המרפאה תשלח לך את הסיסמה. אנא בדוק את ההודעה והזן את הסיסמה כאן.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitStep2)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  הסיסמה שקיבלת בווטסאפ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="off"
                    {...register('password', {
                      required: 'הסיסמה נדרשת',
                      minLength: {
                        value: 6,
                        message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
                      }
                    })}
                    className={`block w-full pr-10 pl-3 py-3 border rounded-lg text-right transition-colors bg-gray-800 text-white placeholder-gray-400 ${
                      errors.password
                        ? 'border-red-400 focus:border-red-300 focus:ring-red-500'
                        : 'border-gray-600 focus:border-primary-400 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="הזן את הסיסמה שקיבלת"
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
                    className="mt-1 text-sm text-red-400 text-right"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <ArrowLeft className="ml-2 h-5 w-5" />
                  חזור
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      השלם הרשמה
                      <CheckCircle className="mr-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
