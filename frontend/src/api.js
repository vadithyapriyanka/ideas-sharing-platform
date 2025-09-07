 // src/api.js
import axios from 'axios';

/**
 * Determines the API base URL based on the environment.
 * @returns {string} The base URL for API requests.
 */
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // For deployed/production environment
    return 'https://ideas-sharing-platform.onrender.com/api'; // Your actual deployed Render backend URL
  } else {
    // For local development environment
    return 'http://localhost:5001/api'; // Your local backend URL
  }
};

// Create an Axios instance with the dynamic base URL
export const API = axios.create({
  baseURL: getApiBaseUrl(),
});

/**
 * Axios request interceptor.
 * Automatically adds the JWT token (if available in localStorage)
 * to the Authorization header for all outgoing requests.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// --- OTP Related API Calls ---
export const sendOTP = async (email) => {
  try {
    const response = await API.post('/send-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to send OTP.' };
  }
};

export const verifyOTP = async (email, code) => {
  try {
    const response = await API.post('/verify-otp', { email, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to verify OTP.' };
  }
};

// --- Authentication API Calls ---
export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Prefer backend's error message, then Axios's, then a generic one
    throw error.response?.data || { message: error.message || 'An unknown error occurred during registration.' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'An unknown error occurred during login.' };
  }
};

/**
 * Fetches the current authenticated user's profile.
 * The JWT token is automatically added by the request interceptor.
 */
export const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch user profile.' };
  }
};
// ...existing code...

export async function toggleUpvote(ideaId) {
  const { data } = await API.put(`/ideas/${ideaId}/like`);
  return data;
}

export async function updateIdea(ideaId, updateData) {
  const { data } = await API.put(`/ideas/${ideaId}`, updateData);
  return data;
}

export async function deleteIdea(ideaId) {
  await API.delete(`/ideas/${ideaId}`);
}

export async function addComment(ideaId, commentData) {
  const { data } = await API.post(`/ideas/${ideaId}/comments`, commentData);
  return data;
}

// ...existing code...// --- END OF FUNCTIONS TO ADD ---