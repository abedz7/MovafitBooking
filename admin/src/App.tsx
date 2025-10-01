import React, { useState } from 'react';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First test if server is accessible
      const testResponse = await fetch('https://movafit-booking-server.vercel.app/');
      console.log('Server test:', testResponse.status);
      
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
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      setMessage('❌ Connection error');
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div className="login-container">
        <img src={require('./assets/movfit.png')} alt="Movafit Logo" className="logo" />
        <h2>Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
