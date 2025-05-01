// src/components/VaccinationProgress.js
import React, { useEffect, useRef, useState } from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { prepareVaccineDataForChart, formatNumber } from '../utils/dataUtils';
import * as d3 from 'd3';

const VaccinationProgress = () => {
  const { vaccines, summary } = useCovidData();
  const svgRef = useRef(null);
  const [vaccineData, setVaccineData] = useState([]);
  const [viewType, setViewType] = useState('top'); // 'top' or 'world'
  const [topCount, setTopCount] = useState(10);
  
  useEffect(() => {
    if (vaccines && Array.isArray(vaccines)) {
      setVaccineData(prepareVaccineDataForChart(vaccines));
    }
  }, [vaccines]);
  
  useEffect(() => {
    if (vaccineData.length === 0 || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // Get actual SVG dimensions
    const width = svgRef.current.clientWidth || 800;
    const height = 350; // Fixed height
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Set dimensions
    svg.attr("width", width)
       .attr("height", height);
    
    // Filter and sort data based on view type
    let displayData;
    if (viewType === 'top') {
      displayData = [...vaccineData]
        .sort((a, b) => b.doses - a.doses)
        .slice(0, topCount);
    } else {
      // For world view, use top 20 by default to keep chart readable
      displayData = [...vaccineData]
        .sort((a, b) => b.doses - a.doses)
        .slice(0, 20);
    }
    
    // Use a moderate left margin - no need for extra space for icons now
    const margin = { top: 20, right: 40, bottom: 50, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create chart container
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const y = d3.scaleBand()
      .domain(displayData.map(d => d.country))
      .range([0, innerHeight])
      .padding(0.2);
    
    const x = d3.scaleLinear()
      .domain([0, d3.max(displayData, d => d.doses) * 1.05])
      .range([0, innerWidth]);
    
    // Create and add axes
    const xAxis = d3.axisBottom(x)
      .ticks(5)
      .tickFormat(d => {
        if (d >= 1000000000) {
          return (d / 1000000000).toFixed(1) + 'B';
        } else if (d >= 1000000) {
          return (d / 1000000).toFixed(1) + 'M';
        } else if (d >= 1000) {
          return (d / 1000).toFixed(0) + 'K';
        }
        return d;
      });
    
    const yAxis = d3.axisLeft(y);
    
    // Add x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);
    
    // Add x-axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 35})`)
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .text('Vaccine Doses Administered');
    
    // Add y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
    
    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickSize(innerHeight)
        .tickFormat(''));
    
    // Add bars
    g.selectAll('.bar')
      .data(displayData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.country))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0) // Start with width 0 for animation
      .attr('fill', '#00BCD4')
      .attr('rx', 3)
      .attr('ry', 3)
      .on('mouseover', function(event, d) {
        // Highlight bar on hover
        d3.select(this).attr('fill', '#0097A7');
        
        // Show value
        g.append('text')
          .attr('class', 'bar-value')
          .attr('x', x(d.doses) + 5)
          .attr('y', y(d.country) + y.bandwidth() / 2)
          .attr('dy', '.35em')
          .attr('fill', '#0097A7')
          .style('font-weight', 'bold')
          .text(formatNumber(d.doses));
      })
      .on('mouseout', function() {
        // Restore original bar style
        d3.select(this).attr('fill', '#00BCD4');
        
        // Remove value label
        g.selectAll('.bar-value').remove();
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.doses));
    
    // No country icons/flags - removed as requested
    
  }, [vaccineData, viewType, topCount]);
  
  // Calculate global vaccination coverage if summary data available
  const globalPopulation = summary?.population || 7800000000;
  const totalVaccines = vaccineData.reduce((total, country) => total + country.doses, 0);
  const estimatedCoverage = (totalVaccines / (globalPopulation * 2)) * 100;
  
  return (
    <div className="vaccination-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span role="img" aria-label="syringe">💉</span> Vaccination Progress
        </h2>
        
        <div className="view-controls">
          <select 
            className="view-selector"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="top">Top Countries</option>
            <option value="world">World View</option>
          </select>
          
          {viewType === 'top' && (
            <select
              className="count-selector"
              value={topCount}
              onChange={(e) => setTopCount(Number(e.target.value))}
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="15">Top 15</option>
              <option value="20">Top 20</option>
            </select>
          )}
        </div>
      </div>
      
      {globalPopulation && (
        <div className="global-vaccination-stats">
          <div className="stat-item">
            <div className="stat-value">{formatNumber(totalVaccines)}</div>
            <div className="stat-label">Doses Administered</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{estimatedCoverage.toFixed(2)}%</div>
            <div className="stat-label">Estimated Global Coverage</div>
          </div>
        </div>
      )}
      
      <div className="chart-container">
        <svg ref={svgRef} width="100%" height="350px" style={{ overflow: "visible" }}></svg>
      </div>
    </div>
  );
};

export default VaccinationProgress;