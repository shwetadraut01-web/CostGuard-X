import pytest
from src.confidence.score_matrix import ScoreMatrixEngine

def test_confidence_score_high_waste():
    res = ScoreMatrixEngine.calculate_confidence_score(
        category="Idle Resource",
        cpu_utilization=3.0,
        runtime_hours=24.0,
        environment="DEV",
        has_temporal_event=True
    )
    assert res["score"] >= 80
    assert res["confidence_level"] == "High"
    assert len(res["positive_factors"]) >= 3
