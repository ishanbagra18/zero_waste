import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not allowed, redirect them
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    if (role === 'ngo') {
      return <Navigate to="/ngo/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, show the page
  return <Outlet />;
};

export default ProtectedRoute;