 // src/components/ProtectedRoute.js
import React from 'react'; // Added React import
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // To redirect back after login

  // While the AuthContext is still trying to determine auth state (e.g., on initial load)
  // you might want to show a loading indicator or nothing to prevent a flash of the login page.
  if (isLoading) {
    return <div>Loading...</div>; // Or return null, or a spinner component
  }

  if (!isAuthenticated) {
    // If not authenticated (and not loading), redirect to login.
    // Pass the current location so we can redirect back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components.
  return children;
};

export default ProtectedRoute;