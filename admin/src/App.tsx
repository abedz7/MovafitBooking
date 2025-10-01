import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="login-container">
        <img src={require('./assets/movfit.png')} alt="Movafit Logo" className="logo" />
        <h2>Admin Login</h2>
        <form className="login-form">
          <input type="text" placeholder="Phone Number" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default App;
