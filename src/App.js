// src/App.js
import React from 'react';
import { DataProvider } from './context/DataContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles.css';

const App = () => {
  return (
    <DataProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
};

export default App;
