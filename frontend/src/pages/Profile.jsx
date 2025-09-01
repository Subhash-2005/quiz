import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { attemptService } from '../services/attemptService';
import QuizCard from '../components/QuizCard';
import Leaderboard from '../components/Leaderboard';
import AnalyticsChart from '../components/AnalyticsChart';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    quizzes: false,
    attempts: false
  });

  // Memoize private quizzes to avoid recalculation
  const privateQuizzes = useMemo(() => {
    return userQuizzes.filter(q => !q.isPublic);
  }, [userQuizzes]);

  // Memoize user stats to avoid recalculation
  const userStats = useMemo(() => {
    return {
      totalQuizzesCreated: currentUser?.stats?.totalQuizzesCreated || 0,
      totalQuizzesAttempted: currentUser?.stats?.totalQuizzesAttempted || 0,
      averageScore: Math.round(currentUser?.stats?.averageScore || 0),
      totalPoints: currentUser?.stats?.totalPoints || 0
    };
  }, [currentUser?.stats]);

  const loadUserQuizzes = useCallback(async () => {
    if (dataLoaded.quizzes) return;
    
    try {
      const response = await quizService.getUserQuizzes();
      setUserQuizzes(response.quizzes || []);
      setDataLoaded(prev => ({ ...prev, quizzes: true }));
    } catch (error) {
      console.error('Error loading user quizzes:', error);
      toast.error('Failed to load your quizzes');
    }
  }, [dataLoaded.quizzes]);

  const loadAttemptHistory = useCallback(async () => {
    if (dataLoaded.attempts) return;
    
    try {
      const response = await attemptService.getAttemptHistory();
      setAttemptHistory(response.attempts || []);
      setDataLoaded(prev => ({ ...prev, attempts: true }));
    } catch (error) {
      console.error('Error loading attempt history:', error);
      toast.error('Failed to load attempt history');
    }
  }, [dataLoaded.attempts]);

  const loadInitialData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Load data based on active tab to improve initial load time
      if (activeTab === 'quizzes' || activeTab === 'access-codes') {
        await loadUserQuizzes();
      } else if (activeTab === 'attempts' || activeTab === 'analytics') {
        await loadAttemptHistory();
      } else {
        // Load both for other tabs
        await Promise.all([loadUserQuizzes(), loadAttemptHistory()]);
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab, loadUserQuizzes, loadAttemptHistory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load data when tab changes
  useEffect(() => {
    if (!currentUser || loading) return;

    if ((activeTab === 'quizzes' || activeTab === 'access-codes') && !dataLoaded.quizzes) {
      loadUserQuizzes();
    } else if ((activeTab === 'attempts' || activeTab === 'analytics') && !dataLoaded.attempts) {
      loadAttemptHistory();
    }
  }, [activeTab, currentUser, loading, dataLoaded, loadUserQuizzes, loadAttemptHistory]);

  const copyAccessCode = useCallback((code) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied!');
  }, []);

  if (loading || !currentUser) {
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
          <p style={{ fontSize: '1.2rem', color: '#F8F9FA' }}>Loading your profile...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0A0F29',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Inter", sans-serif',
      color: '#F8F9FA'
    }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        background: 'rgba(108, 99, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid #6C63FF',
        boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
      }}>
        {/* User Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #00F5D4',
          paddingBottom: '1rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#6C63FF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F8F9FA',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
            border: '2px solid #FFD700'
          }}>
            {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ marginLeft: '1.5rem' }}>
            <h2 style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              fontSize: '1.8rem',
              color: '#F8F9FA',
              textShadow: '0 0 10px rgba(108, 99, 255, 0.5)'
            }}>{currentUser?.username || 'User'}</h2>
            <p style={{ color: '#A1A1AA', fontSize: '1rem' }}>{currentUser?.email || 'No email'}</p>
            {currentUser?.profile?.bio && (
              <p style={{ color: '#A1A1AA', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {currentUser.profile.bio}
              </p>
            )}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
            }}>
              {userStats.totalQuizzesCreated}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>Quests Forged</div>
          </div>
          
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
            }}>
              {userStats.totalQuizzesAttempted}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>Quests Taken</div>
          </div>
          
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
            }}>
              {userStats.averageScore}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>Average Score</div>
          </div>
          
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
            }}>
              {userStats.totalPoints}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>Total Points</div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div style={{ background: 'rgba(108, 99, 255, 0.1)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{
            borderBottom: '1px solid #00F5D4',
            marginBottom: '1.5rem'
          }}>
            <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { key: 'quizzes', label: 'My Quests' },
                { key: 'attempts', label: 'Quest History' },
                { key: 'access-codes', label: 'Access Codes' },
                { key: 'analytics', label: 'Analytics' },
                { key: 'leaderboard', label: 'Leaderboard' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: activeTab === tab.key ? 'rgba(108, 99, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid #6C63FF' : '2px solid transparent',
                    color: activeTab === tab.key ? '#6C63FF' : '#A1A1AA',
                    fontWeight: 'medium',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textShadow: activeTab === tab.key ? '0 0 5px rgba(108, 99, 255, 0.5)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'quizzes' && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#F8F9FA',
                textShadow: '0 0 5px rgba(108, 99, 255, 0.5)'
              }}>My Quests ({userQuizzes.length})</h3>
              {userQuizzes.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#A1A1AA',
                  background: 'rgba(108, 99, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px dashed #6C63FF'
                }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No quests forged yet!</p>
                  <p style={{ fontSize: '0.9rem' }}>Create your first quiz to start your legend.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {userQuizzes.map(quiz => (
                    <QuizCard key={quiz._id} quiz={quiz} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'attempts' && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#F8F9FA',
                textShadow: '0 0 5px rgba(108, 99, 255, 0.5)'
              }}>Quest History ({attemptHistory.length})</h3>
              {attemptHistory.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#A1A1AA',
                  background: 'rgba(108, 99, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px dashed #6C63FF'
                }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No quest attempts yet!</p>
                  <p style={{ fontSize: '0.9rem' }}>Start taking quizzes to build your legend.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {attemptHistory.slice(0, 10).map(attempt => (
                    <div key={attempt._id} style={{
                      background: 'rgba(108, 99, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid #6C63FF',
                      boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ color: '#F8F9FA', marginBottom: '0.5rem' }}>
                            {attempt.quizId?.title || 'Unknown Quiz'}
                          </h4>
                          <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>
                            {attempt.quizId?.topic} • {attempt.quizId?.difficulty}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: attempt.percentage >= 80 ? '#00F5D4' : 
                                   attempt.percentage >= 60 ? '#FFD700' : '#FF6B6B'
                          }}>
                            {attempt.percentage}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>
                            {attempt.score}/{attempt.totalPoints} points
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'access-codes' && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#F8F9FA',
                textShadow: '0 0 5px rgba(108, 99, 255, 0.5)'
              }}>Private Quest Access Codes</h3>
              {privateQuizzes.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#A1A1AA',
                  background: 'rgba(108, 99, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px dashed #6C63FF'
                }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No private quests yet!</p>
                  <p style={{ fontSize: '0.9rem' }}>Create private quizzes to generate access codes.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {privateQuizzes.map(quiz => (
                    <div key={quiz._id} style={{
                      background: 'rgba(108, 99, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid #6C63FF',
                      boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ color: '#F8F9FA', marginBottom: '0.5rem' }}>{quiz.title}</h4>
                          <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>
                            {quiz.topic} • {quiz.difficulty}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            background: 'rgba(0, 245, 212, 0.1)',
                            border: '1px solid #00F5D4',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            color: '#00F5D4',
                            fontWeight: 'bold'
                          }}>
                            {quiz.accessCode}
                          </div>
                          <button
                            onClick={() => copyAccessCode(quiz.accessCode)}
                            style={{
                              background: '#6C63FF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              color: '#F8F9FA',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#F8F9FA',
                textShadow: '0 0 5px rgba(108, 99, 255, 0.5)'
              }}>Quest Analytics</h3>
              <AnalyticsChart attempts={attemptHistory} />
            </div>
          )}
          
          {activeTab === 'leaderboard' && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#F8F9FA',
                textShadow: '0 0 5px rgba(108, 99, 255, 0.5)'
              }}>Global Leaderboard</h3>
              <Leaderboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

