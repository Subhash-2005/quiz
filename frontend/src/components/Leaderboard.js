import React from 'react';

const Leaderboard = ({ data, title, type = 'quiz' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'quiz' ? 'User' : 'Quiz'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              {type === 'quiz' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    index === 0 ? 'bg-yellow-400' : 
                    index === 1 ? 'bg-gray-300' : 
                    index === 2 ? 'bg-yellow-700 text-white' : 'bg-gray-100'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {type === 'quiz' ? item.userId?.username : item.quizId?.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {type === 'quiz' ? `${item.score}/${item.totalPoints}` : `${item.averageScore}%`}
                </td>
                {type === 'quiz' && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    {Math.floor(item.timeTaken / 60)}m {item.timeTaken % 60}s
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <p className="text-center text-gray-500 py-4">No data available</p>
      )}
    </div>
  );
};

export default Leaderboard;