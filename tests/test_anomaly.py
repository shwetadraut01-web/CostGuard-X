import pytest
import pandas as pd
import numpy as np
from src.anomaly.statistical_detector import StatisticalAnomalyDetector

def test_statistical_anomaly_detection():
    detector = StatisticalAnomalyDetector()
    
    # Create synthetic series with steady baseline and sudden spike
    dates = pd.date_range("2026-08-01", periods=30, freq="D")
    records = []
    for i, d in enumerate(dates):
        cost = 10.0 if i < 25 else 95.0 # Spike on day 25
        records.append({
            "resource_id": "i-testspike",
            "timestamp": d,
            "service": "EC2",
            "environment": "dev",
            "cost": cost,
            "cost_rolling_avg_7d": 10.0,
            "cost_pct_change": 850.0 if i == 25 else 0.0
        })
        
    df_features = pd.DataFrame(records)
    df_anomalies = detector.detect_anomalies(df_features)
    
    assert len(df_anomalies) > 0
    assert "i-testspike" in df_anomalies["resource_id"].values
    spike_row = df_anomalies[df_anomalies["resource_id"] == "i-testspike"].iloc[0]
    assert spike_row["current_cost"] == 95.0
    assert spike_row["severity"] in ["High", "Medium"]
