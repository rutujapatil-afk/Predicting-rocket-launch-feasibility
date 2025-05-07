from fastapi import APIRouter, HTTPException
from app.schemas.cost import CostInput, CostPrediction
import os
import joblib
import numpy as np
import pandas as pd

router = APIRouter()

# Paths to model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/falcon9_cost_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "../models/cost_scaler.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "../models/cost_feature_names.pkl")

# Load model, scaler, and feature names
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    feature_names = joblib.load(FEATURE_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model, scaler, or features: {e}")

@router.post("/cost", response_model=CostPrediction)
def predict_cost(data: CostInput):
    try:
        input_dict = data.dict()
        # Toggle this off in production
        print("Input Data:", input_dict)

        # Convert to DataFrame
        df = pd.DataFrame([input_dict])

        # Convert 'Yes'/'No' to binary
        binary_map = {"Yes": 1, "No": 0}
        for col in ["ReusedBooster", "GridFins", "Legs", "LandingSuccess"]:
            df[col] = df[col].map(binary_map)

        # Add default static features used during training
        default_values = {
            "FlightNumber": 0,
            "Flights": 0,
            "Reused": df["ReusedBooster"].iloc[0],
            "Longitude": 0.0,
            "Latitude": 0.0,
            "Class": 1,
            "year": 2020
        }
        for k, v in default_values.items():
            df[k] = v

        # One-hot encode categorical features
        for col in ["Orbit", "LandingType"]:
            dummies = pd.get_dummies(df[col], prefix=col)
            df = df.drop(columns=[col]).join(dummies)

        # Ensure all expected features are present
        for col in feature_names:
            if col not in df.columns:
                df[col] = 0  # Fill missing with 0

        # Reorder columns to match training
        df = df[feature_names]
        print("Processed DataFrame:\n", df)

        # Scale and predict
        scaled = scaler.transform(df)
        pred = model.predict(scaled)
        print("Raw prediction:", pred)

        # Handle model output shape
        pred = np.array(pred)
        if pred.ndim == 2 and pred.shape[1] == 3:
            vehicle, operations, insurance = pred[0]
            total = vehicle + operations + insurance
            return {
                "total": round(total, 2),
                "breakdown": {
                    "vehicle": round(vehicle, 2),
                    "operations": round(operations, 2),
                    "insurance": round(insurance, 2)
                }
            }

        elif pred.ndim == 1:
            total = float(pred[0])
            return {
                "total": round(total, 2),
                "breakdown": {
                    "vehicle": round(total * 0.75, 2),
                    "operations": round(total * 0.20, 2),
                    "insurance": round(total * 0.05, 2)
                }
            }

        raise HTTPException(status_code=500, detail="Unexpected prediction format.")

    except Exception as e:
        print("❌ Error during prediction:", e)
        raise HTTPException(status_code=500, detail=f"Cost prediction failed: {e}")
