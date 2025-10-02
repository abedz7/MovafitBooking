import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Settings, LogOut, Plus, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { appointments, fetchAppointments, cancelAppointment, loading } = useBooking();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchAppointments(user._id);
    }
  }, [user, fetchAppointments]);

  const handleCancelAppointment = async () => {
    if (selectedAppointment) {
      try {
        await cancelAppointment(selectedAppointment._id);
        setShowCancelModal(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  ).slice(0, 3);


  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600 text-white';
      case 'confirmed': return 'bg-green-600 text-white';
      case 'completed': return 'bg-gray-600 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'מתוכנן';
      case 'confirmed': return 'מאושר';
      case 'completed': return 'הושלם';
      case 'cancelled': return 'בוטל';
      default: return status;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            שלום, {user?.fullName}!
          </h1>
          <p className="text-gray-300">ברוכים הבאים לפאנל הניהול שלכם</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">סה"כ תורים</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">תורים קרובים</p>
                <p className="text-2xl font-bold text-white">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="h-6 w-6 text-gray-300" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">הושלמו</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">בוטלו</p>
                <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-800 rounded-lg shadow p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">פרטי הפרופיל שלך</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-400 ml-2" />
                <div>
                  <p className="text-sm font-medium text-gray-300">שם מלא</p>
                  <p className="text-lg font-bold text-white">{user?.fullName || 'לא זמין'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-green-400 ml-2" />
                <div>
                  <p className="text-sm font-medium text-gray-300">משקל</p>
                  <p className="text-lg font-bold text-white">
                    {user?.weight ? `${user.weight} ק"ג` : 'לא עודכן'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-purple-400 ml-2" />
                <div>
                  <p className="text-sm font-medium text-gray-300">מידות</p>
                  <p className="text-sm text-white">
                    {user?.measurements ? 
                      `חזה: ${user.measurements.chest || 'N/A'} | מותן: ${user.measurements.waist || 'N/A'} | ירכיים: ${user.measurements.hips || 'N/A'}` 
                      : 'לא עודכן'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-400 ml-2" />
                <div>
                  <p className="text-sm font-medium text-gray-300">תאריך הצטרפות</p>
                  <p className="text-sm text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('he-IL') : 'לא זמין'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">פעולות מהירות</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/booking"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-900/30 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-400 ml-2" />
              <span className="text-gray-300">הזמן תור חדש</span>
            </Link>
            <Link
              to="/packages"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-900/30 transition-colors"
            >
              <User className="h-5 w-5 text-gray-400 ml-2" />
              <span className="text-gray-300">צפה בחבילות</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-red-500 hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-400 ml-2" />
              <span className="text-gray-300">התנתק</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg shadow"
        >
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8 space-x-reverse px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                סקירה כללית
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                כל התורים
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Upcoming Appointments */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">התורים הקרובים</h3>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                            <div>
                              <p className="font-medium text-white">
                                {formatDate(appointment.date)} - {formatTime(appointment.time)}
                              </p>
                              <p className="text-sm text-gray-400">
                                {appointment.type === 'package' ? 'חבילה' : 'טיפול יחיד'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowCancelModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">אין תורים קרובים</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">כל התורים</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            תאריך ושעה
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            סוג
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            סטטוס
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            פעולות
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {appointments.map((appointment) => (
                          <tr key={appointment._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatDate(appointment.date)} - {formatTime(appointment.time)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {appointment.type === 'package' ? 'חבילה' : 'טיפול יחיד'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <button className="text-primary-600 hover:text-primary-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setShowCancelModal(true);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">אין תורים</p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-white mb-4">
                  בטל תור
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  האם אתה בטוח שברצונך לבטל את התור?
                </p>
                <div className="flex justify-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    כן, בטל
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
