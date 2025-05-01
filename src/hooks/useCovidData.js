// src/hooks/useCovidData.js
import { useContext } from 'react';
import DataContext from '../context/DataContext';

export const useCovidData = () => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useCovidData must be used within a DataProvider');
  }
  
  return context;
};

