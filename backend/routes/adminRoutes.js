const express = require('express');
const {
  getPlatformAnalytics,
  getAllUsers,
  getAllQuizzes,
  getAllAttempts,
  deactivateQuiz,
  deactivateUser
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Routes
router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.get('/quizzes', getAllQuizzes);
router.get('/attempts', getAllAttempts);
router.patch('/quiz/:quizId/deactivate', deactivateQuiz);
router.patch('/user/:userId/deactivate', deactivateUser);

module.exports = router;