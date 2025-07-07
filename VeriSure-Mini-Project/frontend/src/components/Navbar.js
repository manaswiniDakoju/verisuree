// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await onLogout(); // Call the logout handler from App.js
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <h1>VeriBlock</h1>
      {currentUser ? (
        <>
          <ul className="nav-links">
            {currentUser.role === 'admin' && (
              <>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/manufacturer">Manufacturer Dashboard</Link></li>
                <li><Link to="/customer">Customer Dashboard</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
              </>
            )}
            {currentUser.role === 'manufacturer' && (
              <li><Link to="/manufacturer">Manufacturer Dashboard</Link></li>
            )}
            {currentUser.role === 'customer' && (
              <li><Link to="/customer">Customer Dashboard</Link></li>
            )}
          </ul>
          <div>
            <span className="user-info">Logged in as: {currentUser.username} ({currentUser.role})</span>
            <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
          </div>
        </>
      ) : (
        <ul className="nav-links">
          <li><Link to="/login">Login</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;