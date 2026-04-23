// API request interceptor and helper functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Don't redirect to /auth/login - it doesn't exist yet
      // Instead, let the component handle the 401 error gracefully
      console.warn('Authentication failed. Please login to access this resource.');
      // Optionally redirect to home page instead
      // window.location.href = '/';
    }
    throw error.response?.data || error.message;
  }
);

export default api;
