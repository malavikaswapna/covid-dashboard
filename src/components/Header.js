// src/components/Header.js
import React from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { formatDate } from '../utils/dataUtils';

const Header = () => {
  const { lastUpdated, refreshData, loading } = useCovidData();
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>
              <span role="img" aria-label="virus">🦠</span> COVID-19 Dashboard
            </h1>
            <p className="subtitle">Real-time global statistics and visualizations</p>
          </div>
          
          <div className="header-actions">
            <div className="last-updated-container">
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {formatDate(lastUpdated)}
                </span>
              )}
            </div>
            
            <button 
              className="refresh-button" 
              onClick={refreshData}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Updating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 4v6h-6"></path>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;