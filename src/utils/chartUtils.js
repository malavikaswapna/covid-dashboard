// src/utils/chartUtils.js
import * as d3 from 'd3';

export const generateColorScale = (domain = [0, 100], range = ['#f5f5dc', '#8b0000']) => {
  return d3.scaleLinear()
    .domain(domain)
    .range(range);
};

export const getMapColorByValue = (value, max) => {
  if (!value || !max) return '#f5f5dc';
  
  const scale = generateColorScale([0, max]);
  return scale(value);
};

export const lineColors = {
  cases: '#FB8C00',
  deaths: '#E53935',
  recovered: '#43A047',
  active: '#1E88E5',
  tests: '#8E24AA',
  vaccines: '#00BCD4'
};

export const formatTooltipValue = (value, type) => {
  if (type === 'percentage') {
    return `${value}%`;
  }
  return formatNumber(value);
};

export const generateChartOptions = (title, isResponsive = true) => {
  return {
    responsive: isResponsive,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: title,
      fontSize: 16
    },
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (tooltipItem, data) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = formatNumber(tooltipItem.value);
          return `${datasetLabel}: ${value}`;
        }
      }
    },
    elements: {
      point: {
        radius: 2
      },
      line: {
        tension: 0.2
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }],
      yAxes: [{
        gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => formatNumber(value)
        }
      }]
    }
  };
};