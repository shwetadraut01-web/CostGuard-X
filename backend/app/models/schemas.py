from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WhatIfRequest(BaseModel):
    custom_runtime_hours: Optional[float] = Field(default=10.0, ge=0.0, le=24.0, description="Runtime hours per day (0 to 24)")
    custom_downsize_pct: Optional[float] = Field(default=40.0, ge=0.0, le=100.0, description="Downsize percentage (0 to 100)")
    custom_storage_archival_pct: Optional[float] = Field(default=65.0, ge=0.0, le=100.0, description="Storage archival percentage (0 to 100)")

class ExplainRequest(BaseModel):
    resource_id: str = Field(..., min_length=1, max_length=128)
    category: str = Field(..., min_length=1, max_length=100)
    service: str = Field(..., min_length=1, max_length=100)
    environment: str = Field(..., min_length=1, max_length=100)
    current_daily_cost: float = Field(..., ge=0.0)
    confidence_score: int = Field(..., ge=0, le=100)
    estimated_monthly_savings: float = Field(..., ge=0.0)
    evidence: List[str] = Field(default_factory=list)

