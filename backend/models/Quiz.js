const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['MCQ', 'SingleAnswer'],
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.questionType === 'SingleAnswer';
    }
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  explanation: {
    type: String,
    maxlength: 500
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  accessCode: {
    type: String,
    unique: true,
    sparse: true
  },
  timeLimit: {
    type: Number, // in minutes
    default: 10,
    min: 1
  },
  tags: [String],
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 300
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Update average rating when new ratings are added
quizSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
};

// Add to the Quiz model
quizSchema.statics.generateUniqueCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let code;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingQuiz = await this.findOne({ accessCode: code });
    if (!existingQuiz) isUnique = true;
  }

  return code;
};

// Pre-save middleware to update average rating
quizSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.updateAverageRating();
  }
  next();
});

// Add pre-save middleware to generate access code for private quizzes
quizSchema.pre('save', async function(next) {
  if (this.isNew && !this.isPublic && !this.accessCode) {
    this.accessCode = await this.constructor.generateUniqueCode();
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);