const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOptions: [String], // For MCQ questions
  answer: String, // For single answer questions
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [userAnswerSchema],
  score: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  timeTaken: {
    type: Number,
    default: 0 // or null if you prefer
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'completed'
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 300
    }
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
attemptSchema.pre('save', function(next) {
  if (this.isModified('score') || this.isModified('totalPoints')) {
    this.percentage = (this.score / this.totalPoints) * 100;
  }
  next();
});

// Index for better query performance
attemptSchema.index({ userId: 1, quizId: 1 });
attemptSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);