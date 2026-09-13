import pytest
import pandas as pd
from src.cleaning.data_cleaner import DataCleaner

def test_clean_cost_data():
    df_raw = pd.DataFrame([
        {"timestamp": "2026-09-13T00:00:00Z", "resource_id": "i-001", "cost": -5.0, "service": "EC2"},
        {"timestamp": "2026-09-13T00:00:00Z", "resource_id": "i-001", "cost": -5.0, "service": "EC2"}, # Duplicate
        {"timestamp": "2026-09-14T00:00:00Z", "resource_id": "i-001", "cost": 12.0, "service": "EC2"}
    ])
    df_clean = DataCleaner.clean_cost_data(df_raw)
    assert len(df_clean) == 2 # Deduplicated
    assert (df_clean["cost"] >= 0).all() # Negative cost clipped to 0.0
