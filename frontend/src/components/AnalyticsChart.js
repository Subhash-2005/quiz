import React from 'react';

// This is a dummy chart component - in a real app, you would use Chart.js or Recharts
const AnalyticsChart = ({ data, title, type = 'bar' }) => {
  // Mock data for demonstration
  const mockData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 },
  ];

  const chartData = data || mockData;
  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="h-64 flex items-end justify-between">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-blue-500 w-8 rounded-t transition-all duration-300"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs mt-2">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.label}:</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChart;