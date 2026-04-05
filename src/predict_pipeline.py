import numpy as np
import json
from pathlib import Path
from typing import Dict

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

xgb_model = joblib.load(MODELS_DIR / "xgb_model.pkl")
num_imputer = joblib.load(MODELS_DIR / "num_imputer.pkl")
cat_imputer = joblib.load(MODELS_DIR / "cat_imputer.pkl")
cat_encoder = joblib.load(MODELS_DIR / "cat_encoder.pkl")
numeric_features = joblib.load(MODELS_DIR / "numeric_features.pkl")
categorical_features = joblib.load(MODELS_DIR / "categorical_features.pkl")
final_feature_order = joblib.load(MODELS_DIR / "final_feature_order.pkl")

with open(MODELS_DIR / "model_config.json", "r") as f:
    model_config = json.load(f)


def risk_band(prob: float, config: Dict) -> str:
    if prob < config["low_risk_max"]:
        return "Low Risk"
    elif prob < config["medium_risk_max"]:
        return "Medium Risk"
    return "High Risk"


def _prepare_input(raw_df: pd.DataFrame) -> pd.DataFrame:
    df_input = raw_df.copy()

    # Add all missing expected columns using np.nan instead of pd.NA
    # This is safer for sklearn imputers and numeric conversion
    for col in numeric_features:
        if col not in df_input.columns:
            df_input[col] = np.nan

    for col in categorical_features:
        if col not in df_input.columns:
            df_input[col] = np.nan

    # Keep only expected columns
    df_num = df_input[numeric_features].copy()
    df_cat = df_input[categorical_features].copy()

    # Force numeric columns to real numeric dtype
    for col in numeric_features:
        df_num[col] = pd.to_numeric(df_num[col], errors="coerce")

    # Force categorical columns to strings where present, but keep missing as NaN
    for col in categorical_features:
        df_cat[col] = df_cat[col].where(df_cat[col].isna(), df_cat[col].astype(str))

    # Apply saved numeric imputer
    df_num_processed = pd.DataFrame(
        num_imputer.transform(df_num),
        columns=numeric_features,
        index=df_input.index
    )

    # Apply saved categorical imputer
    df_cat_filled = pd.DataFrame(
        cat_imputer.transform(df_cat),
        columns=categorical_features,
        index=df_input.index
    )

    # Apply saved categorical encoder
    df_cat_processed = pd.DataFrame(
        cat_encoder.transform(df_cat_filled),
        columns=categorical_features,
        index=df_input.index
    )

    # Combine processed features
    df_processed = pd.concat([df_num_processed, df_cat_processed], axis=1)

    # Reorder exactly like training
    df_processed = df_processed[final_feature_order]

    return df_processed


def predict_fraud(raw_df: pd.DataFrame) -> pd.DataFrame:
    if raw_df.empty:
        raise ValueError("Input dataframe is empty.")

    df_processed = _prepare_input(raw_df)

    fraud_prob = xgb_model.predict_proba(df_processed)[:, 1]
    threshold = model_config["final_threshold"]
    fraud_pred = (fraud_prob >= threshold).astype(int)
    fraud_risk = [risk_band(prob, model_config) for prob in fraud_prob]

    results = raw_df.copy()
    results["fraud_probability"] = fraud_prob
    results["predicted_isFraud"] = fraud_pred
    results["risk_band"] = fraud_risk

    return results