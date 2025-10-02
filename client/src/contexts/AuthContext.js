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
      // Get user data from localStorage instead of fetching all users
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await fetch('https://movafit-booking-server.vercel.app/api/users/authenticateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        
        const user = {
          _id: userData._id,
          fullName: userData.fullName,
          phone: userData.phone,
          gender: userData.gender,
          weight: userData.weight,
          measurements: userData.measurements,
          isAdmin: userData.isAdmin,
          createdAt: userData.createdAt
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        const token = 'auth-token-' + Date.now();
        localStorage.setItem('token', token);
        setToken(token);
        toast.success('התחברת בהצלחה!');
        return true;
      } else {
        toast.error('מספר טלפון או סיסמה שגויים');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
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
    localStorage.removeItem('user');
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
