import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService_with_results.js';
import { attemptService } from '../services/attemptService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

  const loadQuiz = async () => {
    try {
      console.log('AttemptQuiz - Loading quiz with ID:', id);
      console.log('AttemptQuiz - Current user:', currentUser?.username);
      
      const quizData = await quizService.getQuiz(id);
      console.log('AttemptQuiz - Quiz loaded:', quizData.title);
      console.log('AttemptQuiz - Quiz isPublic:', quizData.isPublic);
      setQuiz(quizData);

      console.log('AttemptQuiz - Starting attempt...');
      const attemptData = await attemptService.startAttempt(id);
      console.log('AttemptQuiz - Attempt started:', attemptData);
      setAttempt(attemptData.attempt);
      
      const initialAnswers = {};
      quizData.questions.forEach((_, index) => {
        initialAnswers[index] = {
          selectedOptions: [],
          answer: ''
        };
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error loading quiz:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        toast.error('You need an access code to join this private quiz');
        navigate('/join-quiz');
        return;
      }
      toast.error('Failed to load quiz');
      navigate('/');
    } finally {
      setLoading(false);
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
    return (
      <div style={{
        background: '#0A0F29',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F8F9FA',
        fontFamily: '"Inter", sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #6C63FF',
            borderTopColor: '#00F5D4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '1.2rem', color: '#F8F9FA' }}>Preparing your battle...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{
        background: '#0A0F29',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F8F9FA',
        fontFamily: '"Inter", sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
        }}>
          <h3 style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#F8F9FA'
          }}>Quest Not Found</h3>
          <p style={{ color: '#A1A1AA' }}>The quest you seek has vanished!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0A0F29',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Inter", sans-serif',
      color: '#F8F9FA',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        background: 'rgba(108, 99, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid rgba(0, 245, 212, 0.2)',
        boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #00F5D4',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            color: '#F8F9FA',
            textShadow: '0 0 10px rgba(108, 99, 255, 0.5)'
          }}>{quiz.title}</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <span style={{
              fontSize: '1.2rem',
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
            }}> %"🎇</span>
            <span style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#F8F9FA'
            }}>
              Time: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5); }
            50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.8); }
            100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5); }
          }
        `}</style>
        
        <p style={{
          color: '#A1A1AA',
          marginBottom: '1.5rem',
          fontSize: '1rem'
        }}>{quiz.description}</p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          gap: '1rem'
        }}>
          <span style={{
            background: 'rgba(108, 99, 255, 0.2)',
            color: '#F8F9FA',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 5px rgba(108, 99, 255, 0.3)'
          }}>
            {quiz.topic}
          </span>
          <span style={{
            background: quiz.difficulty === 'Easy' ? 'rgba(0, 245, 212, 0.2)' :
                      quiz.difficulty === 'Medium' ? 'rgba(255, 215, 0, 0.2)' :
                      'rgba(255, 0, 0, 0.2)',
            color: '#F8F9FA',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: quiz.difficulty === 'Easy' ? '1px solid #00F5D4' :
                    quiz.difficulty === 'Medium' ? '1px solid #FFD700' :
                    '1px solid #FF0000',
            boxShadow: quiz.difficulty === 'Easy' ? '0 0 5px rgba(0, 245, 212, 0.3)' :
                      quiz.difficulty === 'Medium' ? '0 0 5px rgba(255, 215, 0, 0.3)' :
                      '0 0 5px rgba(255, 0, 0, 0.3)'
          }}>
            {quiz.difficulty}
          </span>
        </div>
        
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
              transition: 'all 0.3s ease',
              ':hover': {
                boxShadow: '0 0 15px rgba(0, 245, 212, 0.5)'
              }
            }}>
              <h3 style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#F8F9FA',
                marginBottom: '1rem'
              }}>
                {qIndex + 1}. {question.questionText}
                <span style={{
                  fontSize: '0.9rem',
                  color: '#A1A1AA',
                  marginLeft: '0.5rem'
                }}>({question.points} points)</span>
              </h3>
              
              {question.questionType === 'MCQ' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.8rem',
                      background: (answers[qIndex]?.selectedOptions || []).includes(oIndex) 
                        ? 'rgba(108, 99, 255, 0.2)' 
                        : 'rgba(108, 99, 255, 0.05)',
                      borderRadius: '8px',
                      border: (answers[qIndex]?.selectedOptions || []).includes(oIndex) 
                        ? '1px solid #6C63FF' 
                        : '1px solid rgba(0, 245, 212, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      ':hover': {
                        background: 'rgba(0, 245, 212, 0.1)',
                        borderColor: '#00F5D4',
                        boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)'
                      }
                    }}>
                      <input
                        type="checkbox"
                        checked={(answers[qIndex]?.selectedOptions || []).includes(oIndex)}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.checked)}
                        style={{
                          marginRight: '0.5rem',
                          accentColor: '#6C63FF'
                        }}
                      />
                      <span style={{
                        color: '#F8F9FA',
                        fontSize: '1rem'
                      }}>{option.text}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={answers[qIndex]?.answer || ''}
                    onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'rgba(108, 99, 255, 0.2)',
                      border: '1px solid #6C63FF',
                      borderRadius: '8px',
                      color: '#F8F9FA',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 5px rgba(108, 99, 255, 0.3)',
                      ':focus': {
                        borderColor: '#00F5D4',
                        boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)'
                      }
                    }}
                    placeholder="Inscribe your answer"
                  />
                </div>
              )}
            </div>
          ))}
          
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#6C63FF',
              color: '#F8F9FA',
              border: 'none',
              borderRadius: '8px',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.5 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              ':hover': {
                background: '#FFD700',
                color: '#0A0F29',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                transform: submitting ? 'none' : 'translateY(-2px)'
              }
            }}
          >
            <span style={{ fontSize: '1.2rem', textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}>🗡️</span>
            {submitting ? 'Submitting...' : 'Complete Quest'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttemptQuiz;