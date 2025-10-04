import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

interface DashboardStats {
  totalUsers: number;
  upcomingAppointments: number;
  completedSessions: number;
  totalCaloriesBurnt: number;
}

interface User {
  _id: string;
  fullName: string;
  phone: string;
  gender: string;
  isAdmin: boolean;
  weight: number | null;
  measurements: {
    chest: number | null;
    waist: number | null;
    hips: number | null;
    lastUpdated: Date | null;
  };
  createdAt: string;
  isActive: boolean;
}

interface Appointment {
  _id: string;
  userId: string;
  date: string;
  time: string;
  caloriesBurnt: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  user?: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    upcomingAppointments: 0,
    completedSessions: 0,
    totalCaloriesBurnt: 0
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<'completed' | 'cancelled'>('completed');
  const [measurements, setMeasurements] = useState({
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    caloriesBurnt: '',
    notes: ''
  });
  const [updating, setUpdating] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState({
    users: 0,
    appointments: 0,
    stats: 0
  });

  const fetchDashboardStats = useCallback(async (forceRefresh = false) => {
    // Cache for 30 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.stats < 30000) {
      return;
    }

    try {
      setLoading(true);
      
      // Use cached data if available and recent
      if (users.length > 0 && appointments.length > 0 && !forceRefresh) {
        const totalUsers = users.length;
        const upcomingAppointments = appointments.filter((apt: any) => apt.status === 'scheduled').length;
        const completedSessions = appointments.filter((apt: any) => apt.status === 'completed').length;
        const totalCaloriesBurnt = appointments
          .filter((apt: any) => apt.status === 'completed')
          .reduce((total: number, apt: any) => total + (apt.caloriesBurnt || 0), 0);

        setStats({
          totalUsers,
          upcomingAppointments,
          completedSessions,
          totalCaloriesBurnt
        });
        setLastFetchTime(prev => ({ ...prev, stats: now }));
        setLoading(false);
        return;
      }

      // Fetch fresh data only if needed
      const [usersResponse, appointmentsResponse] = await Promise.all([
        fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers'),
        fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments')
      ]);

      const [usersData, appointmentsData] = await Promise.all([
        usersResponse.json(),
        appointmentsResponse.json()
      ]);

      const totalUsers = usersData.users ? usersData.users.length : 0;
      const appointmentsList = appointmentsData.appointments || [];

      // Calculate stats
      const upcomingAppointments = appointmentsList.filter((apt: any) => apt.status === 'scheduled').length;
      const completedSessions = appointmentsList.filter((apt: any) => apt.status === 'completed').length;
      const totalCaloriesBurnt = appointmentsList
        .filter((apt: any) => apt.status === 'completed')
        .reduce((total: number, apt: any) => total + (apt.caloriesBurnt || 0), 0);

      setStats({
        totalUsers,
        upcomingAppointments,
        completedSessions,
        totalCaloriesBurnt
      });
      setLastFetchTime(prev => ({ ...prev, stats: now }));
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime.stats, users, appointments]);

