const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const generateUniqueCode = require('../utils/generateCode');
const { calculateQuizStats } = require('../utils/helpers');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Create a new quiz
// Update the createQuiz function to properly handle private quizzes
const createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      topic,
      difficulty,
      questions,
      isPublic,
      timeLimit,
      tags
    } = req.body;

    // Validate that questions have correct answers set
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (question.questionType === 'MCQ') {
        // Check if at least one option is marked as correct
        const hasCorrectOption = question.options.some(opt => opt.isCorrect);
        if (!hasCorrectOption) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have at least one correct option` 
          });
        }
        
        // Validate that options have text
        const hasEmptyOptions = question.options.some(opt => !opt.text.trim());
        if (hasEmptyOptions) {
          return res.status(400).json({ 
            message: `Question ${i + 1} has empty options` 
          });
        }
      } else if (question.questionType === 'SingleAnswer') {
        // Check if correct answer is provided
        if (!question.correctAnswer || !question.correctAnswer.trim()) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have a correct answer` 
          });
        }
      }
    }

    const quiz = new Quiz({
      title,
      description,
      topic,
      difficulty,
      questions,
      createdBy: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true, // Default to public
      timeLimit,
      tags
    });

    await quiz.save();

    // Update user's quiz creation stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalQuizzesCreated': 1 }
    });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz,
      accessCode: !quiz.isPublic ? quiz.accessCode : undefined
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error creating quiz' });
  }
};

// Get all public quizzes
const getPublicQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, topic, difficulty, search } = req.query;
    
    let filter = { isPublic: true, isActive: true };
    
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Quiz.countDocuments(filter);
    
    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get public quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

// Get a specific quiz by ID
const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findById(id).populate('createdBy', 'username');
    
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user can access private quiz
    if (
      !quiz.isPublic &&
      quiz.createdBy._id.toString() !== req.user._id.toString() &&
      !(quiz.joinedUsers && quiz.joinedUsers.some(u => u.toString() === req.user._id.toString())) &&
      !(quiz.participants && quiz.participants.some(p => p.user.toString() === req.user._id.toString()))
    ) {
      return res.status(403).json({ message: 'Access to private quiz denied' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
};

// Get user's own quizzes
const getUserQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const quizzes = await Quiz.find({ 
      createdBy: req.user._id,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Quiz.countDocuments({ 
      createdBy: req.user._id,
      isActive: true 
    });
    
    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching user quizzes' });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const quiz = await Quiz.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    Object.assign(quiz, updateData);
    await quiz.save();
    
    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error updating quiz' });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    quiz.isActive = false;
    await quiz.save();
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error deleting quiz' });
  }
};

// Rate a quiz
const rateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user already rated this quiz
    const existingRating = quiz.ratings.find(r => r.user.toString() === req.user._id.toString());
    
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      quiz.ratings.push({
        user: req.user._id,
        rating,
        comment
      });
    }
    
    // Recalculate average rating
    const totalRating = quiz.ratings.reduce((sum, r) => sum + r.rating, 0);
    quiz.averageRating = totalRating / quiz.ratings.length;
    
    await quiz.save();
    
    res.json({
      message: 'Rating submitted successfully',
      averageRating: quiz.averageRating
    });
  } catch (error) {
    console.error('Rate quiz error:', error);
    res.status(500).json({ message: 'Server error rating quiz' });
  }
};

// Get quiz analytics
const getQuizAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    const attempts = await Attempt.find({ 
      quizId: id, 
      status: 'completed' 
    }).populate('userId', 'username');
    
    const analytics = {
      totalAttempts: attempts.length,
      averageScore: attempts.length > 0 ? 
        attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length : 0,
      highestScore: attempts.length > 0 ? 
        Math.max(...attempts.map(attempt => attempt.percentage)) : 0,
      lowestScore: attempts.length > 0 ? 
        Math.min(...attempts.map(attempt => attempt.percentage)) : 0,
      recentAttempts: attempts.slice(-10).map(attempt => ({
        username: attempt.userId.username,
        score: attempt.score,
        percentage: attempt.percentage,
        completedAt: attempt.completedAt
      }))
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Get quiz analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// Add a new function to join quiz by access code
const joinQuizByCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!code) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    const quiz = await Quiz.findOne({ accessCode: code, isActive: true });

    if (!quiz) {
      return res.status(404).json({ message: 'Invalid access code' });
    }

    // Check if user is already a participant
    const isAlreadyParticipant = quiz.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isAlreadyParticipant) {
      quiz.participants.push({
        user: req.user._id,
        joinedAt: new Date()
      });
      await quiz.save();
    }

    res.json({
      message: 'Successfully joined the quiz',
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        difficulty: quiz.difficulty
      }
    });
  } catch (error) {
    console.error('Join quiz by code error:', error);
    res.status(500).json({ message: 'Server error joining quiz' });
  }
};

// Get quiz results for quiz creators
const getQuizResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, verify that the requesting user is the creator of this quiz
    const quiz = await Quiz.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    // Get all completed attempts for this quiz
    const attempts = await Attempt.find({ 
      quizId: id, 
      status: 'completed' 
    })
    .populate('userId', 'username email')
    .sort({ score: -1, completedAt: -1 }); // Sort by score (highest first), then by completion time
    
    // Format the results
    const results = attempts.map((attempt, index) => ({
      rank: index + 1,
      username: attempt.userId.username,
      email: attempt.userId.email,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      completedAt: attempt.completedAt,
      attemptId: attempt._id
    }));
    
    // Calculate summary statistics
    const summary = {
      totalParticipants: results.length,
      averageScore: results.length > 0 ? 
        results.reduce((sum, result) => sum + result.percentage, 0) / results.length : 0,
      highestScore: results.length > 0 ? results[0].percentage : 0,
      lowestScore: results.length > 0 ? 
        Math.min(...results.map(result => result.percentage)) : 0,
      passRate: results.length > 0 ? 
        (results.filter(result => result.percentage >= 60).length / results.length) * 100 : 0
    };
    
    res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        isPublic: quiz.isPublic,
        totalQuestions: quiz.questions.length
      },
      summary,
      results
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error fetching quiz results' });
  }
};

// Regenerate access code for private quiz
const regenerateAccessCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    if (quiz.isPublic) {
      return res.status(400).json({ message: 'Cannot regenerate access code for public quiz' });
    }
    
    quiz.accessCode = generateUniqueCode();
    await quiz.save();
    
    res.json({
      message: 'Access code regenerated successfully',
      accessCode: quiz.accessCode
    });
  } catch (error) {
    console.error('Regenerate access code error:', error);
    res.status(500).json({ message: 'Server error regenerating access code' });
  }
};

module.exports = {
  createQuiz,
  getPublicQuizzes,
  getQuiz,
  getUserQuizzes,
  updateQuiz,
  deleteQuiz,
  rateQuiz,
  getQuizAnalytics,
  joinQuizByCode,
  getQuizResults, // New function
  regenerateAccessCode
};

