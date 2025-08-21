import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {quiz.topic}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>By: {quiz.createdBy?.username}</span>
        <span>{quiz.questions?.length} questions</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-yellow-500">
          {'★'.repeat(Math.round(quiz.averageRating || 0))}
          {'☆'.repeat(5 - Math.round(quiz.averageRating || 0))}
          <span className="text-gray-400 ml-1">({quiz.ratings?.length || 0})</span>
        </span>
        
        <Link 
          to={`/quiz/${quiz._id || quiz.accessCode}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Take Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;