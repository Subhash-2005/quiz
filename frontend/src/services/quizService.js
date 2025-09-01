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
        // Don't auto-redirect for quiz service, let the auth context handle it
        throw new Error(data?.message || 'Authentication required. Please log in.');
      
      case 403:
        throw new Error(data?.message || 'Access denied. You may need to join this quiz first.');
      
      case 404:
        throw new Error(data?.message || 'Quiz not found.');
      
      case 409:
        throw new Error(data?.message || 'A conflict occurred.');
      
      case 422:
        throw new Error(data?.message || 'Invalid quiz data provided.');
      
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

export const quizService = {
  createQuiz: async (quizData) => {
    return retryRequest(async () => {
      const response = await api.post('/quiz', quizData);
      return response.data;
    });
  },

  getPublicQuizzes: async (filters = {}) => {
    return retryRequest(async () => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await api.get(`/quiz/public?${params}`);
      return response.data;
    });
  },

  getQuiz: async (id) => {
    return retryRequest(async () => {
      const response = await api.get(`/quiz/${id}`);
      return response.data;
    });
  },

  getUserQuizzes: async () => {
    return retryRequest(async () => {
      const response = await api.get('/quiz/user');
      return response.data;
    });
  },

  updateQuiz: async (id, quizData) => {
    return retryRequest(async () => {
      const response = await api.put(`/quiz/${id}`, quizData);
      return response.data;
    });
  },

  deleteQuiz: async (id) => {
    return retryRequest(async () => {
      const response = await api.delete(`/quiz/${id}`);
      return response.data;
    });
  },

  rateQuiz: async (id, ratingData) => {
    return retryRequest(async () => {
      const response = await api.post(`/quiz/${id}/rate`, ratingData);
      return response.data;
    });
  },

  getQuizAnalytics: async (id) => {
    return retryRequest(async () => {
      const response = await api.get(`/quiz/${id}/analytics`);
      return response.data;
    });
  },

  joinQuizByCode: async (code) => {
    return retryRequest(async () => {
      const response = await api.post('/quiz/join-by-code', { code });
      return response.data;
    });
  },

  getGlobalLeaderboard: async () => {
    return retryRequest(async () => {
      const response = await api.get('/quiz/leaderboard/global');
      return response.data;
    }, 2); // Fewer retries for leaderboard
  },

  getQuizLeaderboard: async (id) => {
    return retryRequest(async () => {
      const response = await api.get(`/quiz/${id}/leaderboard`);
      return response.data;
    }, 2); // Fewer retries for leaderboard
  },

  regenerateAccessCode: async (id) => {
    return retryRequest(async () => {
      const response = await api.patch(`/quiz/${id}/regenerate-code`);
      return response.data;
    });
  }
};

