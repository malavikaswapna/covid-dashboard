# 🦠 COVID-19 Global Dashboard

![COVID-19 Dashboard Screenshot](https://i.postimg.cc/PJqvSB9J/Screenshot-2025-05-01-at-2-21-22-pm.png)

[✨ Live Demo](https://malavikaswapna.github.io/covid-dashboard/)  
Frontend: [https://malavikaswapna.github.io/covid-dashboard](https://malavikaswapna.github.io/covid-dashboard)  
Backend API: [https://covid-dashboard-ww6u.onrender.com/api](https://covid-dashboard-ww6u.onrender.com/api)

## 📋 Overview

This **COVID-19 Global Dashboard** provides real-time monitoring and visualization of the coronavirus pandemic across the world. The application offers comprehensive statistics, interactive maps, trend analysis, and vaccination progress tracking in an intuitive and responsive interface.

Stay informed with up-to-date information sourced from the **Disease.sh API**, presented in a clean, data-driven format that makes global pandemic statistics accessible and understandable.

---

## 🌟 Features

### 📊 Global Statistics
- At-a-glance summary of total cases, active cases, recoveries, and deaths  
- Daily and cumulative statistics with percentage breakdowns  
- Automatic data refreshing  

### 🗺️ Interactive World Map
- Color-coded visualization of COVID-19 impact by country  
- Toggle between cases, active, recovered, and deaths data views  
- Detailed tooltips with country-specific information  

### 📈 Trend Analysis
- Historical progression of cases, deaths, and recoveries over time  
- Interactive time-series charts with toggleable data series  
- Visual patterns to understand pandemic waves and progress  

### 💉 Vaccination Progress
- Country-by-country vaccination comparison  
- Global vaccination coverage estimates  
- Sortable data with flexible viewing options  

### 📱 Responsive Design
- Seamless experience across desktop, tablet, and mobile devices  
- Optimized visualizations that adapt to different screen sizes  
- Accessible interface ensuring information is available to all users  

---

## 🛠️ Technology Stack

### Frontend
- **React**: Component-based UI development  
- **D3.js**: Advanced data visualizations  
- **Axios**: API communication  
- **CSS3**: Custom styling with responsive design  

### Backend
- **Flask**: Lightweight Python web framework  
- **Pandas**: Data processing and analysis  
- **APScheduler**: Automated data updates  
- **Flask-CORS**: Cross-origin resource sharing  

### Deployment
- **GitHub Pages**: Frontend hosting  
- **Render**: Backend hosting  

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)  
- [Python](https://www.python.org/) (v3.8+)  
- [Git](https://git-scm.com/)

## 🧰 Installation

### 🔁 Clone the Repository

```bash
git clone https://github.com/malavikaswapna/covid-dashboard.git
cd covid-dashboard
```
### 🖥️ Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```
### 🔙 Backend Setup
```bash
# Navigate to the API directory
cd covid-dashboard-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

## 📱 Usage

- **Global Overview**: The dashboard homepage provides a comprehensive summary of the global COVID-19 situation.  
- **Country Data**: Select specific countries from the data table to view detailed statistics.  
- **Data Visualization**: Explore the interactive map to visualize the pandemic's global impact.  
- **Trend Analysis**: Use the trend chart to understand how cases, recoveries, and deaths have evolved over time.  
- **Vaccination Tracking**: Monitor global vaccination progress with the vaccination chart.  
- **Data Refresh**: Click the refresh button in the header to fetch the latest data.  

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork** the repository  
2. **Create** your feature branch ```git checkout -b feature/amazing-feature ```
3. **Commit** your changes ```git commit -m 'Add some amazing feature'```
4. **Push** to the branch ```git push origin feature/amazing-feature```

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Disease.sh](https://disease.sh) for providing the COVID-19 API  
- All the healthcare workers and essential personnel worldwide fighting against the pandemic  
- The open-source community for providing tools and libraries that made this project possible  

---

<p align="center">
  <i>Stay safe, stay informed. Together we can overcome this global challenge.</i>
</p>

<p align="center">
  Developed with ❤️ by <b>Malavika Swapna</b>
</p>


