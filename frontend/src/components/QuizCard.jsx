import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div style={{
      background: 'rgba(10, 15, 41, 0.7)', // #0A0F29 with glassmorphic transparency
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid rgba(108, 99, 255, 0.3)', // Border glow #6C63FF
      boxShadow: '0 0 10px rgba(108, 99, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      color: '#F8F9FA',
      fontFamily: '"Inter", sans-serif',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 0 20px rgba(0, 245, 212, 0.5)', // Hover glow #00F5D4
        borderColor: '#00F5D4'
      }
    }}>
      <h3 style={{
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#F8F9FA',
        marginBottom: '0.5rem',
        borderBottom: '2px solid #00F5D4', // Teal underline
        paddingBottom: '0.25rem'
      }}>{quiz.title}</h3>
      <p style={{
        color: '#A1A1AA', // Muted grey-slate text
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>{quiz.description}</p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{
          background: 'rgba(108, 99, 255, 0.2)',
          color: '#F8F9FA',
          fontSize: '0.75rem',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          border: '1px solid #6C63FF',
          boxShadow: '0 0 5px rgba(108, 99, 255, 0.3)'
        }}>
          {quiz.topic}
        </span>
        <span style={{
          background: quiz.difficulty === 'Easy' ? 'rgba(0, 245, 212, 0.2)' :
                    quiz.difficulty === 'Medium' ? 'rgba(108, 99, 255, 0.2)' :
                    'rgba(255, 215, 0, 0.2)',
          color: '#F8F9FA',
          fontSize: '0.75rem',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          border: quiz.difficulty === 'Easy' ? '1px solid #00F5D4' :
                  quiz.difficulty === 'Medium' ? '1px solid #6C63FF' :
                  '1px solid #FFD700',
          boxShadow: quiz.difficulty === 'Easy' ? '0 0 5px rgba(0, 245, 212, 0.5)' :
                    quiz.difficulty === 'Medium' ? '0 0 5px rgba(108, 99, 255, 0.5)' :
                    '0 0 5px rgba(255, 215, 0, 0.5)'
        }}>
          {quiz.difficulty}
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#A1A1AA', // Muted grey-slate text
        marginBottom: '1rem'
      }}>
        <span>By: {quiz.createdBy?.username}</span>
        <span>{quiz.questions?.length} questions</span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: '#FFD700', // Gold stars
          textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
        }}>
          {'★'.repeat(Math.round(quiz.averageRating || 0))}
          {'☆'.repeat(5 - Math.round(quiz.averageRating || 0))}
          <span style={{
            color: '#A1A1AA', // Muted grey-slate text
            marginLeft: '0.25rem'
          }}>({quiz.ratings?.length || 0})</span>
        </span>
        
        <Link 
          to={`/quiz/${quiz._id || quiz.accessCode}`}
          style={{
            background: '#6C63FF',
            color: '#F8F9FA',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
            transition: 'all 0.3s ease',
            ':hover': {
              background: '#FFD700',
              color: '#0A0F29',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
            }
          }}
        >
          Embark on Quest
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;