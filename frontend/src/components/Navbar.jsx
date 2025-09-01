import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#0A0F29',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 245, 212, 0.2)',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        <Link to="/" style={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#F8F9FA',
          textDecoration: 'none',
          textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
          transition: 'all 0.3s ease',
          ':hover': {
            color: '#00F5D4',
            textShadow: '0 0 15px rgba(0, 245, 212, 0.8)'
          }
        }}>
          Questify
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {currentUser ? (
            <>
              <Link to="/create-quiz" style={{
                color: '#F8F9FA',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.5rem 0',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                ':hover': {
                  color: '#00F5D4',
                  ':after': {
                    width: '100%',
                    background: '#00F5D4',
                    boxShadow: '0 0 10px rgba(0, 245, 212, 0.8)'
                  }
                },
                ':after': {
                  content: '""',
                  position: 'absolute',
                  width: '0',
                  height: '2px',
                  bottom: '0',
                  left: '0',
                  background: 'transparent',
                  transition: 'width 0.3s ease'
                },
                ...(window.location.pathname === '/create-quiz' && {
                  color: '#6C63FF',
                  textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                  ':after': {
                    width: '100%',
                    background: '#6C63FF',
                    boxShadow: '0 0 10px rgba(108, 99, 255, 0.8)'
                  }
                })
              }}>
                Create Quest
              </Link>
              <Link to="/join-quiz" style={{
                color: '#F8F9FA',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.5rem 0',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                ':hover': {
                  color: '#00F5D4',
                  ':after': {
                    width: '100%',
                    background: '#00F5D4',
                    boxShadow: '0 0 10px rgba(0, 245, 212, 0.8)'
                  }
                },
                ':after': {
                  content: '""',
                  position: 'absolute',
                  width: '0',
                  height: '2px',
                  bottom: '0',
                  left: '0',
                  background: 'transparent',
                  transition: 'width 0.3s ease'
                },
                ...(window.location.pathname === '/join-quiz' && {
                  color: '#6C63FF',
                  textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                  ':after': {
                    width: '100%',
                    background: '#6C63FF',
                    boxShadow: '0 0 10px rgba(108, 99, 255, 0.8)'
                  }
                })
              }}>
                Join Quest
              </Link>
              <Link to="/profile" style={{
                color: '#F8F9FA',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.5rem 0',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                ':hover': {
                  color: '#00F5D4',
                  ':after': {
                    width: '100%',
                    background: '#00F5D4',
                    boxShadow: '0 0 10px rgba(0, 245, 212, 0.8)'
                  }
                },
                ':after': {
                  content: '""',
                  position: 'absolute',
                  width: '0',
                  height: '2px',
                  bottom: '0',
                  left: '0',
                  background: 'transparent',
                  transition: 'width 0.3s ease'
                },
                ...(window.location.pathname === '/profile' && {
                  color: '#6C63FF',
                  textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                  ':after': {
                    width: '100%',
                    background: '#6C63FF',
                    boxShadow: '0 0 10px rgba(108, 99, 255, 0.8)'
                  }
                })
              }}>
                <span style={{
                  color: '#FFD700',
                  marginRight: '0.5rem',
                  textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
                }}>👤</span>
                Profile
              </Link>
              {currentUser.isAdmin && (
                <Link to="/admin" style={{
                  color: '#F8F9FA',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    color: '#00F5D4',
                    ':after': {
                      width: '100%',
                      background: '#00F5D4',
                      boxShadow: '0 0 10px rgba(0, 245, 212, 0.8)'
                    }
                  },
                  ':after': {
                    content: '""',
                    position: 'absolute',
                    width: '0',
                    height: '2px',
                    bottom: '0',
                    left: '0',
                    background: 'transparent',
                    transition: 'width 0.3s ease'
                  },
                  ...(window.location.pathname === '/admin' && {
                    color: '#6C63FF',
                    textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                    ':after': {
                      width: '100%',
                      background: '#6C63FF',
                      boxShadow: '0 0 10px rgba(108, 99, 255, 0.8)'
                    }
                  })
                }}>
                  Admin
                </Link>
              )}
              <span style={{
                color: '#A1A1AA',
                fontWeight: '500'
              }}>
                Greetings, {currentUser.username}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#6C63FF',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                  ':hover': {
                    background: '#00F5D4',
                    boxShadow: '0 0 15px rgba(0, 245, 212, 0.8)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Leave Realm
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#F8F9FA',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.5rem 0',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                ':hover': {
                  color: '#00F5D4',
                  ':after': {
                    width: '100%',
                    background: '#00F5D4',
                    boxShadow: '0 0 10px rgba(0, 245, 212, 0.8)'
                  }
                },
                ':after': {
                  content: '""',
                  position: 'absolute',
                  width: '0',
                  height: '2px',
                  bottom: '0',
                  left: '0',
                  background: 'transparent',
                  transition: 'width 0.3s ease'
                },
                ...(window.location.pathname === '/login' && {
                  color: '#6C63FF',
                  textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                  ':after': {
                    width: '100%',
                    background: '#6C63FF',
                    boxShadow: '0 0 10px rgba(108, 99, 255, 0.8)'
                  }
                })
              }}>
                Enter Realm
              </Link>
              <Link to="/signup" style={{
                padding: '0.5rem 1.5rem',
                background: '#6C63FF',
                color: '#F8F9FA',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                ':hover': {
                  background: '#00F5D4',
                  boxShadow: '0 0 15px rgba(0, 245, 212, 0.8)',
                  transform: 'translateY(-2px)'
                }
              }}>
                Join Adventure
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;