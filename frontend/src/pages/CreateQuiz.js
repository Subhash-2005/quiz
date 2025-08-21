import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState(null);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: 'Medium',
    isPublic: true, // Default to public
    timeLimit: 10,
    tags: [],
    questions: [
      {
        questionText: '',
        questionType: 'MCQ',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: '',
        points: 1
      }
    ]
  });

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...quizData.questions];
    
    if (name === 'questionType') {
      // When changing question type, reset the correct answer fields
      questions[index] = {
        ...questions[index],
        [name]: value,
        correctAnswer: '',
        options: questions[index].options.map(opt => ({ ...opt, isCorrect: false }))
      };
    } else {
      questions[index] = {
        ...questions[index],
        [name]: value
      };
    }
    
    setQuizData({ ...quizData, questions });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const { value } = e.target;
    const questions = [...quizData.questions];
    questions[qIndex].options[oIndex].text = value;
    setQuizData({ ...quizData, questions });
  };

  const handleCorrectAnswerChange = (qIndex, correctValue) => {
    const questions = [...quizData.questions];
    const question = questions[qIndex];
    
    if (question.questionType === 'MCQ') {
      // For MCQ, correctValue is the index of the correct option
      question.options.forEach((opt, index) => {
        opt.isCorrect = index === correctValue;
      });
      question.correctAnswer = ''; // Clear single answer field
    } else {
      // For single answer, correctValue is the answer text
      question.correctAnswer = correctValue;
      // Clear all MCQ correct options
      question.options.forEach(opt => {
        opt.isCorrect = false;
      });
    }
    
    setQuizData({ ...quizData, questions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          questionType: 'MCQ',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          correctAnswer: '',
          points: 1
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const questions = [...quizData.questions];
      questions.splice(index, 1);
      setQuizData({ ...quizData, questions });
    }
  };

  const addOption = (qIndex) => {
    const questions = [...quizData.questions];
    questions[qIndex].options.push({ text: '', isCorrect: false });
    setQuizData({ ...quizData, questions });
  };

  const removeOption = (qIndex, oIndex) => {
    const questions = [...quizData.questions];
    if (questions[qIndex].options.length > 2) {
      questions[qIndex].options.splice(oIndex, 1);
      setQuizData({ ...quizData, questions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API
      const submitData = {
        ...quizData,
        questions: quizData.questions.map(q => {
          if (q.questionType === 'MCQ') {
            return {
              questionText: q.questionText,
              questionType: q.questionType,
              options: q.options,
              points: q.points
            };
          } else {
            return {
              questionText: q.questionText,
              questionType: q.questionType,
              correctAnswer: q.correctAnswer,
              points: q.points
            };
          }
        })
      };
      
      const response = await quizService.createQuiz(submitData);
      
      if (!quizData.isPublic && response.accessCode) {
        setAccessCode(response.accessCode);
        toast.success('Private quiz created with access code!');
      } else {
        toast.success('Quiz created successfully!');
        navigate(`/quiz/${response.quiz._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Quiz</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Quiz Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Quiz Title *</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Topic *</label>
            <input
              type="text"
              name="topic"
              value={quizData.topic}
              onChange={handleQuizChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mathematics, Science"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={quizData.description}
            onChange={handleQuizChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what this quiz is about"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Difficulty *</label>
            <select
              name="difficulty"
              value={quizData.difficulty}
              onChange={handleQuizChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Time Limit (minutes) *</label>
            <input
              type="number"
              name="timeLimit"
              value={quizData.timeLimit}
              onChange={handleQuizChange}
              min="1"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={quizData.isPublic}
                onChange={(e) => setQuizData({...quizData, isPublic: e.target.checked})}
                className="mr-2"
              />
              <span className="text-gray-700">Public Quiz</span>
            </label>
          </div>
        </div>
        
        {/* Questions Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Question
            </button>
          </div>
          
          {quizData.questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Question {qIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Question Text *</label>
                <input
                  type="text"
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Question Type *</label>
                <select
                  name="questionType"
                  value={question.questionType}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="SingleAnswer">Text Answer</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Points *</label>
                <input
                  type="number"
                  name="points"
                  value={question.points}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  min="1"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {question.questionType === 'MCQ' ? (
                <div>
                  <label className="block text-gray-700 mb-2">Options *</label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`correctOption-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                          placeholder={`Option ${oIndex + 1}`}
                          required
                          className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 mb-2">Correct Answer *</label>
                  <input
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>
      
      {/* Access Code Modal */}
      {accessCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {quizData.isPublic ? 'Quiz Created!' : 'Private Quiz Created!'}
            </h3>
            
            {!quizData.isPublic ? (
              <>
                <p className="mb-4">Your quiz is private. Share this access code with others to allow them to join:</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="text-center">
                    <span className="text-2xl font-mono font-bold">{accessCode}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="mb-4">Your public quiz has been created successfully!</p>
            )}
            
            <div className="flex justify-between">
              {!quizData.isPublic && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accessCode);
                    toast.success('Access code copied to clipboard!');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Copy Code
                </button>
              )}
              <button
                onClick={() => {
                  setAccessCode(null);
                  navigate(quizData.isPublic ? '/' : '/profile');
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                {quizData.isPublic ? 'Browse Quizzes' : 'Go to Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;