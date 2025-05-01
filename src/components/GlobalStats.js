// src/components/GlobalStats.js
import React from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { formatNumber, calculatePercentage } from '../utils/dataUtils';

const GlobalStats = () => {
  const { summary } = useCovidData();

  if (!summary) {
    return <div>Loading statistics...</div>;
  }

  const stats = [
    {
      id: 'cases',
      label: 'Total Cases',
      value: summary.cases,
      today: summary.todayCases,
      color: '#FB8C00',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
      )
    },
    {
      id: 'active',
      label: 'Active Cases',
      value: summary.active,
      percentage: calculatePercentage(summary.active, summary.cases),
      color: '#1E88E5',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
        </svg>
      )
    },
    {
      id: 'recovered',
      label: 'Recovered',
      value: summary.recovered,
      percentage: calculatePercentage(summary.recovered, summary.cases),
      color: '#43A047',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="M22 4L12 14.01l-3-3"></path>
        </svg>
      )
    },
    {
      id: 'deaths',
      label: 'Deaths',
      value: summary.deaths,
      today: summary.todayDeaths,
      percentage: calculatePercentage(summary.deaths, summary.cases),
      color: '#E53935',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      )
    },
    {
      id: 'tests',
      label: 'Tests',
      value: summary.tests,
      color: '#8E24AA',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      )
    }
  ];

  return (
    <div className="global-stats-card card">
      <h2 className="card-title">
        <span role="img" aria-label="earth">🌎</span> Global COVID-19 Statistics
      </h2>
      
      <div className="global-stats-grid">
        {stats.map(stat => (
          <div key={stat.id} className={`stat-item ${stat.id}`} style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-header">
              <span className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
            
            <div className="stat-value" style={{ color: stat.color }}>
              {formatNumber(stat.value)}
            </div>
            
            {stat.today && (
              <div className="stat-today">
                +{formatNumber(stat.today)} today
              </div>
            )}
            
            {stat.percentage && (
              <div className="stat-percentage">
                {stat.percentage}% of total cases
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalStats;