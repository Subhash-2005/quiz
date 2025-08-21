import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { attemptService } from '../services/attemptService';
import QuizCard from '../components/QuizCard';
import Leaderboard from '../components/Leaderboard';
import AnalyticsChart from '../components/AnalyticsChart';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [privateQuizzes, setPrivateQuizzes] = useState([]); // <-- Add this line
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [quizzesResponse, attemptsResponse] = await Promise.all([
        quizService.getUserQuizzes(),
        attemptService.getAttemptHistory()
      ]);
      setUserQuizzes(quizzesResponse.quizzes || []);
      setPrivateQuizzes(quizzesResponse.quizzes.filter(q => !q.isPublic) || []); // <-- Add this line
      setAttemptHistory(attemptsResponse.attempts || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{currentUser.username}</h2>
            <p className="text-gray-600">{currentUser.email}</p>
            {currentUser.profile?.bio && (
              <p className="text-gray-700 mt-2">{currentUser.profile.bio}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {currentUser.stats?.totalQuizzesCreated || 0}
            </div>
            <div className="text-sm text-gray-600">Quizzes Created</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentUser.stats?.totalQuizzesAttempted || 0}
            </div>
            <div className="text-sm text-gray-600">Quizzes Taken</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(currentUser.stats?.averageScore || 0)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {currentUser.stats?.totalPoints || 0}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`mr-8 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quizzes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Quizzes
            </button>
            <button
              onClick={() => setActiveTab('attempts')}
              className={`mr-8 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attempts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attempt History
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`mr-8 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('access-codes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'access-codes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Access Codes
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'quizzes' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Quizzes I've Created</h3>
              
              {userQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userQuizzes.map(quiz => (
                    <QuizCard key={quiz._id} quiz={quiz} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  You haven't created any quizzes yet.
                </p>
              )}
            </div>
          )}
          
          {activeTab === 'attempts' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Quiz Attempt History</h3>
              
              {attemptHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Taken
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attemptHistory.map(attempt => (
                        <tr key={attempt._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {attempt.quizId?.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {attempt.score}/{attempt.totalPoints} ({Math.round(attempt.percentage)}%)
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  You haven't attempted any quizzes yet.
                </p>
              )}
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Performance Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <AnalyticsChart 
                  title="Scores by Difficulty"
                  data={[
                    { label: 'Easy', value: 85 },
                    { label: 'Medium', value: 72 },
                    { label: 'Hard', value: 58 }
                  ]}
                />
                
                <AnalyticsChart 
                  title="Quizzes by Topic"
                  data={[
                    { label: 'Math', value: 12 },
                    { label: 'Science', value: 8 },
                    { label: 'History', value: 5 },
                    { label: 'Programming', value: 15 }
                  ]}
                />
              </div>
              
              <Leaderboard 
                data={attemptHistory.slice(0, 5).map(attempt => ({
                  ...attempt,
                  userId: { username: 'You' }
                }))} 
                title="Your Best Performances" 
                type="quiz" 
              />
            </div>
          )}
          
          {/* Add Access Codes Tab */}
          {activeTab === 'access-codes' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Private Quiz Access Codes</h3>
              {privateQuizzes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Access Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {privateQuizzes.map(quiz => (
                        <tr key={quiz._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {quiz.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono">
                            {quiz.accessCode}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(quiz.accessCode);
                                toast.success('Access code copied to clipboard!');
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  You haven't created any private quizzes yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;