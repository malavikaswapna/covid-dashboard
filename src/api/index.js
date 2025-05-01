// src/api/index.js
import axios from 'axios';

const API_BASE_URL = 'https://covid-dashboard-ww6u.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchGlobalSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching global summary:', error);
    throw error;
  }
};

export const fetchCountriesData = async () => {
  try {
    const response = await api.get('/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries data:', error);
    throw error;
  }
};

export const fetchVaccineData = async () => {
  try {
    const response = await api.get('/vaccines');
    return response.data;
  } catch (error) {
    console.error('Error fetching vaccine data:', error);
    throw error;
  }
};

export const fetchHistoricalData = async () => {
  try {
    const response = await api.get('/historical');
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

export const checkApiStatus = async () => {
  try {
    const response = await api.get('/status');
    return response.data;
  } catch (error) {
    console.error('Error checking API status:', error);
    throw error;
  }
};

// Fetch all data at once for dashboard
export const fetchDashboardData = async () => {
  try {
    const [summary, countries, vaccines, historical] = await Promise.all([
      fetchGlobalSummary(),
      fetchCountriesData(),
      fetchVaccineData(),
      fetchHistoricalData()
    ]);
    
    return {
      summary,
      countries,
      vaccines,
      historical,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export default {
  fetchGlobalSummary,
  fetchCountriesData,
  fetchVaccineData,
  fetchHistoricalData,
  checkApiStatus,
  fetchDashboardData
};