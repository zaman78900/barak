// API request interceptor and helper functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Enable credentials for CORS
});

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  
  // DEBUG: Log token on admin routes
  if (config.url?.includes('/api/')) {
    console.debug('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenFormat: token?.startsWith('eyJ') ? 'JWT✓' : (token ? 'INVALID' : 'NONE'),
    });
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// ─── RESPONSE INTERCEPTOR ──────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/api/')) {
      console.debug('[API Success]', {
        status: response.status,
        url: response.config?.url,
      });
    }
    return response.data;
  },
  (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      const token = localStorage.getItem('authToken');
      console.error('🔐 Authentication Error (401):', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        errorMessage: error.response?.data?.error,
        errorDetails: error.response?.data?.details,
        tokenStored: !!token,
        tokenFormat: token?.startsWith('eyJ') ? 'JWT' : (token ? 'INVALID' : 'NONE'),
      });

      // Clear invalid auth
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login after delay
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    } else if (error.response?.status >= 400) {
      console.error('🔴 API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.error,
        details: error.response?.data?.details,
      });
    }
    
    throw error.response?.data || error.message;
  }
);

export default api;
