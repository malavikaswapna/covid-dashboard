
// src/components/DataTable.js
import React, { useState, useEffect } from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { prepareTopCountriesData, formatNumber } from '../utils/dataUtils';

const DataTable = () => {
  const { countries } = useCovidData();
  const [countryData, setCountryData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'cases',
    direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  useEffect(() => {
    if (countries && Array.isArray(countries)) {
      setCountryData(countries);
    }
  }, [countries]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sorted and filtered data
  const getSortedData = () => {
    if (!countryData.length) return [];
    
    let sortableData = [...countryData];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sortableData = sortableData.filter(country => 
        country.country.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    sortableData.sort((a, b) => {
      // Handle undefined or null values
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortableData;
  };
  
  // Get current page data
  const getCurrentPageData = () => {
    const sortedData = getSortedData();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedData.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  // Handle pagination
  const totalPages = Math.ceil(getSortedData().length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  const columns = [
    { key: 'country', label: 'Country' },
    { key: 'cases', label: 'Cases' },
    { key: 'active', label: 'Active' },
    { key: 'recovered', label: 'Recovered' },
    { key: 'deaths', label: 'Deaths' },
    { key: 'todayCases', label: 'Today Cases' },
    { key: 'todayDeaths', label: 'Today Deaths' }
  ];
  
  return (
    <div className="data-table-card card">
      <h2 className="card-title">
        <span role="img" aria-label="table">📊</span> Country Data
      </h2>
      
      <div className="table-controls">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search countries..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
        
        <div className="items-per-page">
          <label>Show: </label>
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className={`sortable ${sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}`}
                >
                  {column.label}
                  <span className="sort-icon">
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCurrentPageData().map(country => (
              <tr key={country.country}>
                <td>
                  {country.countryInfo?.flag && (
                    <img 
                      src={country.countryInfo.flag} 
                      alt={`${country.country} flag`}
                      className="flag-img"
                    />
                  )}
                  {country.country}
                </td>
                <td>{formatNumber(country.cases)}</td>
                <td>{formatNumber(country.active)}</td>
                <td>{formatNumber(country.recovered)}</td>
                <td>{formatNumber(country.deaths)}</td>
                <td>{formatNumber(country.todayCases)}</td>
                <td>{formatNumber(country.todayDeaths)}</td>
              </tr>
            ))}
            
            {getCurrentPageData().length === 0 && (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  {searchTerm ? 'No countries match your search.' : 'No data available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
  <div className="pagination">
    <button 
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
      className="pagination-button"
      aria-label="First page"
    >
      &laquo;
    </button>
    
    <button 
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      &lt; Prev
    </button>
    
    {/* Smart pagination that shows limited page numbers */}
    {(() => {
      const delta = 1; // Number of pages to show before and after current page
      const range = [];
      let rangeWithDots = [];
      let l;
      
      // Calculate visible page range
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 || 
          i === totalPages || 
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          range.push(i);
        }
      }
      
      // Add dots where needed
      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
      
      // Render page buttons
      return rangeWithDots.map((number, index) => 
        number === '...' ? (
          <span key={`dot-${index}`} className="pagination-ellipsis">...</span>
        ) : (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`page-number ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        )
      );
    })()}
    
    <button 
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      Next &gt;
    </button>
    
    <button 
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
      className="pagination-button"
      aria-label="Last page"
    >
      &raquo;
    </button>
  </div>
)}
    </div>
  );
};

export default DataTable;