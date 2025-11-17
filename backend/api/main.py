# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
import os
import json
import pandas as pd
import numpy as np

from helpers.preprocessing import Preprocessor
from helpers.predict import ModelEnsemble
from helpers.anomaly import AnomalyDetect

# Path to trained models
BASE_MODELS = "/Users/adityaray/Desktop/project/backend/models"

app = FastAPI(title="IDS Backend")

# === Serve SHAP image files ===
SHAP_DIR = os.path.join(BASE_MODELS, "shap")
if os.path.exists(SHAP_DIR):
    app.mount("/shap", StaticFiles(directory=SHAP_DIR), name="shap")

# ----------------------------------------
# CORS
# ----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# Global loaded objects
# ----------------------------------------
pre = Preprocessor(models_dir=BASE_MODELS)
ensemble = ModelEnsemble(models_dir=BASE_MODELS, preprocessor=pre)
anomaly = AnomalyDetect(models_dir=BASE_MODELS, preprocessor=pre)

# ----------------------------------------
# Load Model Weights (stable)
# ----------------------------------------
model_weights = {
    "xgboost": 1.0,
    "svm": 0.8,
    "decision_tree": 0.9,
    "knn": 0.5,
    "logistic_regression": 0.7,
    "naive_bayes": 0.6,
    "random_forest": 0.8
}

# ----------------------------------------
# Input model
# ----------------------------------------
class PredictInput(BaseModel):
    named: Dict[str, Any] = None


# ----------------------------------------
# Root
# ----------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "IDS Backend Running"}


# ----------------------------------------
# ---  Single Prediction  ---
# ----------------------------------------
@app.post("/predict_single")
def predict_single(payload: PredictInput):
    if payload.named is None:
        raise HTTPException(400, "No input provided")

    try:
        X_df, raw = pre.mk_input_df(payload.named)
    except Exception as e:
        raise HTTPException(400, f"Preprocessing error: {e}")

    # Supervised predictions
    sup = ensemble.predict_supervised(X_df)

    # Weighted voting
    weighted_sum = 0.0
    total_w = 0.0
    for m, (pred, prob) in sup.items():
        w = model_weights.get(m, 1.0)
        weighted_sum += w * pred
        total_w += w

    attack_score = weighted_sum / total_w if total_w > 0 else 0

    # Anomaly
    anom = anomaly.score(X_df)
    anom_flag = (
        anom.get("ocsvm_pred", 1) == -1 or
        float(anom.get("isolation_score", 0)) < -0.15
    )

    # Final decision (stable thresholds)
    if attack_score >= 0.60:
        final_label = 1
    elif attack_score <= 0.40:
        final_label = 0
    else:
        final_label = 1 if anom_flag else 0

    confidence = float(attack_score)
    attack_type = pre.get_most_likely_attack() if final_label == 1 else "normal"

    # Log
    out = {
        "input": payload.named,
        "supervised": {
            m: {"pred": int(v[0]), "prob": float(v[1]) if v[1] else None}
            for m, v in sup.items()
        },
        "anomaly_scores": anom,
        "final_label": final_label,
        "attack_type": attack_type,
        "confidence": confidence
    }

    return out


# ----------------------------------------
# ---  CSV Batch Prediction  ---
# ----------------------------------------
@app.post("/predict_csv")
async def predict_csv(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
    except Exception:
        raise HTTPException(400, "Invalid CSV")

    X_proc = pre.mk_input_df_batch(df)
    sup_batch = ensemble.predict_supervised_batch(X_proc)
    anom_batch = anomaly.score_batch(X_proc)

    # Fix anomaly format
    for k, v in anom_batch.items():
        if isinstance(v, float):
            anom_batch[k] = [v] * len(X_proc)

    results = []
    for i in range(len(X_proc)):
        weighted_sum = 0
        total_w = 0

        sup_i = {}
        for m, (preds, probs) in sup_batch.items():
            pred = preds[i]
            prob = probs[i] if probs else None
            w = model_weights.get(m, 1)

            if pred is not None:
                weighted_sum += w * pred
                total_w += w

            sup_i[m] = {"pred": int(pred), "prob": float(prob) if prob else None}

        attack_score = weighted_sum / total_w if total_w else 0

        anom_row = {k: float(v[i]) for k, v in anom_batch.items()}
        anom_flag = (
            anom_row.get("ocsvm_pred", 1) == -1 or
            anom_row.get("isolation_score", 0) < -0.15
        )

        if attack_score >= 0.60:
            final = 1
        elif attack_score <= 0.40:
            final = 0
        else:
            final = 1 if anom_flag else 0

        attack_type = pre.get_most_likely_attack() if final == 1 else "normal"

        results.append({
            "index": i,
            "final_label": final,
            "attack_type": attack_type,
            "confidence": float(attack_score),
            "supervised": sup_i,
            "anomaly_scores": anom_row
        })

    return {"n": len(results), "results": results}


# ----------------------------------------
# SHAP + Metrics
# ----------------------------------------
@app.get("/model_metrics")
def model_metrics():
    path = os.path.join(BASE_MODELS, "supervised", "model_performance.csv")
    if not os.path.exists(path):
        raise HTTPException(404, "Metrics file missing")

    df = pd.read_csv(path)
    return df.to_dict(orient="records")


@app.get("/shap_files")
def shap_files():
    path = os.path.join(BASE_MODELS, "shap")
    if not os.path.exists(path):
        return {"shap": []}

    return {
        "shap": sorted(f for f in os.listdir(path) if f.endswith((".png", ".jpg")))
    }


# ----------------------------------------
# Run
# ----------------------------------------
if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)

# ---------------------------------------------------------
# Dashboard Stats
# ---------------------------------------------------------
@app.get("/dashboard_stats")
def dashboard_stats():
    logs_dir = os.path.join(BASE_MODELS, "..", "api_logs")
    predictions_file = os.path.join(logs_dir, "predictions.log")

    total_predictions = 0
    recent = []

    if os.path.exists(predictions_file):
        with open(predictions_file, "r") as f:
            lines = f.readlines()
            total_predictions = len(lines)
            recent = [json.loads(l.strip()) for l in lines[-5:]]  # last 5 logs

    metrics_path = os.path.join(BASE_MODELS, "supervised", "model_performance.csv")
    model_count = 0
    if os.path.exists(metrics_path):
        df = pd.read_csv(metrics_path)
        model_count = len(df)

    return {
        "backend_status": "running",
        "total_predictions": total_predictions,
        "active_models": model_count,
        "recent_predictions": recent
    }