import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F29 0%, rgba(0, 245, 212, 0.2) 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Wave Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(0, 245, 212, 0.1) 0%, transparent 70%), radial-gradient(circle at 80% 70%, rgba(108, 99, 255, 0.1) 0%, transparent 70%)',
        zIndex: 1
      }}></div>

      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(108, 99, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(0, 245, 212, 0.3)',
        boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)',
        color: '#F8F9FA',
        position: 'relative',
        zIndex: 2,
        backgroundImage: 'linear-gradient(to bottom, rgba(248, 249, 250, 0.05), rgba(248, 249, 250, 0.1))',
        borderTop: '2px solid rgba(255, 215, 0, 0.2)',
        borderBottom: '2px solid rgba(255, 215, 0, 0.2)'
      }}>
        <h2 style={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#F8F9FA',
          textShadow: '0 0 10px rgba(108, 99, 255, 0.5)'
        }}>Inscribe Your Legend</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#A1A1AA',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }} htmlFor="username">
              <span style={{ color: '#00F5D4', marginRight: '0.5rem', textShadow: '0 0 5px rgba(0, 245, 212, 0.5)' }}>✍️</span>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(108, 99, 255, 0.2)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                color: '#F8F9FA',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#A1A1AA',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }} htmlFor="email">
              <span style={{ color: '#00F5D4', marginRight: '0.5rem', textShadow: '0 0 5px rgba(0, 245, 212, 0.5)' }}>📧</span>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(108, 99, 255, 0.2)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                color: '#F8F9FA',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#A1A1AA',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }} htmlFor="password">
              <span style={{ color: '#00F5D4', marginRight: '0.5rem', textShadow: '0 0 5px rgba(0, 245, 212, 0.5)' }}>🔒</span>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(108, 99, 255, 0.2)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                color: '#F8F9FA',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#A1A1AA',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }} htmlFor="confirmPassword">
              <span style={{ color: '#00F5D4', marginRight: '0.5rem', textShadow: '0 0 5px rgba(0, 245, 212, 0.5)' }}>🔒</span>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(108, 99, 255, 0.2)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                color: '#F8F9FA',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00F5D4';
                e.target.style.boxShadow = '0 0 10px rgba(0, 245, 212, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
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
              ':hover': {
                background: '#FFD700',
                color: '#0A0F29',
                boxShadow: loading ? '0 0 15px rgba(108, 99, 255, 0.5)' : '0 0 20px rgba(255, 215, 0, 0.8)',
                transform: loading ? 'none' : 'translateY(-2px)'
              }
            }}
          >
            {loading ? 'Inscribing...' : 'Begin Your Quest'}
          </button>
        </form>
        
        <p style={{
          marginTop: '1rem',
          textAlign: 'center',
          color: '#A1A1AA',
          fontSize: '0.9rem'
        }}>
          Already a legend?{' '}
          <Link to="/login" style={{
            color: '#00F5D4',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            ':hover': {
              textShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
              textDecoration: 'underline'
            }
          }}>
            Enter the Realm
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;