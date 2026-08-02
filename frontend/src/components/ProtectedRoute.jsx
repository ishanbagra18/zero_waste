import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not allowed, redirect them
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    if (role === 'NGO' || role === 'ngo') {
      return <Navigate to="/ngo/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, show the page
  return <Outlet />;
};

export default ProtectedRoute;