  useEffect(() => {
    // Only load essential data on initial load
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const fetchUsers = async (forceRefresh = false) => {
    // Cache for 60 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.users < 60000) {
      return;
    }

    try {
      setUsersLoading(true);
      const response = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const usersArray = data.users || [];
      setUsers(usersArray);
      setLastFetchTime(prev => ({ ...prev, users: now }));
    } catch (error) {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAppointments = async (forceRefresh = false) => {
    // Cache for 60 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.appointments < 60000) {
      return;
    }

    try {
      setAppointmentsLoading(true);
      
      // Fetch appointments
      const appointmentsResponse = await fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments');
      const appointmentsData = await appointmentsResponse.json();
      const appointmentsList = appointmentsData.appointments || [];

      // Use cached users if available, otherwise fetch
      let usersList = users;
      if (users.length === 0) {
        const usersResponse = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
        const usersData = await usersResponse.json();
        usersList = usersData.users || [];
        setUsers(usersList); // Cache users for future use
      }

      // Combine appointments with user data
      const appointmentsWithUsers = appointmentsList.map((apt: any) => {
        const user = usersList.find((u: User) => u._id === apt.userId);
        return {
          ...apt,
          user: user || null
        };
      });

      setAppointments(appointmentsWithUsers);
      setLastFetchTime(prev => ({ ...prev, appointments: now }));
    } catch (error) {
      // Silent error handling
    } finally {
      setAppointmentsLoading(false);
    }
  };

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

  const updateAppointmentStatus = async () => {
    if (!selectedAppointment) return;

    try {
      setUpdating(true);
      
      // Update appointment status
      const appointmentResponse = await fetch(`https://movafit-booking-server.vercel.app/api/appointments/updateAppointment/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'completed' && {
            measurements: {
              weight: measurements.weight ? parseFloat(measurements.weight) : undefined,
              chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
              waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
              hips: measurements.hips ? parseFloat(measurements.hips) : undefined,
            },
            caloriesBurnt: measurements.caloriesBurnt ? parseFloat(measurements.caloriesBurnt) : undefined,
            sessionNotes: measurements.notes
          })
        })
      });

      if (!appointmentResponse.ok) {
        throw new Error('Failed to update appointment');
      }

      // If completed, update user's weight and measurements
      if (newStatus === 'completed' && selectedAppointment.user) {
        // Update user weight if provided
        if (measurements.weight) {
          const weightResponse = await fetch(`https://movafit-booking-server.vercel.app/api/users/updateUserWeight/${selectedAppointment.user._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ weight: parseFloat(measurements.weight) })
          });

          if (!weightResponse.ok) {
            // Weight update failed, but continue with other updates
          }
        }

        // Update user measurements if any are provided
        const hasMeasurements = measurements.chest || measurements.waist || measurements.hips;
        if (hasMeasurements) {
          const measurementsData = {
            chest: measurements.chest ? parseFloat(measurements.chest) : null,
            waist: measurements.waist ? parseFloat(measurements.waist) : null,
            hips: measurements.hips ? parseFloat(measurements.hips) : null
          };

          const measurementsResponse = await fetch(`https://movafit-booking-server.vercel.app/api/users/updateUserMeasurements/${selectedAppointment.user._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ measurements: measurementsData })
          });

          if (!measurementsResponse.ok) {
            // Measurements update failed, but continue
          }
        }
      }

      // Refresh appointments and users data
      await fetchAppointments(true);
      await fetchUsers(true);
      await fetchDashboardStats(true);
      
      closeModal();
      alert(`התור עודכן בהצלחה ל-${newStatus === 'completed' ? 'הושלם' : 'בוטל'}`);
      
    } catch (error) {
      alert('שגיאה בעדכון התור');
    } finally {
      setUpdating(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'clients':
        return (
          <div className="content-section">
                  <div className="section-header">
                    <h2>ניהול לקוחות</h2>
                    <button 
                      onClick={() => fetchUsers(true)} 
                      className="refresh-btn"
                      disabled={usersLoading}
                    >
                      {usersLoading ? 'טוען...' : 'רענן'}
                    </button>
                  </div>
            
            {usersLoading ? (
              <div className="loading-state">
                <p>טוען לקוחות...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <p>לא נמצאו לקוחות</p>
              </div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>שם מלא</th>
                      <th>טלפון</th>
                      <th>מין</th>
                      <th>משקל</th>
                      <th>סטטוס</th>
                      <th>תאריך רישום</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.phone}</td>
                        <td>{user.gender === 'male' ? 'זכר' : 'נקבה'}</td>
                        <td>{user.weight ? `${user.weight} ק"ג` : 'לא רשום'}</td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString('he-IL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'appointments':
        const upcomingAppointments = appointments.filter(apt => {
          const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
          return apt.status === 'scheduled' && appointmentDateTime > new Date();
        }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

        const completedAppointments = appointments.filter(apt => apt.status === 'completed')
          .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

        return (
          <div className="content-section">
            <div className="section-header">
              <h2>ניהול תורים</h2>
              <button 
                onClick={() => fetchAppointments(true)} 
                className="refresh-btn"
                disabled={appointmentsLoading}
              >
                {appointmentsLoading ? 'טוען...' : 'רענן'}
              </button>
            </div>
            
            {appointmentsLoading ? (
              <div className="loading-state">
                <p>טוען תורים...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <p>לא נמצאו תורים</p>
              </div>
            ) : (
              <div className="appointments-container">
                {/* Upcoming Appointments */}
                <div className="appointments-section">
                  <h3 className="section-title">תורים קרובים</h3>
                  {upcomingAppointments.length === 0 ? (
                    <div className="empty-subsection">
                      <p>אין תורים קרובים</p>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {upcomingAppointments.map((apt) => (
                        <div key={apt._id} className="appointment-card upcoming">
                          <div className="appointment-header">
                            <div className="appointment-date">
                              <span className="date">{new Date(apt.date).toLocaleDateString('he-IL')}</span>
                              <span className="time">{apt.time}</span>
                            </div>
                            <span className="status-badge scheduled">מתוכנן</span>
                          </div>
                          <div className="appointment-details">
                            <p><strong>לקוח:</strong> {apt.user?.fullName || 'לא ידוע'}</p>
                            <p><strong>טלפון:</strong> {apt.user?.phone || 'לא ידוע'}</p>
                            {apt.notes && <p><strong>הערות:</strong> {apt.notes}</p>}
                          </div>
                          <div className="appointment-actions">
                            <button 
                              className="status-update-btn"
                              onClick={() => openStatusModal(apt)}
                            >
                              עדכן סטטוס
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Appointments */}
                <div className="appointments-section">
                  <h3 className="section-title">תורים שהושלמו</h3>
                  {completedAppointments.length === 0 ? (
                    <div className="empty-subsection">
                      <p>אין תורים שהושלמו</p>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {completedAppointments.map((apt) => (
                        <div key={apt._id} className="appointment-card completed">
                          <div className="appointment-header">
                            <div className="appointment-date">
                              <span className="date">{new Date(apt.date).toLocaleDateString('he-IL')}</span>
                              <span className="time">{apt.time}</span>
                            </div>
                            <span className="status-badge completed">הושלם</span>
                          </div>
                          <div className="appointment-details">
                            <p><strong>לקוח:</strong> {apt.user?.fullName || 'לא ידוע'}</p>
                            <p><strong>טלפון:</strong> {apt.user?.phone || 'לא ידוע'}</p>
                            <p><strong>קלוריות נשרפו:</strong> {apt.caloriesBurnt || 0}</p>
                            {apt.notes && <p><strong>הערות:</strong> {apt.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'reports':
        return (
          <div className="content-section">
            <h2>דוחות וסטטיסטיקות</h2>
            <p>כאן תוכל לראות דוחות מפורטים על פעילות המרפאה</p>
          </div>
        );
      case 'settings':
        return (
          <div className="content-section">
            <h2>הגדרות</h2>
            <p>כאן תוכל לנהל את הגדרות המערכת</p>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <div className="welcome-section">
              <h2>ברוכים הבאים, מנהל!</h2>
              <p>נהל את פעילות מרפאת מובפיט</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>משתמשים רשומים</h3>
                  <p className="stat-number">
                    {loading ? '...' : stats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>תורים קרובים</h3>
                  <p className="stat-number">
                    {loading ? '...' : stats.upcomingAppointments.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>טיפולים הושלמו</h3>
                  <p className="stat-number">
                    {loading ? '...' : stats.completedSessions.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <h3>קלוריות נשרפו</h3>
                  <p className="stat-number">
                    {loading ? '...' : stats.totalCaloriesBurnt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <img 
            src={require('../assets/movfit.png')} 
            alt="Movafit Logo" 
            className="sidebar-logo"
          />
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('overview');
              fetchDashboardStats(true); // Force refresh stats when clicking overview
            }}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">סקירה כללית</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('clients');
              fetchUsers(true); // Force refresh users data when clicking clients
            }}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">לקוחות</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('appointments');
              fetchAppointments(true); // Force refresh appointments data when clicking appointments
            }}
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

      {/* Status Update Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>עדכון סטטוס תור</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              {selectedAppointment && (
                <div className="appointment-info">
                  <p><strong>תאריך:</strong> {new Date(selectedAppointment.date).toLocaleDateString('he-IL')}</p>
                  <p><strong>שעה:</strong> {selectedAppointment.time}</p>
                  <p><strong>לקוח:</strong> {selectedAppointment.user?.fullName}</p>
                </div>
              )}

              <div className="status-selection">
                <label>
                  <input
                    type="radio"
                    value="completed"
                    checked={newStatus === 'completed'}
                    onChange={(e) => setNewStatus(e.target.value as 'completed')}
                  />
                  הושלם
                </label>
                <label>
                  <input
                    type="radio"
                    value="cancelled"
                    checked={newStatus === 'cancelled'}
                    onChange={(e) => setNewStatus(e.target.value as 'cancelled')}
                  />
                  בוטל
                </label>
              </div>

              {newStatus === 'completed' && (
                <div className="measurements-section">
                  <h4>מדידות ותוצאות</h4>
                  <div className="measurements-grid">
                    <div className="measurement-field">
                      <label>משקל (ק"ג)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={measurements.weight}
                        onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                        placeholder="הזן משקל"
                      />
                    </div>
                    <div className="measurement-field">
                      <label>חזה (ס"מ)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                        placeholder="הזן מדידת חזה"
                      />
                    </div>
                    <div className="measurement-field">
                      <label>מותן (ס"מ)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                        placeholder="הזן מדידת מותן"
                      />
                    </div>
                    <div className="measurement-field">
                      <label>ירכיים (ס"מ)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={measurements.hips}
                        onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                        placeholder="הזן מדידת ירכיים"
                      />
                    </div>
                    <div className="measurement-field">
                      <label>קלוריות שנשרפו</label>
                      <input
                        type="number"
                        step="1"
                        value={measurements.caloriesBurnt}
                        onChange={(e) => setMeasurements({...measurements, caloriesBurnt: e.target.value})}
                        placeholder="הזן מספר קלוריות"
                      />
                    </div>
                  </div>
                  <div className="notes-field">
                    <label>הערות על המפגש</label>
                    <textarea
                      value={measurements.notes}
                      onChange={(e) => setMeasurements({...measurements, notes: e.target.value})}
                      placeholder="הזן הערות על המפגש..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                ביטול
              </button>
              <button 
                className="btn-save" 
                onClick={updateAppointmentStatus}
                disabled={updating}
              >
                {updating ? 'שומר...' : 'שמור'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
