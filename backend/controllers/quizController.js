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

// Add a new function to join quiz by access code
const joinQuizByCode = async (req, res) => {
  try {
    const { code } = req.body;
    const quiz = await Quiz.findOne({ accessCode: code, isActive: true });

    if (!quiz) {
      return res.status(404).json({ message: 'Invalid access code or quiz not found' });
    }
    if (quiz.isPublic) {
      return res.status(400).json({ message: 'This quiz is public. You can access it directly.' });
    }

    // Add user to joinedUsers if not already present
    if (!quiz.joinedUsers) quiz.joinedUsers = [];
    if (!quiz.joinedUsers.some(u => u.toString() === req.user._id.toString())) {
      quiz.joinedUsers.push(req.user._id);
      await quiz.save();
    }

    res.json({
      message: 'Quiz access granted',
      quiz
    });
  } catch (error) {
    console.error('Join quiz error:', error);
    res.status(500).json({ message: 'Server error joining quiz' });
  }
};

// Get all public quizzes with filtering
const getPublicQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, topic, difficulty, search } = req.query;
    
    const filter = { isPublic: true, isActive: true };
    
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { topic: new RegExp(search, 'i') }
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
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

// Get quiz by ID or access code
const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    let quiz;
    if (id.length === 24) { // MongoDB ObjectId length
      quiz = await Quiz.findOne({
        $or: [
          { _id: id, isActive: true },
          { accessCode: id, isActive: true }
        ]
      }).populate('createdBy', 'username');
    } else {
      quiz = await Quiz.findOne({
        accessCode: id,
        isActive: true
      }).populate('createdBy', 'username');
    }
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user can access private quiz
    if (
      !quiz.isPublic &&
      quiz.createdBy._id.toString() !== req.user._id.toString() &&
      !(quiz.joinedUsers && quiz.joinedUsers.some(u => u.toString() === req.user._id.toString()))
    ) {
      return res.status(403).json({ message: 'Access to private quiz denied' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
};

// Get user's created quizzes
const getUserQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Quiz.countDocuments({ createdBy: req.user._id });
    
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

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const quiz = await Quiz.findOne({ _id: id, createdBy: req.user._id });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or access denied' });
    }
    
    // Don't allow changing these fields
    delete updates.createdBy;
    delete updates.accessCode;
    delete updates.isPublic;
    
    Object.assign(quiz, updates);
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

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findOne({ _id: id, createdBy: req.user._id });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or access denied' });
    }
    
    // Soft delete by setting isActive to false
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
    
    // Check if user has attempted this quiz
    const attempt = await Attempt.findOne({
      userId: req.user._id,
      quizId: id,
      status: 'completed'
    });
    
    if (!attempt) {
      return res.status(403).json({ message: 'You must attempt the quiz before rating it' });
    }
    
    // Remove existing rating by this user
    quiz.ratings = quiz.ratings.filter(
      r => r.userId.toString() !== req.user._id.toString()
    );
    
    // Add new rating
    quiz.ratings.push({
      userId: req.user._id,
      rating,
      comment
    });
    
    await quiz.save();
    
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate quiz error:', error);
    res.status(500).json({ message: 'Server error rating quiz' });
  }
};

// Get quiz analytics for creator
const getQuizAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findOne({ _id: id, createdBy: req.user._id });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or access denied' });
    }
    
    const attempts = await Attempt.find({ quizId: id, status: 'completed' })
      .populate('userId', 'username');
    
    const stats = calculateQuizStats(quiz, attempts);
    
    res.json({
      quiz: {
        title: quiz.title,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        totalAttempts: quiz.totalAttempts,
        averageRating: quiz.averageRating
      },
      attempts: attempts.length,
      stats
    });
  } catch (error) {
    console.error('Get quiz analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// Regenerate access code for a private quiz
const regenerateAccessCode = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ _id: id, createdBy: req.user._id });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or access denied' });
    }

    if (quiz.isPublic) {
      return res.status(400).json({ message: 'Public quizzes do not need access codes' });
    }

    // Generate new access code
    quiz.accessCode = await Quiz.generateUniqueCode();
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
  regenerateAccessCode,
  joinQuizByCode
};