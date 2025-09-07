import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService_with_results.js';
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
    isPublic: true,
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
      question.options.forEach((opt, index) => {
        opt.isCorrect = index === correctValue;
      });
      question.correctAnswer = '';
    } else {
      question.correctAnswer = correctValue;
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
    <div style={{
      background: 'linear-gradient(180deg, #0A0F29 0%, rgba(108, 99, 255, 0.2) 100%)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(0, 245, 212, 0.1) 0%, transparent 70%), radial-gradient(circle at 70% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 70%)',
        zIndex: 1
      }}></div>

      <div style={{
        maxWidth: '64rem',
        margin: '0 auto',
        background: 'rgba(10, 15, 41, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid rgba(108, 99, 255, 0.3)',
        boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)',
        position: 'relative',
        zIndex: 2,
        color: '#F8F9FA'
      }}>
        <h2 style={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          color: '#F8F9FA',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #00F5D4',
          paddingBottom: '0.5rem'
        }}>Forge a New Quest</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#A1A1AA',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>Quest Title *</label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizChange}
                required
                placeholder="Enter quest title"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(108, 99, 255, 0.2)',
                  border: '1px solid #00F5D4',
                  borderRadius: '8px',
                  color: '#F8F9FA',
                  fontFamily: '"Inter", sans-serif',
                  outline: 'none',
                  boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                color: '#A1A1AA',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>Topic *</label>
              <input
                type="text"
                name="topic"
                value={quizData.topic}
                onChange={handleQuizChange}
                required
                placeholder="e.g., Arcane Mathematics, Cosmic Science"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(108, 99, 255, 0.2)',
                  border: '1px solid #00F5D4',
                  borderRadius: '8px',
                  color: '#F8F9FA',
                  fontFamily: '"Inter", sans-serif',
                  outline: 'none',
                  boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#A1A1AA',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }}>Description</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleQuizChange}
              rows={3}
              placeholder="Describe the lore of this quest"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(108, 99, 255, 0.2)',
                border: '1px solid #00F5D4',
                borderRadius: '8px',
                color: '#F8F9FA',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
              }}
            />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#A1A1AA',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>Difficulty *</label>
              <select
                name="difficulty"
                value={quizData.difficulty}
                onChange={handleQuizChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(108, 99, 255, 0.2)',
                  border: '1px solid #00F5D4',
                  borderRadius: '8px',
                  color: '#F8F9FA',
                  fontFamily: '"Inter", sans-serif',
                  outline: 'none',
                  boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                color: '#A1A1AA',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>Time Limit (minutes) *</label>
              <input
                type="number"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(108, 99, 255, 0.2)',
                  border: '1px solid #00F5D4',
                  borderRadius: '8px',
                  color: '#F8F9FA',
                  fontFamily: '"Inter", sans-serif',
                  outline: 'none',
                  boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00F5D4';
                  e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: '#A1A1AA'
              }}>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={quizData.isPublic}
                  onChange={(e) => setQuizData({...quizData, isPublic: e.target.checked})}
                  style={{
                    marginRight: '0.5rem',
                    accentColor: '#00F5D4'
                  }}
                />
                <span style={{ fontSize: '0.9rem' }}>Public Quest</span>
              </label>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #00F5D4' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingTop: '1rem'
            }}>
              <h3 style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#F8F9FA'
              }}>Trials</h3>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: '#00F5D4',
                  color: '#0A0F29',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 'bold',
                  border: 'none',
                  boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: '#FFD700',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
                  }
                }}
              >
                Add Trial
              </button>
            </div>
            
            {quizData.questions.map((question, qIndex) => (
              <div key={qIndex} style={{
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: 'rgba(108, 99, 255, 0.1)',
                boxShadow: '0 0 10px rgba(108, 99, 255, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#F8F9FA'
                  }}>Trial {qIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    style={{
                      background: '#FF4D4D',
                      color: '#F8F9FA',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      border: 'none',
                      boxShadow: '0 0 5px rgba(255, 77, 77, 0.5)',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: '#FFD700',
                        color: '#0A0F29'
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#A1A1AA',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>Trial Text *</label>
                  <input
                    type="text"
                    name="questionText"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    required
                    placeholder="Enter your trial"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(108, 99, 255, 0.2)',
                      border: '1px solid #00F5D4',
                      borderRadius: '8px',
                      color: '#F8F9FA',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#A1A1AA',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>Trial Type *</label>
                  <select
                    name="questionType"
                    value={question.questionType}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(108, 99, 255, 0.2)',
                      border: '1px solid #00F5D4',
                      borderRadius: '8px',
                      color: '#F8F9FA',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                    }}
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="SingleAnswer">Text Answer</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#A1A1AA',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>Points *</label>
                  <input
                    type="number"
                    name="points"
                    value={question.points}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    min="1"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(108, 99, 255, 0.2)',
                      border: '1px solid #00F5D4',
                      borderRadius: '8px',
                      color: '#F8F9FA',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#00F5D4';
                      e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                    }}
                  />
                </div>
                
                {question.questionType === 'MCQ' ? (
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#A1A1AA',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>Options *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="radio"
                            name={`correctOption-${qIndex}`}
                            checked={option.isCorrect}
                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                            style={{
                              marginRight: '0.5rem',
                              accentColor: '#00F5D4'
                            }}
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                            placeholder={`Option ${oIndex + 1}`}
                            required
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              background: 'rgba(108, 99, 255, 0.2)',
                              border: '1px solid #00F5D4',
                              borderRadius: '6px',
                              color: '#F8F9FA',
                              fontFamily: '"Inter", sans-serif',
                              outline: 'none',
                              boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#00F5D4';
                              e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#00F5D4';
                              e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                            }}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              style={{
                                marginLeft: '0.5rem',
                                color: '#FF4D4D',
                                background: 'none',
                                border: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                  color: '#FFD700'
                                }
                              }}
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
                      style={{
                        marginTop: '0.5rem',
                        color: '#00F5D4',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          color: '#FFD700',
                          textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
                        }
                      }}
                    >
                      + Add Option
                    </button>
                  </div>
                ) : (
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#A1A1AA',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>Correct Answer *</label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                      required
                      placeholder="Enter the correct answer"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(108, 99, 255, 0.2)',
                        border: '1px solid #00F5D4',
                        borderRadius: '8px',
                        color: '#F8F9FA',
                        fontFamily: '"Inter", sans-serif',
                        endow: 'none',
                        boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#00F5D4';
                        e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#00F5D4';
                        e.target.style.boxShadow = '0 0 5px rgba(0, 245, 212, 0.3)';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#6C63FF',
              color: '#F8F9FA',
              border: 'none',
              borderRadius: '8px',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ':hover': {
                background: '#FFD700',
                color: '#0A0F29',
                boxShadow: loading ? '0 0 15px rgba(108, 99, 255, 0.5)' : '0 0 20px rgba(255, 215, 0, 0.8)',
                transform: loading ? 'none' : 'translateY(-2px)'
              }
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>⚔️</span>
            {loading ? 'Forging Quest...' : 'Forge Quest'}
          </button>
        </form>
        
        {accessCode && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              background: 'rgba(10, 15, 41, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '28rem',
              width: '100%',
              border: '1px solid rgba(0, 245, 212, 0.3)',
              boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)',
              color: '#F8F9FA'
            }}>
              <h3 style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#F8F9FA',
                marginBottom: '1rem'
              }}>
                {quizData.isPublic ? 'Quest Forged!' : 'Secret Quest Forged!'}
              </h3>
              
              {!quizData.isPublic ? (
                <>
                  <p style={{
                    marginBottom: '1rem',
                    color: '#A1A1AA',
                    fontSize: '0.9rem'
                  }}>Your quest is hidden. Share this secret code to allow others to embark:</p>
                  <div style={{
                    background: 'rgba(108, 99, 255, 0.2)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#00F5D4',
                      textShadow: '0 0 5px rgba(0, 245, 212, 0.5)'
                    }}>{accessCode}</span>
                  </div>
                </>
              ) : (
                <p style={{
                  marginBottom: '1rem',
                  color: '#A1A1AA',
                  fontSize: '0.9rem'
                }}>Your public quest has been forged successfully!</p>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {!quizData.isPublic && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(accessCode);
                      toast.success('Access code copied to clipboard!');
                    }}
                    style={{
                      background: '#00F5D4',
                      color: '#0A0F29',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold',
                      boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: '#FFD700',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
                      }
                    }}
                  >
                    Copy Code
                  </button>
                )}
                <button
                  onClick={() => {
                    setAccessCode(null);
                    navigate(quizData.isPublic ? '/' : '/profile');
                  }}
                  style={{
                    background: '#A1A1AA',
                    color: '#F8F9FA',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(161, 161, 170, 0.5)',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      background: '#FFD700',
                      color: '#0A0F29',
                      boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
                    }
                  }}
                >
                  {quizData.isPublic ? 'Browse Quests' : 'Go to Profile'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;