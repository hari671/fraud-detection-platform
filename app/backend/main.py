from pathlib import Path
import sys
from typing import Any, Dict, List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from src.predict_pipeline import predict_fraud

app = FastAPI(title="FraudShield API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionInput(BaseModel):
    data: Dict[str, Any]


class BatchTransactionInput(BaseModel):
    data: List[Dict[str, Any]]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict_one(payload: TransactionInput):
    try:
        df = pd.DataFrame([payload.data])
        results = predict_fraud(df)
        output = results[["fraud_probability", "predicted_isFraud", "risk_band"]].iloc[0].to_dict()
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/batch_predict")
def predict_batch(payload: BatchTransactionInput):
    try:
        df = pd.DataFrame(payload.data)
        results = predict_fraud(df)
        output = results[["fraud_probability", "predicted_isFraud", "risk_band"]].to_dict(orient="records")
        return {"predictions": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))