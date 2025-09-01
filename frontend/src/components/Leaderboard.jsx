import React, { useState, useEffect, useCallback } from 'react';
import { attemptService } from '../services/attemptService';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const data = await attemptService.getGlobalLeaderboard();
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError(error.message || 'Failed to load leaderboard');
      
      // Don't show toast on first load, only on retries
      if (retryCount > 0) {
        toast.error('Failed to load leaderboard');
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    loadLeaderboard();
  }, [loadLeaderboard]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: '#F8F9FA'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #6C63FF',
          borderTopColor: '#00F5D4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span style={{ marginLeft: '1rem' }}>Loading leaderboard...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#A1A1AA',
        background: 'rgba(255, 107, 107, 0.1)',
        borderRadius: '8px',
        border: '1px solid #FF6B6B'
      }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#FF6B6B' }}>
          Failed to load leaderboard
        </div>
        <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          {error}
        </div>
        <button
          onClick={handleRetry}
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
          Try Again
        </button>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#A1A1AA',
        background: 'rgba(108, 99, 255, 0.05)',
        borderRadius: '8px',
        border: '1px dashed #6C63FF'
      }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No leaderboard data yet!</p>
        <p style={{ fontSize: '0.9rem' }}>Be the first to complete some quizzes.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(108, 99, 255, 0.05)',
      borderRadius: '8px',
      padding: '1rem',
      border: '1px solid #6C63FF'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {leaderboard.map((user, index) => (
          <div
            key={user._id || index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(108, 99, 255, 0.1)',
              borderRadius: '6px',
              border: index < 3 ? '1px solid #FFD700' : '1px solid #6C63FF',
              boxShadow: index < 3 ? '0 0 10px rgba(255, 215, 0, 0.3)' : '0 0 5px rgba(108, 99, 255, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: index === 0 ? '#FFD700' : 
                           index === 1 ? '#C0C0C0' : 
                           index === 2 ? '#CD7F32' : '#6C63FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8F9FA',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                {index + 1}
              </div>
              <div>
                <div style={{
                  color: '#F8F9FA',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {user.username || 'Unknown User'}
                </div>
                <div style={{
                  color: '#A1A1AA',
                  fontSize: '0.8rem'
                }}>
                  {user.totalQuizzesCreated || 0} created • {user.totalQuizzesAttempted || 0} attempted
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                color: index < 3 ? '#FFD700' : '#00F5D4',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                {Math.round(user.leaderboardScore || 0)} pts
              </div>
              <div style={{
                color: '#A1A1AA',
                fontSize: '0.8rem'
              }}>
                {Math.round(user.averageScore || 0)}% avg
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {leaderboard.length >= 20 && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#A1A1AA',
          fontSize: '0.9rem'
        }}>
          Showing top 20 players
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

