 // src/components/Navbar.js
import React from 'react'; // Added React import for clarity, though often not strictly needed for JSX
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
// import './Navbar.css'; // Uncomment if you have a Navbar.css file

// const logoUrl = '/images/logo.svg'; // Example logo path

const Navbar = () => {
  const { user, logoutUser, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logoutUser();
    // If you want to navigate after logout, import useNavigate and use it here:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/');
  };

  return (
    <nav className="Navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          {/* <img src={logoUrl} alt="Student Spark Logo" /> */}
          <span className="logo-text">Student Spark</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        {isAuthenticated && <Link to="/ideas" className="nav-link">Share Ideas</Link>}
      </div>

      <div className="navbar-right">
        {isAuthenticated && user ? (
          <div className="user-section">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=0D8ABC&color=fff&rounded=true&bold=true&size=36`}
              alt={`${user.username || 'User'} avatar`}
              className="user-avatar"
            />
            <span className="username">Hi, {user.username}</span>
            <button
              className="logout-btn navbar-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="login-btn nav-action-btn"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="signup-btn nav-action-btn"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;