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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Join Private Quiz</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="code">
            Enter Access Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            placeholder="e.g., ABC123XY"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono uppercase"
            maxLength="8"
            style={{ letterSpacing: '0.2em' }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Enter the 8-character code provided by the quiz creator
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || code.length !== 8}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join Quiz'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to join a private quiz:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Get the 8-character access code from the quiz creator</li>
          <li>Enter the code in the field above</li>
          <li>Click "Join Quiz" to start the quiz</li>
        </ol>
      </div>
    </div>
  );
};

export default JoinQuiz;