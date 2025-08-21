const calculateQuizStats = (quiz, attempts) => {
  if (attempts.length === 0) {
    return {
      averageScore: 0,
      completionRate: 0,
      questionStats: []
    };
  }

  // Calculate average score
  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
  const averageScore = totalScore / attempts.length;

  // Calculate completion rate
  const totalStarted = attempts.length; // This would need a way to track started but not completed attempts
  const completed = attempts.filter(a => a.status === 'completed').length;
  const completionRate = (completed / totalStarted) * 100;

  // Calculate question statistics
  const questionStats = quiz.questions.map((question, index) => {
    const correctAnswers = attempts.filter(attempt => {
      const answer = attempt.answers.find(a => a.questionId.toString() === question._id.toString());
      return answer && answer.isCorrect;
    }).length;

    const accuracy = (correctAnswers / attempts.length) * 100;

    return {
      questionId: question._id,
      questionIndex: index,
      correctAnswers,
      accuracy: parseFloat(accuracy.toFixed(2)) || 0
    };
  });

  return {
    averageScore: parseFloat(averageScore.toFixed(2)),
    completionRate: parseFloat(completionRate.toFixed(2)),
    questionStats
  };
};

const getRecommendations = async (userId, Attempt, Quiz) => {
  // Get user's attempt history
  const userAttempts = await Attempt.find({ userId })
    .populate('quizId')
    .sort({ completedAt: -1 })
    .limit(20);

  if (userAttempts.length === 0) {
    // If no attempts, return popular quizzes
    return await Quiz.find({ isPublic: true, isActive: true })
      .sort({ totalAttempts: -1, averageRating: -1 })
      .limit(10)
      .populate('createdBy', 'username');
  }

  // Extract topics and difficulties from user attempts
  const attemptedTopics = new Set();
  const attemptedDifficulties = new Set();
  
  userAttempts.forEach(attempt => {
    if (attempt.quizId) {
      attemptedTopics.add(attempt.quizId.topic);
      attemptedDifficulties.add(attempt.quizId.difficulty);
    }
  });

  // Find recommended quizzes based on similar topics and difficulties
  const recommendedQuizzes = await Quiz.find({
    isPublic: true,
    isActive: true,
    _id: { $nin: userAttempts.map(a => a.quizId._id) },
    $or: [
      { topic: { $in: Array.from(attemptedTopics) } },
      { difficulty: { $in: Array.from(attemptedDifficulties) } }
    ]
  })
  .sort({ averageRating: -1, totalAttempts: -1 })
  .limit(10)
  .populate('createdBy', 'username');

  return recommendedQuizzes;
};

module.exports = { calculateQuizStats, getRecommendations };