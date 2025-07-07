// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const result = await loginUser(username, password);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        onLoginSuccess(); // Notify App.js to refresh user state
        // The App.js HomeRedirect will handle actual navigation based on role
      } else {
        setMessage({ type: 'error', text: result.error || 'Login failed.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  return (
    <div className="container">
      <h2>Login to VeriBlock</h2>
      <p>
        **Demo Credentials:**<br/>
        Admin: `admin` / `adminpass`<br/>
        Manufacturer: `manufacturer` / `manupass`<br/>
        Customer: `customer` / `customerpass` (or any other username/password)
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default Login;