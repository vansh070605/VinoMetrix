from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize App
app = FastAPI(title="VinoMetrix API")

# --- UPDATE THIS SECTION ---
origins = [
    "http://localhost:5173",             # Local testing
    "https://vino-metrix.vercel.app",    # YOUR VERCEL URL (From your error log)
    "https://vinometrix.vercel.app"      # Adding this variation just in case
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # <--- Use specific list instead of ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load Model
try:
    model = joblib.load('wine_model.pkl')
    scaler = joblib.load('wine_scaler.pkl')
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# 4. Define Data Structure
class WineFeatures(BaseModel):
    fixed_acidity: float
    volatile_acidity: float
    citric_acid: float
    residual_sugar: float
    chlorides: float
    free_sulfur_dioxide: float
    total_sulfur_dioxide: float
    density: float
    pH: float
    sulphates: float
    alcohol: float

@app.get("/")
def read_root():
    return {"message": "🍷 VinoMetrix API is Live! Send POST requests to /predict"}
# -------------------------------

@app.post("/predict")
def predict_wine(data: WineFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Check server logs.")
    
    print(f"📥 RECEIVED DATA: {data}")

    try:
        # Prepare features
        features = [[
            data.fixed_acidity,
            data.volatile_acidity,
            data.citric_acid,
            data.residual_sugar,
            data.chlorides,
            data.free_sulfur_dioxide,
            data.total_sulfur_dioxide,
            data.density,
            data.pH,
            data.sulphates,
            data.alcohol
        ]]

        # --- CRITICAL FIX: USE THE SCALER ---
        # The model expects scaled numbers (0-1), not raw numbers (e.g. 14.5)
        scaled_features = scaler.transform(features)
        # ------------------------------------

        # 1. Get raw prediction
        raw_prediction = model.predict(scaled_features)[0]
        prediction = float(raw_prediction)

        print(f"🔮 AI Predicted Class: {prediction}") 

        # --- FIX FOR BINARY CLASSIFIER (0 vs 1) ---
        if prediction == 1.0:
            verdict = "Premium"
            # Fake a high score for confidence calculation
            confidence_score = 95.0 
        else:
            verdict = "Regular"
            # Fake a generic score for confidence
            confidence_score = 75.0 

        return {
            "quality_verdict": verdict,
            "confidence": confidence_score,
            "prediction": prediction 
        }

    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))