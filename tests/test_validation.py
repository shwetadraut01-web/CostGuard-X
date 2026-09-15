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

def test_what_if_pydantic_range_bounds():
    """Verify WhatIfRequest enforces strict range limits (runtime 0-24h, downsize 0-100%)."""
    from backend.app.models.schemas import WhatIfRequest
    from pydantic import ValidationError

    # Valid request
    valid_req = WhatIfRequest(custom_runtime_hours=12.0, custom_downsize_pct=50.0, custom_storage_archival_pct=70.0)
    assert valid_req.custom_runtime_hours == 12.0

    # Invalid runtime (> 24 hours)
    with pytest.raises(ValidationError):
        WhatIfRequest(custom_runtime_hours=30.0)

    # Invalid downsize percentage (< 0%)
    with pytest.raises(ValidationError):
        WhatIfRequest(custom_downsize_pct=-10.0)

    # Invalid storage percentage (> 100%)
    with pytest.raises(ValidationError):
        WhatIfRequest(custom_storage_archival_pct=150.0)

