import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import toast from 'react-hot-toast';

const JoinQuiz = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await quizService.joinQuizByCode(code);
      toast.success('Access granted!');
      navigate(`/quiz/${response.quiz._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid access code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F29 0%, #6C63FF 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        background: 'rgba(10, 15, 41, 0.7)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)',
        border: '1px solid rgba(108, 99, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          color: '#F8F9FA',
          textShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>Join Private Quest</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#F8F9FA',
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }} htmlFor="code">
              Enter Secret Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              placeholder="e.g., ABC123XY"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(108, 99, 255, 0.1)',
                border: '2px solid #00F5D4',
                borderRadius: '8px',
                color: '#F8F9FA',
                textAlign: 'center',
                fontFamily: '"Roboto Mono", monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                outline: 'none',
                boxShadow: '0 0 10px rgba(0, 245, 212, 0.3)',
                transition: 'all 0.3s ease',
                ':focus': {
                  boxShadow: '0 0 15px rgba(0, 245, 212, 0.5)',
                  borderColor: '#00F5D4'
                }
              }}
              maxLength="8"
            />
            <p style={{
              color: '#A1A1AA',
              fontSize: '0.85rem',
              marginTop: '0.5rem'
            }}>
              Enter the 8-character code to unlock the quest
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || code.length !== 8}
            style={{
              width: '100%',
              background: '#FFD700',
              color: '#0A0F29',
              padding: '0.75rem',
              borderRadius: '8px',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: 'none',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              cursor: loading || code.length !== 8 ? 'not-allowed' : 'pointer',
              opacity: loading || code.length !== 8 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              ':hover': {
                background: '#6C63FF',
                color: '#F8F9FA',
                boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)'
              }
            }}
          >
            {loading ? 'Unlocking...' : 'Join Quest'}
          </button>
        </form>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 10px rgba(108, 99, 255, 0.2)'
        }}>
          <h3 style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#F8F9FA',
            marginBottom: '0.5rem'
          }}>How to join a private quest:</h3>
          <ol style={{
            listStyleType: 'decimal',
            listStylePosition: 'inside',
            fontSize: '0.85rem',
            color: '#A1A1AA',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <li>Obtain the 8-character code from the quest creator</li>
            <li>Enter the code in the rune box above</li>
            <li>Press "Join Quest" to embark on the adventure</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;