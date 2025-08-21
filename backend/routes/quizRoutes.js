const express = require('express');
const { body } = require('express-validator');

const {
  createQuiz,
  getPublicQuizzes,
  getQuiz,
  getUserQuizzes,
  updateQuiz,
  deleteQuiz,
  rateQuiz,
  getQuizAnalytics,
  regenerateAccessCode,
  joinQuizByCode
} = require('../controllers/quizController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const quizValidation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('topic')
    .isLength({ min: 1, max: 50 })
    .withMessage('Topic is required'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Quiz must have at least one question'),
  body('questions.*.questionText')
    .isLength({ min: 1, max: 500 })
    .withMessage('Question text is required'),
  body('questions.*.points')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points must be at least 1'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be at least 1 minute')
];

// Routes
router.post('/', authMiddleware, quizValidation, createQuiz);
router.get('/public', getPublicQuizzes);
router.get('/user', authMiddleware, getUserQuizzes);
router.get('/:id', authMiddleware, getQuiz);
router.put('/:id', authMiddleware, updateQuiz);
router.delete('/:id', authMiddleware, deleteQuiz);
router.post('/:id/rate', authMiddleware, rateQuiz);
router.get('/:id/analytics', authMiddleware, getQuizAnalytics);
router.patch('/:id/regenerate-code', authMiddleware, regenerateAccessCode);
router.post('/join-by-code', authMiddleware, joinQuizByCode);

module.exports = router;