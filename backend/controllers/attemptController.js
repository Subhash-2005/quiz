const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Start a quiz attempt
const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user can access private quiz
    if (!quiz.isPublic && 
        quiz.createdBy.toString() !== req.user._id.toString() &&
        !quiz.participants.some(p => p.user.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access to private quiz denied' });
    }
    
    // Check if there's an existing in-progress attempt
    const existingAttempt = await Attempt.findOne({
      userId: req.user._id,
      quizId,
      status: 'in-progress'
    });
    
    if (existingAttempt) {
      return res.json({
        message: 'Existing attempt found',
        attempt: existingAttempt
      });
    }
    
    // Create new attempt
    const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);
    
    const attempt = new Attempt({
      userId: req.user._id,
      quizId,
      totalPoints,
      status: 'in-progress'
    });
    
    await attempt.save();
    
    res.status(201).json({
      message: 'Attempt started',
      attempt
    });
  } catch (error) {
    console.error('Start attempt error:', error);
    res.status(500).json({ message: 'Server error starting attempt' });
  }
};

// Submit quiz answers
const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeTaken } = req.body;

    // Defensive check
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required.' });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user._id
    }).populate('quizId');
    
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    
    if (attempt.status === 'completed') {
      return res.status(400).json({ message: 'Attempt already submitted' });
    }
    
    const quiz = attempt.quizId;
    
    // Calculate score
    let score = 0;
    const userAnswers = [];
    
    answers.forEach((userAnswer, index) => {
      const question = quiz.questions[index];
      let isCorrect = false;
      let pointsEarned = 0;
      
      if (question.questionType === 'MCQ') {
        // For MCQ, check if all correct options are selected and no incorrect ones
        const correctOptions = question.options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.text);
        
        const selectedOptions = userAnswer.selectedOptions || [];
        
        isCorrect = correctOptions.length === selectedOptions.length &&
          correctOptions.every(opt => selectedOptions.includes(opt));
      } else {
        // For single answer, check if answer matches (case insensitive)
        isCorrect = question.correctAnswer.toLowerCase() === 
          (userAnswer.answer || '').toLowerCase();
      }
      
      if (isCorrect) {
        pointsEarned = question.points;
        score += pointsEarned;
      }
      
      userAnswers.push({
        questionId: question._id,
        selectedOptions: userAnswer.selectedOptions,
        answer: userAnswer.answer,
        isCorrect,
        pointsEarned
      });
    });
    
    // Update attempt
    attempt.answers = userAnswers;
    attempt.score = score;
    attempt.timeTaken = timeTaken;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    
    await attempt.save();
    
    // Update quiz statistics
    quiz.totalAttempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.totalAttempts - 1)) + attempt.percentage) / quiz.totalAttempts;
    await quiz.save();
    
    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'stats.totalQuizzesAttempted': 1,
        'stats.totalPoints': score,
        'stats.totalScore': score
      }
    });
    
    // Recalculate user's average score
    const userAttempts = await Attempt.find({ userId: req.user._id, status: 'completed' });
    const totalPercentage = userAttempts.reduce((sum, att) => sum + att.percentage, 0);
    const averageScore = totalPercentage / userAttempts.length;
    
    await User.findByIdAndUpdate(req.user._id, {
      'stats.averageScore': averageScore || 0
    });
    
    res.json({
      message: 'Attempt submitted successfully',
      attempt
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    res.status(500).json({ message: 'Server error submitting attempt' });
  }
};

// Get user's attempt history
const getAttemptHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('quizId', 'title topic difficulty')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Attempt.countDocuments({ userId: req.user._id });
    
    res.json({
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get attempt history error:', error);
    res.status(500).json({ message: 'Server error fetching attempt history' });
  }
};

// Get specific attempt details
const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user._id
    }).populate('quizId');
    
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    
    res.json(attempt);
  } catch (error) {
    console.error('Get attempt details error:', error);
    res.status(500).json({ message: 'Server error fetching attempt details' });
  }
};

// Get leaderboard for a specific quiz
const getQuizLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { limit = 10 } = req.query;
    
    console.log('Getting quiz leaderboard for quizId:', quizId);
    
    // Validate quizId format
    if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }
    
    const leaderboard = await Attempt.find({
      quizId,
      status: 'completed'
    })
    .populate('userId', 'username')
    .sort({ score: -1, timeTaken: 1 })
    .limit(parseInt(limit));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Get quiz leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching quiz leaderboard' });
  }
};

// Get global leaderboard based on user stats
const getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    console.log('Getting global leaderboard');
    
    const leaderboard = await User.aggregate([
      // Match users who have stats
      {
        $match: {
          'stats': { $exists: true }
        }
      },
      // Project the fields we need
      {
        $project: {
          username: 1,
          totalQuizzesCreated: { $ifNull: ['$stats.totalQuizzesCreated', 0] },
          totalQuizzesAttempted: { $ifNull: ['$stats.totalQuizzesAttempted', 0] },
          averageScore: { $ifNull: ['$stats.averageScore', 0] },
          totalPoints: { $ifNull: ['$stats.totalPoints', 0] },
          leaderboardScore: {
            $add: [
              { $multiply: [{ $ifNull: ['$stats.totalQuizzesCreated', 0] }, 5] },
              { $multiply: [{ $ifNull: ['$stats.totalQuizzesAttempted', 0] }, 2] },
              { $multiply: [{ $ifNull: ['$stats.averageScore', 0] }, 0.1] },
              { $multiply: [{ $ifNull: ['$stats.totalPoints', 0] }, 0.01] }
            ]
          }
        }
      },
      // Filter out users with no activity
      {
        $match: {
          $or: [
            { totalQuizzesCreated: { $gt: 0 } },
            { totalQuizzesAttempted: { $gt: 0 } }
          ]
        }
      },
      // Sort by leaderboard score
      { $sort: { leaderboardScore: -1 } },
      // Limit results
      { $limit: parseInt(limit) }
    ]);
    
    console.log(`Found ${leaderboard.length} users for global leaderboard`);
    res.json(leaderboard);
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching global leaderboard' });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptHistory,
  getAttemptDetails,
  getQuizLeaderboard,
  getGlobalLeaderboard
};

