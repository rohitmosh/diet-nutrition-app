import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    return user.role === 'admin' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/patient/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
