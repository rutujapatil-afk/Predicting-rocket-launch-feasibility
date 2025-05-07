# app/routes/weather.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import joblib
import pandas as pd
import numpy as np
import re
import os

router = APIRouter()

# Load model components
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/falcon9_weather_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "../models/weather_scaler.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "../models/feature_names.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
feature_names = joblib.load(FEATURES_PATH)

launch_sites = {
    'Cape Canaveral': (28.3922, -80.6077),
    'Kennedy Space Center': (28.5733, -80.6469),
    'Vandenberg': (34.6328, -120.6108)
}

class WeatherRequest(BaseModel):
    site: str
    date: str  # YYYY-MM-DD

@router.post("/weather")
def predict_weather(data: WeatherRequest):
    site = data.site
    date = data.date

    if site not in launch_sites:
        raise HTTPException(status_code=400, detail="Invalid launch site.")

    lat, lon = launch_sites[site]

    try:
        point_url = f"https://api.weather.gov/points/{lat},{lon}"
        point_response = requests.get(point_url)
        if point_response.status_code != 200:
            raise HTTPException(status_code=502, detail="NOAA point request failed.")

        forecast_url = point_response.json()['properties']['forecast']
        forecast_response = requests.get(forecast_url)
        if forecast_response.status_code != 200:
            raise HTTPException(status_code=502, detail="NOAA forecast request failed.")

        forecast_data = forecast_response.json()['properties']['periods']

        selected_forecast = next((p for p in forecast_data if date in p['startTime']), None)
        if not selected_forecast:
            raise HTTPException(status_code=404, detail="Forecast for the given date not available.")

        short_desc = selected_forecast['shortForecast'].lower()
        temp_c = (selected_forecast['temperature'] - 32) * 5 / 9 if selected_forecast['temperatureUnit'] == 'F' else selected_forecast['temperature']

        weather_input = {
            'Temperature (°C)': temp_c,
            'Humidity (%)': np.random.randint(50, 90),
            'Wind Speed (km/h)': float(re.findall(r'\d+', selected_forecast['windSpeed'])[0]) * 1.609,
            'Cloud Cover (%)': 100 if 'cloudy' in short_desc else (50 if 'partly' in short_desc else 0),
            'Visibility (km)': np.random.randint(5, 10),
            'Rain?': 1 if 'rain' in short_desc else 0,
            'Thunderstorm?': 1 if 'thunder' in short_desc else 0,
            f'LaunchSite_{site}': 1
        }

        # Align features
        input_df = pd.DataFrame([weather_input])
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0
        input_df = input_df[feature_names]

        scaled_input = scaler.transform(input_df)
        prediction = model.predict(scaled_input)[0]
        proba = model.predict_proba(scaled_input)[0]

        return {
            "suitable": bool(prediction),
            "confidence": round(proba[prediction], 4),
            "conditions": {
                "temperature": round(temp_c, 1),
                "wind": round(weather_input['Wind Speed (km/h)'], 1),
                "precipitation": float(weather_input['Rain?'])
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather prediction failed: {e}")