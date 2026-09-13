import pytest
import pandas as pd
from src.validation.schema_validator import SchemaValidator

def test_cost_schema_valid():
    df_valid = pd.DataFrame([{
        "timestamp": "2026-09-13T00:00:00Z",
        "account_id": "123456",
        "region": "us-east-1",
        "service": "EC2",
        "resource_id": "i-001",
        "resource_type": "t3.medium",
        "cost": 10.5,
        "currency": "USD"
    }])
    is_valid, errors = SchemaValidator.validate_cost_schema(df_valid)
    assert is_valid is True
    assert len(errors) == 0

def test_cost_schema_missing_column():
    df_invalid = pd.DataFrame([{
        "timestamp": "2026-09-13T00:00:00Z",
        "resource_id": "i-001"
    }])
    is_valid, errors = SchemaValidator.validate_cost_schema(df_invalid)
    assert is_valid is False
    assert len(errors) > 0
