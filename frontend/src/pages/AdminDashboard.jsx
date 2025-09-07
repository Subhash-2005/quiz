import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService_with_results.js';
import { attemptService } from '../services/attemptService';
import AnalyticsChart from '../components/AnalyticsChart';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [quizzesResponse, attemptsResponse] = await Promise.all([
        quizService.getPublicQuizzes({ limit: 5 }),
        attemptService.getGlobalLeaderboard()
      ]);
      
      setRecentQuizzes(quizzesResponse.quizzes || []);
      setRecentAttempts(attemptsResponse.slice(0, 10) || []);
      
      setPlatformStats({
        totalUsers: 1247,
        totalQuizzes: 568,
        totalAttempts: 8923,
        popularTopics: [
          { _id: 'Math', count: 142 },
          { _id: 'Science', count: 118 },
          { _id: 'Programming', count: 96 },
          { _id: 'History', count: 75 },
          { _id: 'Geography', count: 62 }
        ],
        difficultyDistribution: [
          { _id: 'Easy', count: 245 },
          { _id: 'Medium', count: 198 },
          { _id: 'Hard', count: 125 }
        ]
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
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
          border: '1px solid rgba(255, 77, 77, 0.2)',
          boxShadow: '0 0 20px rgba(255, 77, 77, 0.3)'
        }}>
          <h2 style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            color: '#FF4D4D',
            textShadow: '0 0 10px rgba(255, 77, 77, 0.5)'
          }}>Access Denied</h2>
          <p style={{
            color: '#A1A1AA',
            fontSize: '1rem'
          }}>You must be a High Administrator to access the Control Room.</p>
        </div>
      </div>
    );
  }

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
          <p style={{ fontSize: '1.2rem', color: '#F8F9FA' }}>Initializing Control Room...</p>
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
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          color: '#F8F9FA',
          textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #00F5D4',
          paddingBottom: '0.5rem'
        }}>Control Room</h2>
        
        {platformStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#00F5D4',
                textShadow: '0 0 5px rgba(0, 245, 212, 0.5)'
              }}>{platformStats.totalUsers}</div>
              <div style={{
                fontSize: '0.9rem',
                color: '#A1A1AA'
              }}>Total Adventurers</div>
            </div>
            
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#00F5D4',
                textShadow: '0 0 5px rgba(0, 245, 212, 0.5)'
              }}>{platformStats.totalQuizzes}</div>
              <div style={{
                fontSize: '0.9rem',
                color: '#A1A1AA'
              }}>Total Quests</div>
            </div>
            
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #6C63FF',
              boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#00F5D4',
                textShadow: '0 0 5px rgba(0, 245, 212, 0.5)'
              }}>{platformStats.totalAttempts}</div>
              <div style={{
                fontSize: '0.9rem',
                color: '#A1A1AA'
              }}>Total Battles</div>
            </div>
          </div>
        )}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <AnalyticsChart 
              title="Quests by Difficulty"
              data={platformStats?.difficultyDistribution.map(item => ({
                label: item._id,
                value: item.count
              })) || []}
            />
          </div>
          
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <AnalyticsChart 
              title="Popular Realms"
              data={platformStats?.popularTopics.map(item => ({
                label: item._id,
                value: item.count
              })) || []}
            />
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <h3 style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#F8F9FA',
              textShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
              marginBottom: '1rem'
            }}>Recent Quests</h3>
            
            {recentQuizzes.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {recentQuizzes.map(quiz => (
                  <div key={quiz._id} style={{
                    borderBottom: '1px solid rgba(0, 245, 212, 0.2)',
                    paddingBottom: '1rem',
                    ':last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    <h4 style={{
                      fontWeight: 'bold',
                      color: '#F8F9FA',
                      fontSize: '1.1rem'
                    }}>{quiz.title}</h4>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: '#A1A1AA'
                    }}>
                      <span>By: {quiz.createdBy?.username}</span>
                      <span>{quiz.topic} • {quiz.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                textAlign: 'center',
                color: '#A1A1AA',
                padding: '1rem',
                fontSize: '1rem'
              }}>No quests found</p>
            )}
          </div>
          
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #6C63FF',
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(5px)'
          }}>
            <h3 style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#F8F9FA',
              textShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
              marginBottom: '1rem'
            }}>Recent Battles</h3>
            
            {recentAttempts.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {recentAttempts.map((attempt, index) => (
                  <div key={index} style={{
                    borderBottom: '1px solid rgba(0, 245, 212, 0.2)',
                    paddingBottom: '1rem',
                    ':last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontWeight: 'bold',
                        color: '#F8F9FA',
                        fontSize: '1rem'
                      }}>{attempt.username}</span>
                      <span style={{
                        background: 'rgba(0, 245, 212, 0.2)',
                        color: '#00F5D4',
                        fontSize: '0.8rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        boxShadow: '0 0 5px rgba(0, 245, 212, 0.3)'
                      }}>
                        {attempt.leaderboardScore.toFixed(1)} pts
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#A1A1AA'
                    }}>
                      {attempt.totalQuizzesCreated} created • {attempt.totalQuizzesAttempted} attempted
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                textAlign: 'center',
                color: '#A1A1AA',
                padding: '1rem',
                fontSize: '1rem'
              }}>No battles found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;