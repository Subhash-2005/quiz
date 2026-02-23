const express = require('express');
const {
  startAttempt,
  submitAttempt,
  getAttemptHistory,
  getAttemptDetails,
  getQuizLeaderboard,
  getGlobalLeaderboard
} = require('../controllers/attemptController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// IMPORTANT: More specific routes must come BEFORE parameterized routes
// Global leaderboard route MUST come before the parameterized route
router.get('/leaderboard/global',authMiddleware, getGlobalLeaderboard);
router.get('/leaderboard/:quizId', authMiddleware, getQuizLeaderboard);

// Other routes
router.post('/:quizId/start', authMiddleware, startAttempt);
router.post('/:attemptId/submit', authMiddleware, submitAttempt);
router.get('/history', authMiddleware, getAttemptHistory);
router.get('/:attemptId', authMiddleware, getAttemptDetails);

module.exports = router;

