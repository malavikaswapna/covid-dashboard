// src/components/CountryMap.js
import React, { useEffect, useRef, useState } from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { prepareCountryDataForMap, formatNumber } from '../utils/dataUtils';
import * as d3 from 'd3';

const CountryMap = () => {
  const { countries } = useCovidData();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dataType, setDataType] = useState('cases');
  const [mapData, setMapData] = useState([]);
  
  // Define renderMap as a ref so it can be accessed across effects
  const renderMapRef = useRef(null);
  
  useEffect(() => {
    if (countries && Array.isArray(countries)) {
      setMapData(prepareCountryDataForMap(countries));
    }
  }, [countries]);
  
  // Main effect for rendering the map
  useEffect(() => {
    if (mapData.length === 0 || !svgRef.current) return;
    
    // Define the renderMap function
    const renderMap = async () => {
      // Get container dimensions - important for proper sizing
      const container = svgRef.current.parentNode;
      const width = container.clientWidth || 500; // Fallback if clientWidth is 0
      const height = container.clientHeight || 400; // Fallback height
      
      const svg = d3.select(svgRef.current);
      // Clear previous content
      svg.selectAll("*").remove();
      
      // Set SVG dimensions explicitly - CRITICAL for proper sizing
      svg.attr("width", width)
         .attr("height", height);
      
      // Create a tooltip div if it doesn't exist
      if (!tooltipRef.current) {
        tooltipRef.current = d3.select('body')
          .append('div')
          .attr('class', 'map-tooltip')
          .style('opacity', 0)
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('border', '1px solid #ddd')
          .style('border-radius', '4px')
          .style('padding', '10px')
          .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
          .style('pointer-events', 'none')
          .style('font-size', '12px')
          .style('z-index', 1000);
      }
      
      // Create projection - ONLY ONCE
      const projection = d3.geoMercator()
        .scale((width) / (2 * Math.PI)) // Scale based on width
        .translate([width / 2, height / 2]) // Center in available space
        .center([0, 20]); // Adjust center point for better visibility
      
      // Create path generator
      const path = d3.geoPath().projection(projection);
      
      try {
        // Fetch world map GeoJSON data
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const worldData = await response.json();
        
        // Find max value for color scale
        const maxValue = d3.max(mapData, d => d[dataType]) || 0;
        
        // Create color scale
        const colorScale = d3.scaleSequential()
          .domain([0, maxValue || 1]) // Prevent domain error if maxValue is 0
          .interpolator(
            dataType === 'deaths' ? d3.interpolateReds :
            dataType === 'recovered' ? d3.interpolateGreens :
            dataType === 'active' ? d3.interpolateBlues :
            d3.interpolateOranges  // Default for cases
          );
        
        // Add countries
        svg.selectAll('path')
          .data(worldData.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', d => {
            const countryData = mapData.find(item => 
              item.id === d.properties.iso_a2 || 
              item.name === d.properties.name
            );
            return countryData ? colorScale(countryData[dataType]) : '#F5F5F5';
          })
          .attr('stroke', '#FFF')
          .attr('stroke-width', 0.5)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .attr('stroke-width', 1.5)
              .attr('stroke', '#333');
            
            const countryData = mapData.find(item => 
              item.id === d.properties.iso_a2 || 
              item.name === d.properties.name
            );
            
            if (countryData) {
              tooltipRef.current
                .style('opacity', 1)
                .html(`
                  <div style="text-align: center; margin-bottom: 5px;">
                    <strong>${countryData.name}</strong>
                    ${countryData.flag ? `<img src="${countryData.flag}" style="height: 12px; margin-left: 5px;" />` : ''}
                  </div>
                  <div style="color: #FB8C00;"><strong>Cases:</strong> ${formatNumber(countryData.cases)}</div>
                  <div style="color: #1E88E5;"><strong>Active:</strong> ${formatNumber(countryData.active)}</div>
                  <div style="color: #43A047;"><strong>Recovered:</strong> ${formatNumber(countryData.recovered)}</div>
                  <div style="color: #E53935;"><strong>Deaths:</strong> ${formatNumber(countryData.deaths)}</div>
                  <div><strong>Today's Cases:</strong> +${formatNumber(countryData.todayCases)}</div>
                  <div><strong>Today's Deaths:</strong> +${formatNumber(countryData.todayDeaths)}</div>
                `)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            }
          })
          .on('mouseout', function() {
            d3.select(this)
              .attr('stroke-width', 0.5)
              .attr('stroke', '#FFF');
            
            tooltipRef.current.style('opacity', 0);
          });
        
        // Add zoom functionality
        const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .on('zoom', (event) => {
            svg.selectAll('path')
              .attr('transform', event.transform);
          });
        
        svg.call(zoom);
        
        // Add color legend
        const legendWidth = Math.min(200, width * 0.4); // Make legend responsive
        const legendHeight = 10;
        
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${width - legendWidth - 20}, 20)`);
        
        // Create gradient for legend
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
          .attr('id', 'legendGradient')
          .attr('x1', '0%')
          .attr('x2', '100%')
          .attr('y1', '0%')
          .attr('y2', '0%');
        
        // Add gradient stops
        const numStops = 10;
        for (let i = 0; i < numStops; i++) {
          const offset = i / (numStops - 1);
          gradient.append('stop')
            .attr('offset', `${offset * 100}%`)
            .attr('stop-color', colorScale(maxValue * offset));
        }
        
        // Add legend rectangle
        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#legendGradient)');
        
        // Add legend title
        legend.append('text')
          .attr('y', -5)
          .style('font-size', '12px')
          .text(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} by Country`);
        
        // Add min text
        legend.append('text')
          .attr('y', legendHeight + 15)
          .style('font-size', '10px')
          .text('0');
        
        // Add max text
        legend.append('text')
          .attr('x', legendWidth)
          .attr('y', legendHeight + 15)
          .style('text-anchor', 'end')
          .style('font-size', '10px')
          .text(formatNumber(maxValue));
        
      } catch (error) {
        console.error('Error loading map data:', error);
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .text('Error loading map data');
      }
    };
    
    // Store the renderMap function in the ref so it can be accessed from other effects
    renderMapRef.current = renderMap;
    
    // Call it initially
    renderMap();
    
    // Cleanup
    return () => {
      if (tooltipRef.current) {
        d3.select('.map-tooltip').remove();
        tooltipRef.current = null;
      }
    };
  }, [mapData, dataType]); // Dependencies for the main useEffect
  
  // Separate effect for resize handling
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current && renderMapRef.current) {
        renderMapRef.current();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Force a resize after component mounts to ensure proper sizing
    const timer = setTimeout(() => {
      handleResize();
    }, 300);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);
  
  // The rest of your component code (data type buttons, etc.)
  const dataTypeOptions = [
    { value: 'cases', label: 'Total Cases', color: '#FB8C00' },
    { value: 'active', label: 'Active Cases', color: '#1E88E5' },
    { value: 'recovered', label: 'Recovered', color: '#43A047' },
    { value: 'deaths', label: 'Deaths', color: '#E53935' }
  ];
  
  return (
    <div className="country-map-card card">
      <div className="card-header">
        <h2 className="card-title">
          <span role="img" aria-label="map">🗺️</span> Global COVID-19 Map
        </h2>
        <div className="map-controls">
          <div className="map-data-selector">
            {dataTypeOptions.map(option => (
              <button
                key={option.value}
                className={`data-type-button ${dataType === option.value ? 'active' : ''}`}
                style={{ 
                  borderColor: dataType === option.value ? option.color : 'transparent',
                  color: dataType === option.value ? option.color : '#333'
                }}
                onClick={() => setDataType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="map-container">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>
    </div>
  );
};

export default CountryMap;