 // src/auth/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { API, register as apiRegister, login as apiLogin, getCurrentUser as apiGetCurrentUser } from '../api'; // Adjust path to your api.js

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // True initially to attempt loading user
  const [error, setError] = useState(null);

  // Effect to manage Axios default headers and load user from token
  useEffect(() => {
    const attemptLoadUser = async (currentToken) => {
      API.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      try {
        const userData = await apiGetCurrentUser(currentToken);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to load user with stored token:", err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete API.defaults.headers.common['Authorization'];
        // You might want to set an error state here if needed, e.g., setError("Session expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      localStorage.setItem('token', token); // Ensure localStorage is in sync with state
      // If user is not yet loaded but token exists, try to load user
      if (!user) {
         attemptLoadUser(token);
      } else {
        // If user is already loaded, just ensure Axios header is set
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsLoading(false); // User already loaded
      }
    } else {
      // No token
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
      setUser(null); // Ensure user is null if no token
      setIsLoading(false); // No token, not loading user
    }
  }, [token, user]); // Rerun when token changes, or if user object is set/cleared externally

  const signUpUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(userData); // response = { _id, username, email, token, message }
      setToken(response.token); // This will trigger the useEffect to store in localStorage and set Axios header
      setUser({ _id: response._id, username: response.username, email: response.email });
      return { success: true, data: response };
    } catch (err) {
      console.error('Sign Up Error:', err);
      setError(err.message || 'Sign up failed.');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(credentials); // response = { _id, username, email, token, message }
      setToken(response.token); // This will trigger the useEffect
      setUser({ _id: response._id, username: response.username, email: response.email });
      return { success: true, data: response };
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed.');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    setToken(null); // This will trigger the useEffect to clear localStorage, user, and Axios header
    setUser(null);
    setError(null);
    // Components can handle navigation after logout
  };

  // Memoize the context value to prevent unnecessary re-renders of consumers
  // if the provider's parent re-renders.
  const contextValue = React.useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user, // Boolean: true if user object exists
    isLoading,
    error,
    signUpUser,
    loginUser,
    logoutUser,
    clearError: () => setError(null), // Optional: to clear errors manually
  }), [user, token, isLoading, error]); // Dependencies for useMemo

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption of the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};