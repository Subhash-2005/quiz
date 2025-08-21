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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to QuizPlatform</h1>
        <p className="text-xl text-gray-600">
          Create, share, and take quizzes with our collaborative platform
        </p>
        
        {!currentUser && (
          <div className="mt-6">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Browse Quizzes</h2>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search quizzes..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    name="topic"
                    value={filters.topic}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Topics</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Programming">Programming</option>
                  </select>
                </div>
                <div>
                  <select
                    name="difficulty"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </form>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No quizzes found. Try different filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <Leaderboard 
            data={leaderboard} 
            title="Global Leaderboard" 
            type="global" 
          />
          
          {currentUser && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <Link 
                to="/create-quiz"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg mb-3 hover:bg-green-700"
              >
                Create New Quiz
              </Link>
              <Link 
                to="/profile"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
              >
                View My Profile
              </Link>
            </div>
          )}

          {/* Add Private Quizzes section */}
          {currentUser && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Private Quizzes</h3>
              <Link 
                to="/join-quiz"
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg mb-3 hover:bg-purple-700"
              >
                Join Private Quiz
              </Link>
              <p className="text-sm text-gray-600">
                Have an access code? Join a private quiz created by others.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;