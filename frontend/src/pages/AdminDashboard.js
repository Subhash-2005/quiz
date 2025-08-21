import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { attemptService } from '../services/attemptService';
import AnalyticsChart from '../components/AnalyticsChart';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your admin API
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // These would be replaced with actual admin API calls
      const [quizzesResponse, attemptsResponse] = await Promise.all([
        quizService.getPublicQuizzes({ limit: 5 }),
        attemptService.getGlobalLeaderboard()
      ]);
      
      setRecentQuizzes(quizzesResponse.quizzes || []);
      setRecentAttempts(attemptsResponse.slice(0, 10) || []);
      
      // Mock platform stats
      setPlatformStats({
        totalUsers: 1247,
        totalQuizzes: 568,
        totalAttempts: 8923,
        popularTopics: [
          { _id: 'Math', count: 142 },
          { _id: 'Science', count: 118 },
          { _id: 'Programming', count: 96 },
          { _id: 'History', count: 75 },
          { _id: 'Geography', count: 62 }
        ],
        difficultyDistribution: [
          { _id: 'Easy', count: 245 },
          { _id: 'Medium', count: 198 },
          { _id: 'Hard', count: 125 }
        ]
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You must be an administrator to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading admin dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      
      {platformStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{platformStats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{platformStats.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Total Quizzes</div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{platformStats.totalAttempts}</div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnalyticsChart 
          title="Quizzes by Difficulty"
          data={platformStats?.difficultyDistribution.map(item => ({
            label: item._id,
            value: item.count
          })) || []}
        />
        
        <AnalyticsChart 
          title="Popular Topics"
          data={platformStats?.popularTopics.map(item => ({
            label: item._id,
            value: item.count
          })) || []}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Quizzes</h3>
          
          {recentQuizzes.length > 0 ? (
            <div className="space-y-4">
              {recentQuizzes.map(quiz => (
                <div key={quiz._id} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-semibold">{quiz.title}</h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>By: {quiz.createdBy?.username}</span>
                    <span>{quiz.topic} • {quiz.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No quizzes found</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Attempts</h3>
          
          {recentAttempts.length > 0 ? (
            <div className="space-y-4">
              {recentAttempts.map((attempt, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between">
                    <span className="font-semibold">{attempt.username}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {attempt.leaderboardScore.toFixed(1)} pts
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {attempt.totalQuizzesCreated} created • {attempt.totalQuizzesAttempted} attempted
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No attempts found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;