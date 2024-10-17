

import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token; // Trả về true nếu có token
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
