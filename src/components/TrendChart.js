// src/components/TrendChart.js
import React, { useEffect, useRef, useState } from 'react';
import { useCovidData } from '../hooks/useCovidData';
import { prepareHistoricalDataForChart, formatNumber } from '../utils/dataUtils';
import * as d3 from 'd3';

const TrendChart = () => {
  const { historical } = useCovidData();
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [dataTypes, setDataTypes] = useState({
    cases: true,
    deaths: true,
    recovered: true
  });
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  // Initialize chart data
  useEffect(() => {
    if (historical && historical.cases) {
      setChartData(prepareHistoricalDataForChart(historical));
    }
  }, [historical]);

  // Get container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: 300 // Fixed height or make dynamic if needed
        });
      }
    };

    // Initial measurement
    updateDimensions();
    
    // Re-measure on window resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Toggle data series visibility
  const toggleDataType = (type) => {
    setDataTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Main chart rendering effect
  useEffect(() => {
    if (chartData.length === 0 || !svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Explicitly set SVG dimensions
    svg.attr("width", width)
       .attr("height", height);

    // Define margins with extra space for axes
    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create chart container with transform
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process and parse dates
    const parseDate = d3.timeParse('%m/%d/%y');
    const formattedData = chartData
      .map(d => ({
        ...d,
        parsedDate: parseDate(d.date)
      }))
      .filter(d => d.parsedDate) // Remove invalid dates
      .sort((a, b) => a.parsedDate - b.parsedDate); // Ensure chronological order

    if (formattedData.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .text('No valid data available');
      return;
    }

    // Determine active data types and max values
    const activeTypes = Object.entries(dataTypes)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type);

    if (activeTypes.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .text('Select data to display');
      return;
    }

    // Find proper max values for y scale - handle extreme differences in scale
    const maxValues = activeTypes.map(type => {
      return d3.max(formattedData, d => d[type] || 0);
    });
    
    const yMax = d3.max(maxValues) * 1.1; // Add 10% padding

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.parsedDate))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, yMax || 1]) // Prevent domain error if yMax is 0
      .range([innerHeight, 0]);

    // Create axes with proper tick formatting
    // Calculate appropriate number of x-axis ticks based on width
    const xTickCount = Math.max(2, Math.floor(innerWidth / 100));
    
    const xAxis = d3.axisBottom(x)
      .ticks(xTickCount)
      .tickFormat(d3.timeFormat('%d %b'));

    // Format y-axis values to be readable and not cut off
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => {
        // Use abbreviated format for large numbers
        if (d >= 1000000) {
          return (d / 1000000).toFixed(1) + 'M';
        } else if (d >= 1000) {
          return (d / 1000).toFixed(0) + 'K';
        }
        return d;
      });

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(''));

    // Add x-axis with properly rotated labels
    const xAxisGroup = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    // Rotate x-axis labels for better visibility
    xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    // Add x-axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '12px')
      .text('Date');

    // Add y-axis
    const yAxisGroup = g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Add y-axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '12px')
      .text('Number of People');

    // Define colors for data types
    const colors = {
      cases: '#FB8C00',
      deaths: '#E53935',
      recovered: '#43A047'
    };

    // Create line generator
    const line = d3.line()
      .x(d => x(d.parsedDate))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Draw lines for each active data type
    activeTypes.forEach(type => {
      // Skip recovered if no data
      if (type === 'recovered' && !formattedData[0].recovered) return;

      // Create data array for this line
      const typeData = formattedData.map(d => ({
        parsedDate: d.parsedDate,
        value: d[type] || 0
      }));

      // Add line path
      g.append('path')
        .datum(typeData)
        .attr('class', `line-${type}`)
        .attr('fill', 'none')
        .attr('stroke', colors[type])
        .attr('stroke-width', 2.5)
        .attr('d', line);
    });

    // Create tooltip if it doesn't exist
    if (!tooltipRef.current) {
      tooltipRef.current = d3.select('body')
        .append('div')
        .attr('class', 'trend-tooltip')
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

    // Create tracking circles for each data type
    const focus = {};
    activeTypes.forEach(type => {
      if (type === 'recovered' && !formattedData[0].recovered) return;
      
      focus[type] = g.append('g')
        .attr('class', `focus-${type}`)
        .style('display', 'none');
      
      focus[type].append('circle')
        .attr('r', 4)
        .attr('fill', colors[type]);
    });

    // Add overlay for mouse interaction
    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        Object.values(focus).forEach(f => f.style('display', null));
        tooltipRef.current.style('opacity', 1);
      })
      .on('mouseout', () => {
        Object.values(focus).forEach(f => f.style('display', 'none'));
        tooltipRef.current.style('opacity', 0);
      })
      .on('mousemove', function(event) {
        // Get mouse x position
        const mouseX = d3.pointer(event)[0];
        const date = x.invert(mouseX);
        
        // Find closest data point
        const bisect = d3.bisector(d => d.parsedDate).left;
        const index = bisect(formattedData, date, 1);
        
        // Handle edge cases
        if (index === 0 || index >= formattedData.length) return;
        
        const d0 = formattedData[index - 1];
        const d1 = formattedData[index];
        const d = date - d0.parsedDate > d1.parsedDate - date ? d1 : d0;
        
        // Update focus circles
        activeTypes.forEach(type => {
          if (type === 'recovered' && !d.recovered) return;
          
          focus[type].attr('transform', 
            `translate(${x(d.parsedDate)},${y(d[type] || 0)})`);
        });
        
        // Update tooltip content and position
        tooltipRef.current
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`
            <div style="font-weight: bold; text-align: center; margin-bottom: 5px;">
              ${d3.timeFormat('%B %d, %Y')(d.parsedDate)}
            </div>
            ${dataTypes.cases ? 
              `<div style="color: ${colors.cases}"><strong>Cases:</strong> ${formatNumber(d.cases)}</div>` : ''}
            ${dataTypes.deaths ? 
              `<div style="color: ${colors.deaths}"><strong>Deaths:</strong> ${formatNumber(d.deaths)}</div>` : ''}
            ${dataTypes.recovered && d.recovered ? 
              `<div style="color: ${colors.recovered}"><strong>Recovered:</strong> ${formatNumber(d.recovered)}</div>` : ''}
          `);
      });

    // Add legend in a better position
    const legendX = width - margin.right - 20;
    const legendY = margin.top;
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`)
      .style('font-size', '12px');
    
    // Create legend items
    const legendItems = [
      { type: 'cases', label: 'Cases', color: colors.cases },
      { type: 'deaths', label: 'Deaths', color: colors.deaths }
    ];
    
    // Add recovered only if data exists
    if (formattedData[0].recovered) {
      legendItems.push({ type: 'recovered', label: 'Recovered', color: colors.recovered });
    }
    
    legendItems.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`)
        .style('cursor', 'pointer')
        .on('click', () => toggleDataType(item.type));
      
      // Legend color box
      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', item.color)
        .style('stroke', dataTypes[item.type] ? 'none' : '#999')
        .style('stroke-width', 1)
        .style('fill-opacity', dataTypes[item.type] ? 1 : 0.2);
      
      // Legend text
      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .attr('dy', '.35em')
        .text(item.label)
        .style('fill', dataTypes[item.type] ? '#333' : '#999');
    });

  }, [chartData, dataTypes, dimensions]);

  // Clean up tooltip on unmount
  useEffect(() => {
    return () => {
      if (tooltipRef.current) {
        d3.select('.trend-tooltip').remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  return (
    <div className="trend-chart-card card">
      <h2 className="card-title">
        <span role="img" aria-label="chart">📈</span> Trend Analysis
      </h2>
      <div className="chart-description">
        Historical progression of COVID-19 cases, deaths, and recoveries over time.
        Click on legend items to toggle data visibility.
      </div>
      
      <div className="chart-container" ref={containerRef}>
        <svg ref={svgRef} className="trend-chart-svg"></svg>
      </div>
    </div>
  );
};

export default TrendChart;