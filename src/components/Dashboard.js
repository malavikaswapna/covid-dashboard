// src/components/Dashboard.js
import React from 'react';
import { useCovidData } from '../hooks/useCovidData';
import GlobalStats from './GlobalStats';
import CountryMap from './CountryMap';
import TrendChart from './TrendChart';
import VaccinationProgress from './VaccinationProgress';
import DataTable from './DataTable';

const Dashboard = () => {
  const { loading, error } = useCovidData();

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading COVID-19 data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <p>Please try refreshing the page or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-grid">
        {/* Top row: Summary stats and map */}
        <div className="dashboard-row">
          <div className="dashboard-cell">
            <GlobalStats />
          </div>
          <div className="dashboard-cell map-cell">
            <CountryMap />
          </div>
        </div>
        
        {/* Middle row: Trend analysis */}
        <div className="dashboard-row">
          <div className="dashboard-cell full-width">
            <TrendChart />
          </div>
        </div>
        
        {/* Bottom row: Vaccination progress and country data table */}
        <div className="dashboard-row">
          <div className="dashboard-cell">
            <VaccinationProgress />
          </div>
          <div className="dashboard-cell">
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;