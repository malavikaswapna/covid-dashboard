// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p>COVID-19 Dashboard for real-time tracking of global pandemic statistics</p>
            <p className="data-source">
              Data sources: <a href="https://disease.sh/" target="_blank" rel="noopener noreferrer">Disease.sh API</a>
            </p>
          </div>
          <div className="footer-links">
            <a href="#about" className="footer-link">About</a>
            <a href="#sources" className="footer-link">Data Sources</a>
            <a href="#api" className="footer-link">API</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} COVID-19 Dashboard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;