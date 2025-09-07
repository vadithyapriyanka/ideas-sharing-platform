 // src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Import useAuth

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  // We'll use error and isLoading from the AuthContext now
  const { loginUser, isLoading, error: authError, clearError } = useAuth(); // Get new context values
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authError) clearError(); // Clear previous auth errors before a new attempt

    const result = await loginUser({ emailOrUsername, password }); // Call the new loginUser

    if (result.success) {
      navigate('/ideas'); // Or to wherever you want to redirect after login
    } else {
      // Error will be set in AuthContext and can be displayed via authError
      // No need to set local error state unless you want specific messages here
      console.error("Login failed:", result.error?.message || 'Unknown login error');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {/* Display error from AuthContext */}
      {authError && <p className="error">{authError.message || 'Login failed. Please try again.'}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text" // Changed to text to allow username or email
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          disabled={isLoading} // Disable input when loading
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading} // Disable input when loading
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;