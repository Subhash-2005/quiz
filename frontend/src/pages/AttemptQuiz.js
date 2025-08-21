import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { attemptService } from '../services/attemptService';
import { useAuth } from '../context/AuthContext'; // Make sure this is imported
import toast from 'react-hot-toast';

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Add this line
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    let timer;
    if (attempt && attempt.status === 'in-progress') {
      timer = setInterval(() => {
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [attempt]);

  // Updated loadQuiz function
  const loadQuiz = async () => {
    try {
      const quizData = await quizService.getQuiz(id);
      setQuiz(quizData);

      // Check if quiz is private and user is not the creator
      if (
        !quizData.isPublic &&
        quizData.createdBy._id.toString() !== currentUser._id.toString()
      ) {
        // For private quizzes, we need to validate access
        try {
          await quizService.joinQuizByCode(id); // Using ID as code for direct access
        } catch (error) {
          toast.error('You need an access code to join this private quiz');
          navigate('/join-quiz');
          return;
        }
      }

      // Start or resume attempt
      const attemptData = await attemptService.startAttempt(quizData._id);
      setAttempt(attemptData.attempt);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load quiz');
      navigate('/');
    }
  };

  const handleAnswerChange = (questionIndex, value, isMCQ = false) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: isMCQ ? value : { answer: value }
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, isChecked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionIndex]?.selectedOptions || [];
      let newAnswers;
      
      if (isChecked) {
        newAnswers = [...currentAnswers, optionIndex];
      } else {
        newAnswers = currentAnswers.filter(i => i !== optionIndex);
      }
      
      return {
        ...prev,
        [questionIndex]: { selectedOptions: newAnswers }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const answersArray = quiz.questions.map((question, index) => {
        if (question.questionType === 'MCQ') {
          return {
            selectedOptions: (answers[index]?.selectedOptions || []).map(
              optIndex => question.options[optIndex].text
            )
          };
        } else {
          return {
            answer: answers[index]?.answer || ''
          };
        }
      });

      await attemptService.submitAttempt(attempt._id, {
        answers: answersArray,
        timeTaken
      });

      toast.success('Quiz submitted successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-center py-8">Quiz not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{quiz.title}</h2>
        <div className="text-lg font-medium">
          Time: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{quiz.description}</p>
      
      <div className="flex justify-between mb-6">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
          {quiz.topic}
        </span>
        <span className={`px-3 py-1 rounded ${
          quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {qIndex + 1}. {question.questionText}
              <span className="text-sm text-gray-500 ml-2">({question.points} points)</span>
            </h3>
            
            {question.questionType === 'MCQ' ? (
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(answers[qIndex]?.selectedOptions || []).includes(oIndex)}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.checked)}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={answers[qIndex]?.answer || ''}
                  onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your answer"
                />
              </div>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>
    </div>
  );
};

export default AttemptQuiz;