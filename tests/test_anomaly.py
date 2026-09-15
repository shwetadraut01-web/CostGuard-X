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

def test_mad_zscore_constant_series():
    """Verify that a flat/constant cost series yields robust MAD Z-score of 0 without division by zero errors."""
    detector = StatisticalAnomalyDetector()
    dates = pd.date_range("2026-08-01", periods=10, freq="D")
    records = []
    for d in dates:
        records.append({
            "resource_id": "i-constant",
            "timestamp": d,
            "service": "EC2",
            "environment": "prod",
            "cost": 50.0,
            "cost_rolling_avg_7d": 50.0,
            "cost_pct_change": 0.0
        })
    df_features = pd.DataFrame(records)
    df_anomalies = detector.detect_anomalies(df_features)
    # A completely flat series should trigger zero anomalies
    assert len(df_anomalies) == 0

def test_mad_zscore_outlier_robustness():
    """Verify MAD robust Z-score accurately isolates single extreme outlier in noisy data."""
    detector = StatisticalAnomalyDetector()
    dates = pd.date_range("2026-08-01", periods=20, freq="D")
    records = []
    np.random.seed(42)
    for i, d in enumerate(dates):
        cost = 100.0 + (i % 3) # small normal variance
        if i == 15:
            cost = 1000.0 # massive outlier spike
        records.append({
            "resource_id": "i-robustoutlier",
            "timestamp": d,
            "service": "RDS",
            "environment": "prod",
            "cost": cost,
            "cost_rolling_avg_7d": 100.0,
            "cost_pct_change": 900.0 if i == 15 else 0.0
        })
    df_features = pd.DataFrame(records)
    df_anomalies = detector.detect_anomalies(df_features)
    assert len(df_anomalies) > 0
    assert df_anomalies.iloc[0]["robust_mad_z_score"] > 3.0

