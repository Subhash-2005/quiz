const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createQuiz,
  getPublicQuizzes,
  getQuiz,
  getUserQuizzes,
  updateQuiz,
  deleteQuiz,
  rateQuiz,
  getQuizAnalytics,
  joinQuizByCode,
  getQuizResults, // New import
  regenerateAccessCode
} = require('../controllers/quizController');

// Public routes
router.get('/public', getPublicQuizzes);

// Protected routes (require authentication)
router.post('/', authMiddleware, createQuiz);
router.get('/user', authMiddleware, getUserQuizzes);
router.get('/:id', authMiddleware, getQuiz);
router.put('/:id', authMiddleware, updateQuiz);
router.delete('/:id', authMiddleware, deleteQuiz);
router.post('/:id/rate', authMiddleware, rateQuiz);
router.get('/:id/analytics', authMiddleware, getQuizAnalytics);
router.post('/join-by-code', authMiddleware, joinQuizByCode);
router.get('/:id/results', authMiddleware, getQuizResults); // New route
router.patch('/:id/regenerate-code', authMiddleware, regenerateAccessCode);

module.exports = router;

