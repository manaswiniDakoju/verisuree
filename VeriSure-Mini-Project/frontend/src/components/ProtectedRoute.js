// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, user, allowedRoles }) {
  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but unauthorized role, redirect to unauthorized page or home
    // For simplicity, redirect to login, or you could create an /unauthorized page
    alert(`Access Denied! Your role (${user.role}) does not have permission to view this page.`);
    return <Navigate to="/login" replace />;
  }

  // User is logged in and has allowed role, render the children (dashboard)
  return children;
}

export default ProtectedRoute;