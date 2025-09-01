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

export const attemptService = {
  startAttempt: async (quizId) => {
    console.log('AttemptService - Starting attempt for quiz:', quizId);
    const token = localStorage.getItem('token');
    console.log('AttemptService - Token available:', token ? 'Yes' : 'No');
    
    const response = await api.post(`/attempt/${quizId}/start`);
    console.log('AttemptService - Start attempt response:', response.data);
    return response.data;
  },

  submitAttempt: async (attemptId, attemptData) => {
    const response = await api.post(`/attempt/${attemptId}/submit`, attemptData);
    return response.data;
  },

  getAttemptHistory: async () => {
    const response = await api.get('/attempt/history');
    return response.data;
  },

  getAttemptDetails: async (attemptId) => {
    const response = await api.get(`/attempt/${attemptId}`);
    return response.data;
  },

  getQuizLeaderboard: async (quizId) => {
    const response = await api.get(`/attempt/leaderboard/${quizId}`);
    return response.data;
  },

  getGlobalLeaderboard: async () => {
    const response = await api.get('/attempt/leaderboard/global');
    return response.data;
  }
};
