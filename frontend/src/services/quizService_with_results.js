import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for failed requests
const retryRequest = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

  // ✅ FIXED — Correct leaderboard routes
  getGlobalLeaderboard: async () => {
    return retryRequest(async () => {
      const response = await api.get('/attempt/leaderboard/global');
      return response.data;
    });
  },

  getQuizLeaderboard: async (id) => {
    return retryRequest(async () => {
      const response = await api.get(`/attempt/leaderboard/${id}`);
      return response.data;
    });
  },

  regenerateAccessCode: async (id) => {
    return retryRequest(async () => {
      const response = await api.patch(`/quiz/${id}/regenerate-code`);
      return response.data;
    });
  },

  getQuizResults: async (id) => {
    return retryRequest(async () => {
      const response = await api.get(`/quiz/${id}/results`);
      return response.data;
    });
  }
};