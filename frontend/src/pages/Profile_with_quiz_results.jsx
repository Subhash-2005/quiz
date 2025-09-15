import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService_with_results.js';
import { attemptService } from '../services/attemptService';
import toast from 'react-hot-toast';
import AnalyticsChart from '../components/AnalyticsChart';
import Leaderboard from '../components/Leaderboard';
import QuizResultsTable from '../components/QuizResultsTable'; // New component

const Profile = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized calculations to prevent unnecessary re-renders
  const stats = useMemo(() => {
    if (!currentUser?.stats) return {};
    return {
      totalQuizzesCreated: currentUser.stats.totalQuizzesCreated || 0,
      totalQuizzesAttempted: currentUser.stats.totalQuizzesAttempted || 0,
      averageScore: currentUser.stats.averageScore || 0,
      totalPoints: currentUser.stats.totalPoints || 0
    };
  }, [currentUser?.stats]);

  // Load data based on active tab
  useEffect(() => {
    if (!currentUser) return;

    const loadTabData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'myQuizzes':
            if (userQuizzes.length === 0) {
              const quizzesData = await quizService.getUserQuizzes();
              setUserQuizzes(quizzesData.quizzes || []);
            }
            break;
          case 'questHistory':
            if (attemptHistory.length === 0) {
              const historyData = await attemptService.getAttemptHistory();
setAttemptHistory(Array.isArray(historyData) ? historyData : []);
            }
            break;
          case 'analytics':
            if (attemptHistory.length === 0) {
              const historyData = await attemptService.getAttemptHistory();
setAttemptHistory(Array.isArray(historyData) ? historyData : []);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error loading tab data:', error);
        setError('Failed to load data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, currentUser, userQuizzes.length, attemptHistory.length]);

  if (!currentUser) {
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
          <p style={{ fontSize: '1.2rem', color: '#F8F9FA' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #6C63FF',
            borderTopColor: '#00F5D4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#FF6B6B'
        }}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#6C63FF',
              color: '#F8F9FA',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
            }}>
              <h3 style={{ color: '#00F5D4', marginBottom: '0.5rem' }}>Quests Created</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F8F9FA' }}>{stats.totalQuizzesCreated}</p>
            </div>
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
            }}>
              <h3 style={{ color: '#00F5D4', marginBottom: '0.5rem' }}>Quests Attempted</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F8F9FA' }}>{stats.totalQuizzesAttempted}</p>
            </div>
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
            }}>
              <h3 style={{ color: '#00F5D4', marginBottom: '0.5rem' }}>Average Score</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F8F9FA' }}>{stats.averageScore?.toFixed(1) || 0}%</p>
            </div>
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
            }}>
              <h3 style={{ color: '#00F5D4', marginBottom: '0.5rem' }}>Total Points</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F8F9FA' }}>{stats.totalPoints || 0}</p>
            </div>
          </div>
        );

      case 'myQuizzes':
        return (
          <div>
            <h3 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>My Created Quests</h3>
            {userQuizzes.length === 0 ? (
              <p style={{ color: '#A1A1AA', textAlign: 'center', padding: '2rem' }}>
                You haven't created any quests yet.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {userQuizzes.map((quiz) => (
                  <div key={quiz._id} style={{
                    background: 'rgba(108, 99, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid #6C63FF',
                    boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#F8F9FA', marginBottom: '0.5rem' }}>{quiz.title}</h4>
                        <p style={{ color: '#A1A1AA', marginBottom: '1rem' }}>{quiz.description}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <span style={{
                            background: 'rgba(0, 245, 212, 0.2)',
                            color: '#00F5D4',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {quiz.topic}
                          </span>
                          <span style={{
                            background: 'rgba(255, 215, 0, 0.2)',
                            color: '#FFD700',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {quiz.difficulty}
                          </span>
                          <span style={{
                            background: quiz.isPublic ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 99, 71, 0.2)',
                            color: quiz.isPublic ? '#00F5D4' : '#FF6347',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {quiz.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                        {!quiz.isPublic && quiz.accessCode && (
                          <p style={{ color: '#FFD700', fontSize: '0.875rem' }}>
                            Access Code: <strong>{quiz.accessCode}</strong>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveTab(`quizResults-${quiz._id}`)}
                        style={{
                          background: '#6C63FF',
                          color: '#F8F9FA',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#00F5D4';
                          e.target.style.color = '#0A0F29';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#6C63FF';
                          e.target.style.color = '#F8F9FA';
                        }}
                      >
                        View Results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'questHistory':
  return (
    <div>
      <h3 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>Quest History</h3>
      {!Array.isArray(attemptHistory) || attemptHistory.length === 0 ? (
        <p style={{ color: '#A1A1AA', textAlign: 'center', padding: '2rem' }}>
          You haven't attempted any quests yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(Array.isArray(attemptHistory) ? attemptHistory : []).map((attempt) => (
            <div
              key={attempt._id}
              style={{
                background: 'rgba(108, 99, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #6C63FF',
                boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4
                    style={{
                      color: '#F8F9FA',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {attempt.quizId?.title || 'Unknown Quiz'}
                  </h4>
                  <p
                    style={{
                      color: '#A1A1AA',
                      fontSize: '0.875rem',
                    }}
                  >
                    Completed:{' '}
                    {attempt.completedAt
                      ? new Date(attempt.completedAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      color:
                        attempt.percentage >= 80
                          ? '#00F5D4'
                          : attempt.percentage >= 60
                          ? '#FFD700'
                          : '#FF6B6B',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {attempt.percentage?.toFixed(1) || 0}%
                  </p>
                  <p
                    style={{
                      color: '#A1A1AA',
                      fontSize: '0.875rem',
                    }}
                  >
                    {attempt.score || 0}/{attempt.totalPoints || 0} points
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

      case 'analytics':
        return (
          <div>
            <h3 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>Performance Analytics</h3>
            <AnalyticsChart attempts={Array.isArray(attemptHistory) ? attemptHistory : []} />
          </div>
        );

      case 'leaderboard':
        return (
          <div>
            <h3 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>Global Leaderboard</h3>
            <Leaderboard />
          </div>
        );

      default:
        // Handle quiz results tabs (format: quizResults-{quizId})
        if (activeTab.startsWith('quizResults-')) {
          const quizId = activeTab.replace('quizResults-', '');
          const quiz = userQuizzes.find(q => q._id === quizId);
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                  onClick={() => setActiveTab('myQuizzes')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00F5D4',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginRight: '1rem'
                  }}
                >
                  ← Back to My Quizzes
                </button>
                <h3 style={{ color: '#F8F9FA', margin: 0 }}>
                  Results for: {quiz?.title || 'Quiz'}
                </h3>
              </div>
              <QuizResultsTable quizId={quizId} />
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div style={{
      background: '#0A0F29',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Inter", sans-serif',
      color: '#F8F9FA'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF, #00F5D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#F8F9FA'
            }}>
              {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                color: '#F8F9FA'
              }}>
                {currentUser?.username || 'User'}
              </h1>
              <p style={{ color: '#A1A1AA', margin: 0 }}>
                {currentUser?.email || 'No email provided'}
              </p>
              {currentUser?.bio && (
                <p style={{ color: '#A1A1AA', margin: '0.5rem 0 0 0' }}>
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'myQuizzes', label: 'My Quests', icon: '📝' },
              { id: 'questHistory', label: 'Quest History', icon: '📚' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#6C63FF' : 'transparent',
                  color: activeTab === tab.id ? '#F8F9FA' : '#A1A1AA',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(0, 245, 212, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(0, 245, 212, 0.1)';
                    e.target.style.color = '#00F5D4';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#A1A1AA';
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)',
          minHeight: '400px'
        }}>
          {renderTabContent()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;

