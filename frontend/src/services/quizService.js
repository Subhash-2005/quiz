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

export const quizService = {
  createQuiz: async (quizData) => {
    const response = await api.post('/quiz', quizData);
    return response.data;
  },

  getPublicQuizzes: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await api.get(`/quiz/public?${params}`);
    return response.data;
  },

  getQuiz: async (id) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },

  getUserQuizzes: async () => {
    const response = await api.get('/quiz/user');
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/quiz/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
  },

  rateQuiz: async (id, ratingData) => {
    const response = await api.post(`/quiz/${id}/rate`, ratingData);
    return response.data;
  },

  getQuizAnalytics: async (id) => {
    const response = await api.get(`/quiz/${id}/analytics`);
    return response.data;
  },

  joinQuizByCode: async (code) => {
    const response = await api.post('/quiz/join-by-code', { code });
    return response.data;
  },

  getGlobalLeaderboard: async () => {
    const response = await api.get('/quiz/leaderboard/global');
    return response.data;
  }
};
