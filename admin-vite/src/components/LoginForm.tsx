import React, { useState } from 'react';
import './LoginForm.css';
import movfitLogo from '../assets/movfit.png';

interface LoginFormProps {
  onLogin: (adminData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://movafit-booking-server.vercel.app/api/users/authenticateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // Check if the authenticated user is an admin
        if (data.user.isAdmin) {
          const genderText = data.user.gender === 'male' ? 'גברים' : 'נשים';
          setMessage(`✅ התחברת בהצלחה כמנהל ${genderText}!`);
          setTimeout(() => onLogin(data.user), 1500);
        } else {
          setMessage('❌ אין לך הרשאות מנהל');
        }
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Connection error');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <img src={movfitLogo} alt="Movafit Logo" className="logo" />
          <h1>מובפיט</h1>
          <p>פאנל ניהול</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="phone">מספר טלפון</label>
            <input 
              type="text" 
              id="phone"
              placeholder="הכנס מספר טלפון" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">סיסמה</label>
            <input 
              type="password" 
              id="password"
              placeholder="הכנס סיסמה" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              'התחבר'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
