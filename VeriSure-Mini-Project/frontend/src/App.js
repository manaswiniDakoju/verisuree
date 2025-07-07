// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import { getUser, logoutUser } from './utils/auth';
import './App.css'; // Keep standard App.css

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Function to refresh user data from backend
  const refreshUser = async () => {
    const user = await getUser();
    setCurrentUser(user);
  };

  // On initial load, try to get current user
  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null); // Clear user state
    // No need to navigate here, Navbar will do it if user is null
  };

  return (
    <Router>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <div className="container"> {/* Use a container for consistent spacing */}
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={refreshUser} />} />

          {/* Protected Routes */}
          <Route path="/manufacturer" element={
            <ProtectedRoute user={currentUser} allowedRoles={['manufacturer', 'admin']}>
              <ManufacturerDashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/customer" element={
            <ProtectedRoute user={currentUser} allowedRoles={['customer', 'admin']}>
              <CustomerDashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute user={currentUser} allowedRoles={['admin']}>
              <AdminDashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute user={currentUser} allowedRoles={['admin']}>
              <Analytics currentUser={currentUser} />
            </ProtectedRoute>
          } />

          {/* Default/Home route redirects to login or appropriate dashboard */}
          <Route path="/" element={<HomeRedirect currentUser={currentUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Helper component for default route redirection
function HomeRedirect({ currentUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // If logged in, redirect to appropriate dashboard
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else if (currentUser.role === 'manufacturer') {
        navigate('/manufacturer');
      } else if (currentUser.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/login'); // Fallback
      }
    } else {
      navigate('/login'); // If not logged in, go to login page
    }
  }, [currentUser, navigate]);

  return <div>Loading...</div>; // Or a spinner
}

export default App;