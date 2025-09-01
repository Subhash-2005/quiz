import React from 'react';

const AnalyticsChart = ({ data, title, type = 'bar' }) => {
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
    <div style={{
      background: '#0A0F29',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
      border: '1px solid rgba(0, 245, 212, 0.2)',
      fontFamily: '"Inter", sans-serif',
      color: '#F8F9FA'
    }}>
      <h3 style={{
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#F8F9FA',
        textShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
        marginBottom: '1rem'
      }}>{title}</h3>
      
      <div style={{
        height: '16rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Grid Lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '1px',
              background: 'rgba(161, 161, 170, 0.2)',
              top: `${(i / 4) * 100}%`,
              zIndex: 0
            }}
          ></div>
        ))}
        
        {chartData.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1
          }}>
            <div 
              style={{
                background: `linear-gradient(to top, #6C63FF, #00F5D4)`,
                width: '2rem',
                borderRadius: '4px 4px 0 0',
                height: `${(item.value / maxValue) * 100}%`,
                transition: 'all 0.3s ease',
                boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
                position: 'relative',
                ':hover': {
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#FFD700',
                fontSize: '0.8rem',
                textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                fontWeight: 'bold'
              }}>
                {item.value}
              </div>
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: '#A1A1AA',
              marginTop: '0.5rem'
            }}>{item.label}</span>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {chartData.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem',
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            boxShadow: '0 0 5px rgba(108, 99, 255, 0.3)'
          }}>
            <span style={{ color: '#F8F9FA' }}>{item.label}:</span>
            <span style={{
              fontWeight: 'bold',
              color: '#00F5D4',
              textShadow: '0 0 5px rgba(0, 245, 212, 0.5)'
            }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChart;