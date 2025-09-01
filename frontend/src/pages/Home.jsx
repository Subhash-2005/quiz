import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    loadPublicQuizzes();
    loadGlobalLeaderboard();
  }, []);

  const loadPublicQuizzes = async () => {
    try {
      const response = await quizService.getPublicQuizzes(filters);
      setQuizzes(response.quizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalLeaderboard = async () => {
    try {
      const response = await quizService.getGlobalLeaderboard();
      setLeaderboard(response.slice(0, 5));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadPublicQuizzes();
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
          border: '1px solid rgba(0, 245, 212, 0.2)'
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
          <p style={{ fontSize: '1.2rem', color: '#F8F9FA' }}>Embarking on your quest...</p>
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
      color: '#F8F9FA',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.2) 0%, rgba(0, 245, 212, 0.1) 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            fontSize: '3rem',
            color: '#F8F9FA',
            textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
            marginBottom: '1rem'
          }}>Embark on Your Knowledge Quest</h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#A1A1AA',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Discover mystical quizzes, challenge your wisdom, and rise to glory!
          </p>
          {!currentUser && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup" style={{
                padding: '0.8rem 2rem',
                background: '#6C63FF',
                color: '#F8F9FA',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                ':hover': {
                  boxShadow: '0 0 25px rgba(108, 99, 255, 0.8)',
                  transform: 'translateY(-2px)'
                }
              }}>Begin Your Journey</Link>
              <Link to="/login" style={{
                padding: '0.8rem 2rem',
                background: 'transparent',
                color: '#00F5D4',
                border: '2px solid #00F5D4',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                ':hover': {
                  background: 'rgba(0, 245, 212, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 245, 212, 0.5)'
                }
              }}>Enter the Realm</Link>
            </div>
          )}
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(108, 99, 255, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '10%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(0, 245, 212, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            bottom: '20%',
            right: '15%',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '2rem'
      }}>
        {/* Main Quiz Section */}
        <div>
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '4px',
                height: '30px',
                background: '#FFD700',
                marginRight: '1rem'
              }}></div>
              <h2 style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#F8F9FA'
              }}>Discover Quests</h2>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem'
              }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(108, 99, 255, 0.2)',
                  borderRadius: '20px',
                  border: '1px solid #6C63FF',
                  boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)',
                  padding: '0.5rem'
                }}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Seek your quest..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem 2rem 0.8rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#F8F9FA',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#A1A1AA',
                    fontSize: '1.2rem'
                  }}>🔍</span>
                </div>
                <select
                  name="topic"
                  value={filters.topic}
                  onChange={handleFilterChange}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(108, 99, 255, 0.2)',
                    border: '1px solid #6C63FF',
                    borderRadius: '8px',
                    color: '#F8F9FA',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      boxShadow: '0 0 10px rgba(0, 245, 212, 0.3)'
                    }
                  }}
                >
                  <option value="" style={{ color: '#F8F9FA' }}>All Topics</option>
                  <option value="Math" style={{ color: '#F8F9FA' }}>📊 Math</option>
                  <option value="Science" style={{ color: '#F8F9FA' }}>🔬 Science</option>
                  <option value="History" style={{ color: '#F8F9FA' }}>📚 History</option>
                  <option value="Geography" style={{ color: '#F8F9FA' }}>🌍 Geography</option>
                  <option value="Programming" style={{ color: '#F8F9FA' }}>💻 Programming</option>
                </select>
                <select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(108, 99, 255, 0.2)',
                    border: '1px solid #6C63FF',
                    borderRadius: '8px',
                    color: '#F8F9FA',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      boxShadow: '0 0 10px rgba(0, 245, 212, 0.3)'
                    }
                  }}
                >
                  <option value="" style={{ color: '#F8F9FA' }}>All Difficulties</option>
                  <option value="Easy" style={{ color: '#F8F9FA' }}>🟢 Easy</option>
                  <option value="Medium" style={{ color: '#F8F9FA' }}>🟡 Medium</option>
                  <option value="Hard" style={{ color: '#F8F9FA' }}>🔴 Hard</option>
                </select>
              </div>
              <button type="submit" style={{
                padding: '0.8rem',
                background: '#6C63FF',
                color: '#F8F9FA',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontFamily: '"Poppins", sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                ':hover': {
                  boxShadow: '0 0 25px rgba(108, 99, 255, 0.8)',
                  transform: 'translateY(-2px)'
                }
              }}>Unveil Quests</button>
            </form>

            {/* Quiz Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <div key={quiz._id} style={{
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 0 20px rgba(0, 245, 212, 0.5)'
                    }
                  }}>
                    <QuizCard quiz={quiz} />
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(108, 99, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 245, 212, 0.2)',
                  color: '#F8F9FA'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 'bold' }}>No Quests Found</h3>
                  <p style={{ color: '#A1A1AA' }}>Seek different paths or return later for new adventures!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Leaderboard */}
          <div style={{
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <Leaderboard 
              data={leaderboard} 
              title="🏆 Hall of Legends" 
              type="global" 
            />
          </div>

          {/* Quick Actions */}
          {currentUser && (
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '4px',
                  height: '25px',
                  background: '#FFD700',
                  marginRight: '1rem'
                }}></div>
                <h3 style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  color: '#F8F9FA'
                }}>Heroic Actions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/create-quiz" style={{
                  padding: '0.8rem',
                  background: '#6C63FF',
                  color: '#F8F9FA',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                  ':hover': {
                    boxShadow: '0 0 25px rgba(108, 99, 255, 0.8)',
                    transform: 'translateY(-2px)'
                  }
                }}>✨ Forge New Quest</Link>
                <Link to="/profile" style={{
                  padding: '0.8rem',
                  background: 'transparent',
                  color: '#00F5D4',
                  border: '2px solid #00F5D4',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: 'rgba(0, 245, 212, 0.1)',
                    boxShadow: '0 0 15px rgba(0, 245, 212, 0.5)'
                  }
                }}>👤 View My Legend</Link>
              </div>
            </div>
          )}

          {/* Private Quizzes */}
          {currentUser && (
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 245, 212, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '4px',
                  height: '25px',
                  background: '#FFD700',
                  marginRight: '1rem'
                }}></div>
                <h3 style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  color: '#F8F9FA'
                }}>Secret Quests</h3>
              </div>
              <Link to="/join-quiz" style={{
                padding: '0.8rem',
                background: '#6C63FF',
                color: '#F8F9FA',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                ':hover': {
                  boxShadow: '0 0 25px rgba(108, 99, 255, 0.8)',
                  transform: 'translateY(-2px)'
                }
              }}>🔐 Unlock Secret Quest</Link>
              <div style={{
                background: 'rgba(0, 245, 212, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                gap: '0.5rem'
              }}>
                <span style={{ color: '#FFD700', fontSize: '1.2rem' }}>💡</span>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>
                  Possess a secret code? Unlock hidden quests and challenge your allies!
                </p>
              </div>
            </div>
          )}

          {/* Stats Card */}
          {!currentUser && (
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 245, 212, 0.2)'
            }}>
              <h3 style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#F8F9FA',
                marginBottom: '1rem'
              }}>🚀 Join the Guild</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
                  }}>1000+</div>
                  <div style={{ color: '#A1A1AA' }}>Active Adventurers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
                  }}>500+</div>
                  <div style={{ color: '#A1A1AA' }}>Quests Available</div>
                </div>
              </div>
              <Link to="/signup" style={{
                padding: '0.8rem',
                background: '#6C63FF',
                color: '#F8F9FA',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                display: 'block',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                ':hover': {
                  boxShadow: '0 0 25px rgba(108, 99, 255, 0.8)',
                  transform: 'translateY(-2px)'
                }
              }}>Join the Adventure!</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;