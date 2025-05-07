from fastapi import APIRouter, HTTPException
from app.schemas.risk import RiskInput, RiskPrediction
import os
import joblib
import pandas as pd

router = APIRouter()

# Paths to model and artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/falcon9_risk_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "../models/risk_scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "../models/risk_label_encoder.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "../models/risk_feature_names.pkl")

# Load model, scaler, encoder, and feature names
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    encoder = joblib.load(ENCODER_PATH)
    feature_names = joblib.load(FEATURE_PATH)
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model components: {e}")

@router.post("/risk", response_model=RiskPrediction)
def assess_risk(data: RiskInput):
    try:
        input_dict = data.dict()
        print("🔍 Risk input received:", input_dict)

        # Convert input to DataFrame
        df = pd.DataFrame([input_dict])

        # One-hot encode categorical fields
        df = pd.get_dummies(df, columns=["Location", "LandingPad"])

        # Fill missing feature columns with 0
        for col in feature_names:
            if col not in df.columns:
                df[col] = 0

        # Ensure correct feature order
        df = df[feature_names]

        # Scale features
        scaled = scaler.transform(df)

        # Predict class and probabilities
        prediction = model.predict(scaled)[0]
        proba = model.predict_proba(scaled)[0]
        predicted_label = encoder.inverse_transform([prediction])[0]

        # Build class-to-probability dictionary
        class_labels = encoder.classes_
        prob_dict = {label: round(float(p), 4) for label, p in zip(class_labels, proba)}

        return {
            "risk_level": predicted_label,
            "confidence": round(prob_dict[predicted_label], 4),
            "probabilities": prob_dict
        }

    except Exception as e:
        print("❌ Error during risk prediction:", e)
        raise HTTPException(status_code=500, detail=f"Risk prediction failed: {e}")
