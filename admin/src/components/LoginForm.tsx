import React, { useState } from 'react';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (isAdmin: boolean) => void;
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

      if (response.ok) {
        setMessage('✅ Login successful!');
        setTimeout(() => onLogin(true), 1500);
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      setMessage('❌ Connection error');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <img src={require('../assets/movfit.png')} alt="Movafit Logo" className="logo" />
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
