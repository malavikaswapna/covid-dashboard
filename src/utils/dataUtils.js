// src/utils/dataUtils.js
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  
  return new Intl.NumberFormat().format(num);
};

export const calculatePercentage = (numerator, denominator) => {
  if (!numerator || !denominator) return 0;
  return ((numerator / denominator) * 100).toFixed(2);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const prepareCountryDataForMap = (countries) => {
  if (!countries || !Array.isArray(countries)) return [];
  
  return countries.map(country => ({
    id: country.countryInfo?.iso2 || country.country,
    name: country.country,
    value: country.cases,
    active: country.active,
    recovered: country.recovered,
    deaths: country.deaths,
    tests: country.tests,
    todayCases: country.todayCases,
    todayDeaths: country.todayDeaths,
    todayRecovered: country.todayRecovered,
    lat: country.countryInfo?.lat || 0,
    long: country.countryInfo?.long || 0,
    flag: country.countryInfo?.flag || ''
  }));
};

export const prepareHistoricalDataForChart = (historicalData) => {
  if (!historicalData || !historicalData.cases) return [];
  
  const { cases, deaths, recovered } = historicalData;
  
  return Object.keys(cases).map(date => ({
    date,
    cases: cases[date],
    deaths: deaths[date],
    recovered: recovered && recovered[date] ? recovered[date] : null
  }));
};

export const prepareVaccineDataForChart = (vaccineData) => {
  if (!vaccineData || !Array.isArray(vaccineData)) return [];
  
  return vaccineData
    .filter(country => country.timeline && Object.keys(country.timeline).length > 0)
    .map(country => {
      const lastDate = Object.keys(country.timeline).pop();
      const vaccineDoses = country.timeline[lastDate];
      
      return {
        country: country.country,
        doses: vaccineDoses,
        code: country.country.toLowerCase().substring(0, 2)
      };
    })
    .sort((a, b) => b.doses - a.doses);
};

// Prepare data for top countries table
export const prepareTopCountriesData = (countries, sortBy = 'cases', limit = 10) => {
  if (!countries || !Array.isArray(countries)) return [];
  
  return [...countries]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, limit)
    .map(country => ({
      name: country.country,
      flag: country.countryInfo?.flag,
      cases: country.cases,
      active: country.active,
      recovered: country.recovered,
      deaths: country.deaths,
      tests: country.tests,
      casesPerOneMillion: country.casesPerOneMillion,
      deathsPerOneMillion: country.deathsPerOneMillion
    }));
};
