from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WhatIfRequest(BaseModel):
    custom_runtime_hours: Optional[float] = 10.0
    custom_downsize_pct: Optional[float] = 40.0
    custom_storage_archival_pct: Optional[float] = 65.0

class ExplainRequest(BaseModel):
    resource_id: str
    category: str
    service: str
    environment: str
    current_daily_cost: float
    confidence_score: int
    estimated_monthly_savings: float
    evidence: List[str]
