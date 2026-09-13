import pytest
import pandas as pd
from src.waste.fingerprint_engine import WasteFingerprintEngine

def test_idle_resource_fingerprint():
    engine = WasteFingerprintEngine()
    
    dates = pd.date_range("2026-08-01", periods=10, freq="D")
    records = []
    for d in dates:
        records.append({
            "resource_id": "i-idledev",
            "timestamp": d,
            "service": "EC2",
            "resource_type": "t3.medium",
            "environment": "dev",
            "application": "Test App",
            "cost": 12.0,
            "cpu_utilization": 4.0, # Low CPU < 10%
            "memory_utilization": 15.0,
            "runtime_hours": 24.0, # 24h continuous
            "storage_growth_pct": 0.0,
            "request_growth_pct": 0.0,
            "cost_pct_change": 0.0
        })
        
    df_features = pd.DataFrame(records)
    df_waste = engine.analyze_resource_waste(df_features)
    
    assert len(df_waste) == 1
    w = df_waste.iloc[0]
    assert w["category"] == "Idle Resource"
    assert bool(w["is_waste"]) is True
