import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('התחברת בהצלחה!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בהתחברות';
      toast.error(message);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success('נרשמת בהצלחה!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בהרשמה';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('התנתקת בהצלחה');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put('/api/auth/profile', updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      toast.success('הפרופיל עודכן בהצלחה!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בעדכון הפרופיל';
      toast.error(message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
