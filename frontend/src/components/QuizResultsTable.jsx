import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService_with_results.js';
import toast from 'react-hot-toast';

const QuizResultsTable = ({ quizId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        setError(error.response?.data?.message || 'Failed to load quiz results');
        toast.error('Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #6C63FF',
          borderTopColor: '#00F5D4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
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
        color: '#FF6B6B'
      }}>
        <p style={{ marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
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

  if (!results || !results.results) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#A1A1AA'
      }}>
        <p>No results available for this quiz.</p>
      </div>
    );
  }

  const { quiz, summary, results: participantResults } = results;

  return (
    <div>
      {/* Quiz Information */}
      <div style={{
        background: 'rgba(108, 99, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #6C63FF',
        boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
      }}>
        <h4 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>Quiz Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Title</p>
            <p style={{ color: '#F8F9FA', fontWeight: '500' }}>{quiz.title}</p>
          </div>
          <div>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Topic</p>
            <p style={{ color: '#F8F9FA', fontWeight: '500' }}>{quiz.topic}</p>
          </div>
          <div>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Difficulty</p>
            <p style={{ color: '#F8F9FA', fontWeight: '500' }}>{quiz.difficulty}</p>
          </div>
          <div>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Questions</p>
            <p style={{ color: '#F8F9FA', fontWeight: '500' }}>{quiz.totalQuestions}</p>
          </div>
          <div>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Type</p>
            <p style={{ color: '#F8F9FA', fontWeight: '500' }}>{quiz.isPublic ? 'Public' : 'Private'}</p>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={{
        background: 'rgba(108, 99, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #6C63FF',
        boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
      }}>
        <h4 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>Summary Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00F5D4', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
              {summary.totalParticipants}
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Total Participants
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#FFD700', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
              {summary.averageScore.toFixed(1)}%
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Average Score
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00F5D4', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
              {summary.highestScore.toFixed(1)}%
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Highest Score
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#FF6B6B', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
              {summary.lowestScore.toFixed(1)}%
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Lowest Score
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6C63FF', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
              {summary.passRate.toFixed(1)}%
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Pass Rate (≥60%)
            </p>
          </div>
        </div>
      </div>

      {/* Participants Results Table */}
      <div style={{
        background: 'rgba(108, 99, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #6C63FF',
        boxShadow: '0 0 10px rgba(108, 99, 255, 0.3)'
      }}>
        <h4 style={{ color: '#F8F9FA', marginBottom: '1rem' }}>
          Participant Results ({participantResults.length} participants)
        </h4>
        
        {participantResults.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#A1A1AA'
          }}>
            <p>No one has completed this quiz yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #6C63FF' }}>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'left',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Rank
                  </th>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'left',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Username
                  </th>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'center',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Score
                  </th>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'center',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Percentage
                  </th>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'center',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Time Taken
                  </th>
                  <th style={{
                    padding: '1rem 0.5rem',
                    textAlign: 'center',
                    color: '#00F5D4',
                    fontWeight: 'bold'
                  }}>
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody>
                {participantResults.map((result, index) => (
                  <tr key={result.attemptId} style={{
                    borderBottom: '1px solid rgba(108, 99, 255, 0.3)',
                    background: index % 2 === 0 ? 'rgba(108, 99, 255, 0.05)' : 'transparent'
                  }}>
                    <td style={{
                      padding: '1rem 0.5rem',
                      color: '#F8F9FA',
                      fontWeight: result.rank <= 3 ? 'bold' : 'normal'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {result.rank === 1 && <span style={{ color: '#FFD700' }}>🥇</span>}
                        {result.rank === 2 && <span style={{ color: '#C0C0C0' }}>🥈</span>}
                        {result.rank === 3 && <span style={{ color: '#CD7F32' }}>🥉</span>}
                        #{result.rank}
                      </div>
                    </td>
                    <td style={{
                      padding: '1rem 0.5rem',
                      color: '#F8F9FA',
                      fontWeight: '500'
                    }}>
                      {result.username}
                    </td>
                    <td style={{
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      color: '#F8F9FA'
                    }}>
                      {result.score}/{result.totalPoints}
                    </td>
                    <td style={{
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      color: result.percentage >= 80 ? '#00F5D4' : 
                             result.percentage >= 60 ? '#FFD700' : '#FF6B6B',
                      fontWeight: 'bold'
                    }}>
                      {result.percentage.toFixed(1)}%
                    </td>
                    <td style={{
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      color: '#A1A1AA'
                    }}>
                      {result.timeTaken ? 
                        `${Math.floor(result.timeTaken / 60)}:${(result.timeTaken % 60).toString().padStart(2, '0')}` 
                        : 'N/A'
                      }
                    </td>
                    <td style={{
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      color: '#A1A1AA'
                    }}>
                      {new Date(result.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultsTable;

