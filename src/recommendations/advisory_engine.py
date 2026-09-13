import pandas as pd
from typing import List, Dict, Any
from src.utils.logger import get_logger
from src.utils.config_loader import load_json

logger = get_logger("AdvisoryEngine")

class AdvisoryEngine:
    def __init__(self, knowledge_dir: str = "knowledge"):
        try:
            self.rec_rules = load_json(f"{knowledge_dir}/recommendation_rules.json")
            self.safety_rules = load_json(f"{knowledge_dir}/safety_rules.json")
        except Exception:
            self.rec_rules = {}
            self.safety_rules = {}

    def generate_recommendation(
        self,
        resource_id: str,
        category: str,
        confidence_score: int,
        daily_cost: float,
        avoidable_daily: float,
        environment: str,
        evidence: List[str]
    ) -> Dict[str, Any]:
        """
        Generates advisory recommendation payload for a resource.
        """
        env_upper = environment.upper()
        
        # Risk level determination
        if env_upper in ["DEV", "TEST", "STAGING", "SANDBOX"]:
            risk_level = "Low"
        elif category in ["Idle Resource", "Non-production Waste"]:
            risk_level = "Low"
        elif category == "Over-provisioning":
            risk_level = "Medium"
        else:
            risk_level = "High"

        # Actionable recommendations from knowledge base
        kb_actions = self.rec_rules.get(category, [
            "Investigate resource activity and evaluate right-sizing or scheduling options."
        ])

        primary_recommendation = kb_actions[0] if kb_actions else "Investigate resource spend."
        
        avoidable_monthly = avoidable_daily * 30.0

        return {
            "resource_id": resource_id,
            "category": category,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "advisory_notice": "ADVISORY ONLY. No infrastructure modification is performed automatically.",
            "primary_recommendation": primary_recommendation,
            "suggested_actions": kb_actions,
            "estimated_monthly_savings": round(avoidable_monthly, 2),
            "evidence": evidence,
            "safety_guideline": "Verify application health metrics in CloudWatch prior to enacting changes."
        }
