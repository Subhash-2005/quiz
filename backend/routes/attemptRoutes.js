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

// Routes
router.post('/:quizId/start', authMiddleware, startAttempt);
router.post('/:attemptId/submit', authMiddleware, submitAttempt);
router.get('/history', authMiddleware, getAttemptHistory);
router.get('/:attemptId', authMiddleware, getAttemptDetails);
router.get('/leaderboard/:quizId', getQuizLeaderboard);
router.get('/leaderboard/global', getGlobalLeaderboard);

module.exports = router;