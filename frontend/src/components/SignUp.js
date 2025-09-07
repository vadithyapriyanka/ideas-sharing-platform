 // src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { useAuth } from '../auth/AuthContext'; // Import useAuth

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localErrors, setLocalErrors] = useState({}); // For client-side validation errors
  const { signUpUser, isLoading, error: authError, clearError } = useAuth(); // Get new context values
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Optionally clear specific local error on change
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authError) clearError(); // Clear previous auth (backend) errors
    setLocalErrors({}); // Clear previous local validation errors

    if (validateForm()) {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      const result = await signUpUser(userData); // Call the new signUpUser

      if (result.success) {
        navigate('/ideas'); // Or to login, or auto-login and go to ideas
      } else {
        // Backend error will be in authError from context
        // result.error might contain specific messages from backend validation not caught by client-side
        console.error("Sign up failed:", result.error?.message || 'Unknown sign up error');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {/* Display backend error from AuthContext */}
      {authError && <p className="error">{authError.message || 'Sign up failed. Please try again.'}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />
        {localErrors.username && <p className="error">{localErrors.username}</p>}
        
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {localErrors.email && <p className="error">{localErrors.email}</p>}
        
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {localErrors.password && <p className="error">{localErrors.password}</p>}
        
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
        {localErrors.confirmPassword && <p className="error">{localErrors.confirmPassword}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;