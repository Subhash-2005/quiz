import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network connection failed. Please check your internet connection.');
    }

    // Handle specific HTTP status codes
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        throw new Error(data?.message || 'Authentication failed. Please log in again.');
      
      case 403:
        throw new Error(data?.message || 'Access denied. You do not have permission to perform this action.');
      
      case 404:
        throw new Error(data?.message || 'The requested resource was not found.');
      
      case 409:
        throw new Error(data?.message || 'A conflict occurred. This resource may already exist.');
      
      case 422:
        throw new Error(data?.message || 'Invalid data provided. Please check your input.');
      
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      
      case 500:
        throw new Error('Server error. Please try again later.');
      
      case 502:
      case 503:
      case 504:
        throw new Error('Service temporarily unavailable. Please try again later.');
      
      default:
        throw new Error(data?.message || `Request failed with status ${status}`);
    }
  }
);

// Retry function for failed requests
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

export const authService = {
  login: async (email, password) => {
    return retryRequest(async () => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    });
  },

  register: async (userData) => {
    return retryRequest(async () => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    });
  },

  getProfile: async () => {
    return retryRequest(async () => {
      const response = await api.get('/auth/profile');
      return response.data;
    });
  },

  updateProfile: async (profileData) => {
    return retryRequest(async () => {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    });
  },

  changePassword: async (passwordData) => {
    return retryRequest(async () => {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    });
  },

  forgotPassword: async (email) => {
    return retryRequest(async () => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    });
  },

  resetPassword: async (token, password) => {
    return retryRequest(async () => {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    });
  },

  // Health check function
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

