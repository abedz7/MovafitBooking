import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users count
      const usersResponse = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
      const usersData = await usersResponse.json();
      const totalUsers = usersData.Users ? usersData.Users.length : 0;

      // Fetch appointments
      const appointmentsResponse = await fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments');
      const appointmentsData = await appointmentsResponse.json();
      const appointments = appointmentsData.Appointments || [];

      // Calculate stats
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
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
      const data = await response.json();
      setUsers(data.Users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      
      // Fetch appointments
      const appointmentsResponse = await fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments');
      const appointmentsData = await appointmentsResponse.json();
      const appointmentsList = appointmentsData.Appointments || [];

      // Fetch users to get client names
      const usersResponse = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
      const usersData = await usersResponse.json();
      const usersList = usersData.Users || [];

      // Combine appointments with user data
      const appointmentsWithUsers = appointmentsList.map((apt: any) => {
        const user = usersList.find((u: User) => u._id === apt.userId);
        return {
          ...apt,
          user: user || null
        };
      });

      setAppointments(appointmentsWithUsers);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setAppointmentsLoading(false);
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
                onClick={fetchUsers} 
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
                onClick={fetchAppointments} 
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
          <h2>מובפיט</h2>
          <p>פאנל ניהול</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">סקירה כללית</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveSection('clients')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">לקוחות</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveSection('appointments')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">תורים</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">דוחות</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">הגדרות</span>
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
        <header className="content-header">
          <h1>פאנל ניהול מובפיט</h1>
        </header>
        
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
