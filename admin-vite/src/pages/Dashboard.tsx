import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUsers } from '../hooks/useUsers';
import { useAppointments } from '../hooks/useAppointments';
import { StatsSection } from '../components/StatsSection';
import { UsersSection } from '../components/UsersSection';
import { AppointmentsSection } from '../components/AppointmentsSection';
import { StatusModal } from '../components/StatusModal';
import type { Appointment, Measurements } from '../types/dashboard';
import movfitLogo from '../assets/movfit.png';

interface DashboardProps {
  onLogout: () => void;
  currentAdmin: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, currentAdmin }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'clients' | 'appointments'>('overview');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<'completed' | 'cancelled'>('completed');
  const [measurements, setMeasurements] = useState<Measurements>({
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    caloriesBurnt: '',
    notes: ''
  });
  const [updating, setUpdating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Custom hooks
  const { stats, loading, lastFetchTime, setLastFetchTime, fetchDashboardStats } = useDashboardData();
  const { users, usersLoading, fetchUsers } = useUsers();
  const { appointments, appointmentsLoading, fetchAppointments, updateAppointmentStatus } = useAppointments();

  // Initialize dashboard
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Modal functions
  const openStatusModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus('completed');
    setMeasurements({
      weight: appointment.user?.weight?.toString() || '',
      chest: '',
      waist: '',
      hips: '',
      caloriesBurnt: '',
      notes: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    setMeasurements({
      weight: '',
      chest: '',
      waist: '',
      hips: '',
      caloriesBurnt: '',
      notes: ''
    });
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppointment) return;

    try {
      setUpdating(true);
      
      const success = await updateAppointmentStatus(
        selectedAppointment._id,
        newStatus,
        measurements,
        selectedAppointment.user || null
      );

      if (success) {
        // Refresh all data
        const [usersTime, appointmentsTime] = await Promise.all([
          fetchUsers(true, lastFetchTime),
          fetchAppointments(true, lastFetchTime, users)
        ]);
        
        await fetchDashboardStats(true, users, appointments);
        
        // Update cache timestamps
        setLastFetchTime(prev => ({
          ...prev,
          users: usersTime || prev.users,
          appointments: appointmentsTime || prev.appointments
        }));

        closeModal();
        
        // Show success message
        setSuccessMessage(`התור עודכן בהצלחה ל-${newStatus === 'completed' ? 'הושלם' : 'בוטל'}`);
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        // Show error message
        setSuccessMessage('שגיאה בעדכון התור');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      // Show error message
      setSuccessMessage('שגיאה בעדכון התור');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } finally {
      setUpdating(false);
    }
  };

  // Navigation handlers
  const handleOverviewClick = async () => {
    setActiveSection('overview');
    await fetchDashboardStats(true, users, appointments);
  };

  const handleClientsClick = async () => {
    setActiveSection('clients');
    const usersTime = await fetchUsers(true, lastFetchTime);
    if (usersTime) {
      setLastFetchTime(prev => ({ ...prev, users: usersTime }));
    }
  };

  const handleAppointmentsClick = async () => {
    setActiveSection('appointments');
    const appointmentsTime = await fetchAppointments(true, lastFetchTime, users);
    if (appointmentsTime) {
      setLastFetchTime(prev => ({ ...prev, appointments: appointmentsTime }));
    }
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="content-section">
            <StatsSection stats={stats} loading={loading} />
          </div>
        );
      case 'clients':
        return (
          <UsersSection 
            users={users}
            usersLoading={usersLoading}
            onRefresh={() => handleClientsClick()}
            currentAdmin={currentAdmin}
          />
        );
      case 'appointments':
        return (
          <AppointmentsSection 
            appointments={appointments}
            appointmentsLoading={appointmentsLoading}
            onRefresh={() => handleAppointmentsClick()}
            onUpdateStatus={openStatusModal}
            currentAdmin={currentAdmin}
          />
        );
      default:
        return (
          <div className="content-section">
            <StatsSection stats={stats} loading={loading} />
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
            <div className="sidebar-header">
              <img src={movfitLogo} alt="Movafit Logo" className="sidebar-logo" />
              {currentAdmin?.gender && (
                <div className="admin-role">
                  <span className="role-text">
                    מנהל {currentAdmin.gender === 'male' ? 'גברים' : 'נשים'}
                  </span>
                </div>
              )}
            </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={handleOverviewClick}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">סקירה כללית</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={handleClientsClick}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">לקוחות</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={handleAppointmentsClick}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">תורים</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">התנתק</span>
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>

      <StatusModal
        modalOpen={modalOpen}
        selectedAppointment={selectedAppointment}
        newStatus={newStatus}
        measurements={measurements}
        updating={updating}
        onClose={closeModal}
        onStatusChange={setNewStatus}
        onMeasurementsChange={setMeasurements}
        onSave={handleUpdateStatus}
      />

      {/* Success/Error Notification */}
      {showSuccessMessage && (
        <div className="notification-overlay">
          <div className="notification-message">
            <span className="notification-text">{successMessage}</span>
            <button 
              className="notification-close"
              onClick={() => setShowSuccessMessage(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
