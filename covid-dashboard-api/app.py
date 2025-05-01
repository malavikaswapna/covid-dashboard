# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests
import json
import schedule
import time
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Cache for storing data
data_cache = {
    'global_summary': None,
    'country_data': None,
    'vaccine_data': None,
    'historical_data': None,
    'last_updated': None
}

# Data source URLs
DISEASE_SH_BASE_URL = "https://disease.sh/v3/covid-19"
HISTORICAL_DAYS = 30  # Days of historical data to fetch

def fetch_global_data():
    """Fetch global COVID-19 statistics"""
    try:
        response = requests.get(f"{DISEASE_SH_BASE_URL}/all")
        return response.json()
    except Exception as e:
        print(f"Error fetching global data: {e}")
        return {}

def fetch_countries_data():
    """Fetch COVID-19 statistics for all countries"""
    try:
        response = requests.get(f"{DISEASE_SH_BASE_URL}/countries")
        return response.json()
    except Exception as e:
        print(f"Error fetching countries data: {e}")
        return []

def fetch_vaccine_data():
    """Fetch global vaccination data"""
    try:
        response = requests.get(f"{DISEASE_SH_BASE_URL}/vaccine/coverage/countries?lastdays=1")
        return response.json()
    except Exception as e:
        print(f"Error fetching vaccine data: {e}")
        return []

def fetch_historical_data():
    """Fetch historical COVID-19 data for trend analysis"""
    try:
        response = requests.get(f"{DISEASE_SH_BASE_URL}/historical/all?lastdays={HISTORICAL_DAYS}")
        return response.json()
    except Exception as e:
        print(f"Error fetching historical data: {e}")
        return {}

def update_cache():
    """Update the data cache with fresh data"""
    print("Updating data cache...")
    data_cache['global_summary'] = fetch_global_data()
    data_cache['country_data'] = fetch_countries_data()
    data_cache['vaccine_data'] = fetch_vaccine_data()
    data_cache['historical_data'] = fetch_historical_data()
    data_cache['last_updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"Cache updated at {data_cache['last_updated']}")

# Initialize scheduler for regular data updates
scheduler = BackgroundScheduler()
scheduler.add_job(update_cache, 'interval', minutes=60)  # Update data every hour
scheduler.start()

# Initial data load
update_cache()

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Return the global summary data"""
    return jsonify({
        'data': data_cache['global_summary'],
        'last_updated': data_cache['last_updated']
    })

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Return data for all countries"""
    return jsonify({
        'data': data_cache['country_data'],
        'last_updated': data_cache['last_updated']
    })

@app.route('/api/vaccines', methods=['GET'])
def get_vaccines():
    """Return global vaccination data"""
    return jsonify({
        'data': data_cache['vaccine_data'],
        'last_updated': data_cache['last_updated']
    })

@app.route('/api/historical', methods=['GET'])
def get_historical():
    """Return historical data for trend analysis"""
    return jsonify({
        'data': data_cache['historical_data'],
        'last_updated': data_cache['last_updated']
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """Return API status and last update time"""
    return jsonify({
        'status': 'operational',
        'last_updated': data_cache['last_updated']
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)