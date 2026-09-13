import pandas as pd
from typing import Dict, Any, List
from src.utils.logger import get_logger

logger = get_logger("ScoreMatrixEngine")

class ScoreMatrixEngine:
    @staticmethod
    def calculate_confidence_score(
        category: str,
        cpu_utilization: float,
        runtime_hours: float,
        environment: str,
        cost_deviation_pct: float = 0.0,
        has_temporal_event: bool = False,
        request_growth_pct: float = 0.0
    ) -> Dict[str, Any]:
        """
        Calculates explainable 0-100 waste confidence score with positive & negative factors.
        """
        base_score = 50.0
        reasons_positive = []
        reasons_negative = []
        
        env_upper = environment.upper()
        
        # 1. Utilization evidence
        if cpu_utilization < 5.0:
            score_delta = 25.0
            reasons_positive.append(f"+25: Critical low CPU utilization ({cpu_utilization:.1f}% < 5%)")
        elif cpu_utilization < 15.0:
            score_delta = 18.0
            reasons_positive.append(f"+18: Low CPU utilization ({cpu_utilization:.1f}% < 15%)")
        elif cpu_utilization > 40.0:
            score_delta = -35.0
            reasons_negative.append(f"-35: High CPU load ({cpu_utilization:.1f}% >= 40%) suggests active usage")
        else:
            score_delta = 5.0
            reasons_positive.append(f"+5: Moderate CPU utilization ({cpu_utilization:.1f}%)")
        base_score += score_delta

        # 2. Continuous runtime evidence
        if runtime_hours >= 22.0:
            score_delta = 20.0
            reasons_positive.append(f"+20: Continuous 24/7 runtime ({runtime_hours:.1f} hrs/day)")
        elif runtime_hours >= 16.0:
            score_delta = 10.0
            reasons_positive.append(f"+10: Long daily runtime ({runtime_hours:.1f} hrs/day)")
        base_score += score_delta

        # 3. Environment factor
        if env_upper in ["DEV", "DEVELOPMENT", "TEST", "TESTING", "STAGING", "SANDBOX"]:
            score_delta = 15.0
            reasons_positive.append(f"+15: Non-production environment ({env_upper}) has lower business impact risk")
        else:
            score_delta = -5.0
            reasons_negative.append(f"-5: Production environment ({env_upper}) requires conservative review")
        base_score += score_delta

        # 4. Temporal event correlation factor
        if has_temporal_event:
            score_delta = 12.0
            reasons_positive.append("+12: Associated infrastructure event log correlates with cost change")
        base_score += score_delta

        # 5. Legitimate traffic growth counter-evidence
        if request_growth_pct >= 20.0:
            score_delta = -45.0
            reasons_negative.append(f"-45: Proportional user request growth (+{request_growth_pct:.1f}%) indicates legitimate business growth")
            base_score += score_delta

        # Final score bounding
        final_score = max(0, min(100, int(round(base_score))))
        
        if final_score >= 80:
            confidence_level = "High"
        elif final_score >= 50:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"

        return {
            "score": final_score,
            "confidence_level": confidence_level,
            "positive_factors": reasons_positive,
            "negative_factors": reasons_negative
        }
