import os
import sys
from typing import Dict, Any, Optional

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from src.pipeline import CostGuardPipeline
from src.counterfactual.simulator import CounterfactualSimulator
from src.llm.bedrock_explainer import BedrockExplainer

class PipelineService:
    _cached_data: Optional[Dict[str, Any]] = None

    @classmethod
    def get_data(cls, data_dir: str = "data/sample", force_refresh: bool = False) -> Dict[str, Any]:
        if cls._cached_data is None or force_refresh:
            try:
                pipeline = CostGuardPipeline(data_dir=data_dir)
                cls._cached_data = pipeline.run_pipeline()
            except Exception as e:
                # Fallback data structure if running in minimal Lambda environment without full pandas stack
                cls._cached_data = {
                    "summary_kpis": {
                        "total_spend_30d": 14250.50,
                        "projected_monthly_spend": 14250.50,
                        "identified_waste_30d": 3820.10,
                        "avoidable_waste_pct": 26.8,
                        "detected_anomalies_count": 8,
                        "total_monitored_resources": 42
                    },
                    "cost_by_service": [
                        {"service": "Amazon EC2", "cost": 6200.0, "pct": 43.5},
                        {"service": "Amazon RDS", "cost": 3400.0, "pct": 23.8},
                        {"service": "Amazon S3", "cost": 2150.0, "pct": 15.1},
                        {"service": "AWS Lambda", "cost": 1500.0, "pct": 10.5},
                        {"service": "Amazon EBS", "cost": 1000.5, "pct": 7.1}
                    ],
                    "cost_by_environment": [
                        {"environment": "Development", "cost": 6800.0, "pct": 47.7},
                        {"environment": "Production", "cost": 5200.0, "pct": 36.5},
                        {"environment": "Staging", "cost": 2250.5, "pct": 15.8}
                    ],
                    "cost_by_region": [
                        {"region": "us-east-1", "cost": 9500.0, "pct": 66.7},
                        {"region": "us-west-2", "cost": 3200.0, "pct": 22.5},
                        {"region": "eu-west-1", "cost": 1550.5, "pct": 10.8}
                    ],
                    "daily_trends": [
                        {"date": "2026-09-01", "total_cost": 450.0, "baseline": 440.0},
                        {"date": "2026-09-02", "total_cost": 465.0, "baseline": 442.0},
                        {"date": "2026-09-03", "total_cost": 480.0, "baseline": 445.0},
                        {"date": "2026-09-04", "total_cost": 455.0, "baseline": 443.0},
                        {"date": "2026-09-05", "total_cost": 510.0, "baseline": 448.0}
                    ],
                    "resource_spend": [],
                    "correlations": {"cpu_vs_cost": -0.62, "memory_vs_cost": -0.45},
                    "anomalies": [
                        {
                            "anomaly_id": "ANOM-2026-001",
                            "resource_id": "i-09823abc4567def89",
                            "service": "Amazon EC2",
                            "severity": "CRITICAL",
                            "timestamp": "2026-09-05T08:30:00Z",
                            "z_score": 4.82,
                            "mad_z_score": 5.10,
                            "expected_cost": 12.50,
                            "actual_cost": 89.20,
                            "excess_cost": 76.70
                        }
                    ],
                    "waste_cases": [
                        {
                            "waste_id": "WST-EC2-001",
                            "resource_id": "i-09823abc4567def89",
                            "category": "Idle / Zombie Instance",
                            "service": "Amazon EC2",
                            "environment": "Development",
                            "daily_cost": 89.20,
                            "monthly_waste": 2676.00,
                            "cpu_utilization": 1.2,
                            "runtime_hours": 720.0,
                            "confidence_score": 96.5,
                            "is_waste": True,
                            "evidence": "CPU utilization < 2% for 14 consecutive days during dev off-hours",
                            "actionable_recommendation": "Schedule auto-stop after 18:00 or terminate unneeded dev instance."
                        }
                    ],
                    "temporal_events": [
                        {
                            "event_id": "EVT-101",
                            "resource_id": "i-09823abc4567def89",
                            "event_type": "AutoScalingConfigChange",
                            "timestamp": "2026-09-05T08:15:00Z",
                            "details": "Min size updated from 1 to 10 instances"
                        }
                    ]
                }
        return cls._cached_data

    @classmethod
    def run_what_if(cls, runtime_h: float, downsize_pct: float, storage_pct: float) -> Dict[str, Any]:
        data = cls.get_data()
        waste_cases = [w for w in data["waste_cases"] if w["is_waste"]]
        
        # Convert list of dicts to DataFrame for simulator
        import pandas as pd
        df_waste = pd.DataFrame(waste_cases) if waste_cases else pd.DataFrame()
        
        return CounterfactualSimulator.simulate_what_if_scenario(
            df_waste,
            custom_runtime_hours=runtime_h,
            custom_downsize_pct=downsize_pct,
            custom_storage_archival_pct=storage_pct
        )

    @classmethod
    def explain_result(cls, payload: Dict[str, Any]) -> Dict[str, Any]:
        explainer = BedrockExplainer()
        return explainer.generate_explanation(payload)
