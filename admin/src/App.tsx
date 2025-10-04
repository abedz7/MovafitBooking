import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('adminAuthToken');
      const authTimestamp = localStorage.getItem('adminAuthTimestamp');
      
      if (authToken && authTimestamp) {
        const now = Date.now();
        const tokenAge = now - parseInt(authTimestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < maxAge) {
          const adminData = localStorage.getItem('adminData');
          if (adminData) {
            setCurrentAdmin(JSON.parse(adminData));
            setIsLoggedIn(true);
          }
        } else {
          // Token expired, clear it
          localStorage.removeItem('adminAuthToken');
          localStorage.removeItem('adminAuthTimestamp');
          localStorage.removeItem('adminData');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (adminData: any) => {
    if (adminData && adminData.isAdmin) {
      // Store authentication and admin data in localStorage
      localStorage.setItem('adminAuthToken', 'admin-authenticated');
      localStorage.setItem('adminAuthTimestamp', Date.now().toString());
      localStorage.setItem('adminData', JSON.stringify(adminData));
      setCurrentAdmin(adminData);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    // Clear authentication from localStorage
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminAuthTimestamp');
    localStorage.removeItem('adminData');
    setCurrentAdmin(null);
    setIsLoggedIn(false);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#667eea'
        }}>
          טוען...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} currentAdmin={currentAdmin} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
