import pytest
from src.counterfactual.simulator import CounterfactualSimulator

def test_counterfactual_idle_savings():
    res = CounterfactualSimulator.calculate_resource_savings(
        daily_cost=10.0,
        category="Idle Resource",
        runtime_hours=24.0,
        target_runtime_hours=10.0
    )
    assert res["current_daily_cost"] == 10.0
    assert res["counterfactual_daily_cost"] == 4.17 # 10h/24h * 10
    assert res["potential_avoidable_daily"] == 5.83
    assert res["percentage_savings"] == 58.3
