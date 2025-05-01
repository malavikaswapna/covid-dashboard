// src/context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchDashboardData } from '../api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    summary: null,
    countries: null,
    vaccines: null,
    historical: null,
    lastUpdated: null
  });
  const [refreshInterval, setRefreshInterval] = useState(5 * 60 * 1000); // 5 minutes default

  const loadData = async () => {
    try {
      setLoading(true);
      const dashboardData = await fetchDashboardData();
      
      setData({
        summary: dashboardData.summary.data,
        countries: dashboardData.countries.data,
        vaccines: dashboardData.vaccines.data,
        historical: dashboardData.historical.data,
        lastUpdated: dashboardData.summary.last_updated
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch COVID-19 data. Please try again later.');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Set up periodic refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      loadData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Function to manually refresh data
  const refreshData = () => {
    loadData();
  };

  // Function to change refresh interval
  const updateRefreshInterval = (minutes) => {
    setRefreshInterval(minutes * 60 * 1000);
  };

  return (
    <DataContext.Provider
      value={{
        ...data,
        loading,
        error,
        refreshData,
        updateRefreshInterval,
        refreshInterval: refreshInterval / (60 * 1000)
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;