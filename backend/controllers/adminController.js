const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// Get platform analytics
const getPlatformAnalytics = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments({ isActive: true });
    const totalAttempts = await Attempt.countDocuments({ status: 'completed' });
    
    // Get popular topics
    const popularTopics = await Quiz.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get difficulty distribution
    const difficultyDistribution = await Quiz.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    // Get recent activity
    const recentQuizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentAttempts = await Attempt.find({ status: 'completed' })
      .populate('userId', 'username')
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .limit(5);
    
    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    res.json({
      totals: {
        users: totalUsers,
        quizzes: totalQuizzes,
        attempts: totalAttempts
      },
      popularTopics,
      difficultyDistribution,
      recentActivity: {
        quizzes: recentQuizzes,
        attempts: recentAttempts
      },
      userGrowth
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// Get all users with stats
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const quizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Quiz.countDocuments({ isActive: true });
    
    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

// Get all attempts
const getAllAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const attempts = await Attempt.find({ status: 'completed' })
      .populate('userId', 'username')
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Attempt.countDocuments({ status: 'completed' });
    
    res.json({
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all attempts error:', error);
    res.status(500).json({ message: 'Server error fetching attempts' });
  }
};

// Deactivate quiz
const deactivateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { isActive: false },
      { new: true }
    );
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deactivated successfully' });
  } catch (error) {
    console.error('Deactivate quiz error:', error);
    res.status(500).json({ message: 'Server error deactivating quiz' });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also deactivate all quizzes by this user
    await Quiz.updateMany(
      { createdBy: userId },
      { isActive: false }
    );
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Server error deactivating user' });
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllUsers,
  getAllQuizzes,
  getAllAttempts,
  deactivateQuiz,
  deactivateUser
};