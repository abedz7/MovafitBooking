import React, { createContext, useContext, useState, useEffect } from 'react';
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data for demo
      const mockUser = {
        _id: '1',
        firstName: 'פאדי',
        lastName: 'גאבר',
        email: 'demo@example.com',
        phone: '0501111111',
        gender: 'male',
        role: 'user'
      };
      setUser(mockUser);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - accept any email/password for demo
      const mockUser = {
        _id: '1',
        firstName: 'פאדי',
        lastName: 'גאבר',
        email: email,
        phone: '0501111111',
        gender: 'male',
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      toast.success('התחברת בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה בהתחברות');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration
      const mockUser = {
        _id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      toast.success('נרשמת בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה בהרשמה');
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user with new data
      setUser(prev => ({ ...prev, ...updatedData }));
      toast.success('הפרופיל עודכן בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה בעדכון הפרופיל');
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
