import pandas as pd
from typing import Dict, Any, List
from src.utils.logger import get_logger

logger = get_logger("CounterfactualSimulator")

class CounterfactualSimulator:
    @staticmethod
    def calculate_resource_savings(
        daily_cost: float,
        category: str,
        runtime_hours: float = 24.0,
        target_runtime_hours: float = 10.0,
        downsize_discount_pct: float = 40.0,
        storage_archival_discount_pct: float = 65.0
    ) -> Dict[str, Any]:
        """
        Calculates counterfactual cost and estimated avoidable savings.
        """
        current_daily = max(0.0, float(daily_cost))
        current_monthly = current_daily * 30.0
        
        counterfactual_daily = current_daily
        scenario_description = ""
        
        if category == "Idle Resource":
            # Scenario: Turn off outside 10h work day
            if runtime_hours > 0:
                fraction = target_runtime_hours / runtime_hours
                counterfactual_daily = current_daily * fraction
                scenario_description = f"Schedule instance runtime from {runtime_hours:.0f}h to {target_runtime_hours:.0f}h/day (off-hours shutdown)."
            else:
                counterfactual_daily = current_daily * 0.4
                scenario_description = "Schedule 10h/day operating hours."

        elif category == "Over-provisioning":
            # Scenario: Downsize instance family
            counterfactual_daily = current_daily * (1.0 - (downsize_discount_pct / 100.0))
            scenario_description = f"Right-size instance to smaller family (estimated {downsize_discount_pct:.0f}% cost reduction)."

        elif category == "Non-production Waste":
            # Scenario: Business-hours-only schedule (5 days/wk x 10h = 50h/wk out of 168h total = ~30% runtime)
            counterfactual_daily = current_daily * (50.0 / 168.0)
            scenario_description = "Enforce 50h/week business-hours schedule (shut down nights & weekends)."

        elif category == "Abnormal Storage Growth":
            # Scenario: Transition to S3 Glacier or delete unattached volumes
            counterfactual_daily = current_daily * (1.0 - (storage_archival_discount_pct / 100.0))
            scenario_description = f"Apply S3 Glacier archival rules or prune obsolete snapshots ({storage_archival_discount_pct:.0f}% reduction)."

        elif category == "Cost Spike":
            # Scenario: Revert to baseline
            counterfactual_daily = current_daily * 0.25 # Assume 75% spike reduction
            scenario_description = "Revert instance configuration or throttle runaway execution loops."

        else:
            # Default / Legitimate growth
            counterfactual_daily = current_daily
            scenario_description = "No structural waste reduction applied."

        counterfactual_daily = max(0.0, counterfactual_daily)
        avoidable_daily = max(0.0, current_daily - counterfactual_daily)
        avoidable_monthly = avoidable_daily * 30.0
        pct_savings = ((avoidable_daily / current_daily) * 100.0) if current_daily > 0 else 0.0

        return {
            "current_daily_cost": round(current_daily, 2),
            "current_monthly_cost": round(current_monthly, 2),
            "counterfactual_daily_cost": round(counterfactual_daily, 2),
            "counterfactual_monthly_cost": round(counterfactual_daily * 30.0, 2),
            "potential_avoidable_daily": round(avoidable_daily, 2),
            "potential_avoidable_monthly": round(avoidable_monthly, 2),
            "percentage_savings": round(pct_savings, 1),
            "scenario_description": scenario_description,
            "disclaimer": "ESTIMATE ONLY. Actual savings depend on AWS pricing models, reserved instances, and runtime conditions."
        }

    @staticmethod
    def simulate_what_if_scenario(
        df_waste: pd.DataFrame,
        custom_runtime_hours: float = 10.0,
        custom_downsize_pct: float = 40.0,
        custom_storage_archival_pct: float = 65.0
    ) -> Dict[str, Any]:
        """
        Aggregates what-if savings across all identified waste cases.
        """
        total_current_monthly = 0.0
        total_avoidable_monthly = 0.0
        resource_results = []

        for _, row in df_waste.iterrows():
            res_id = row["resource_id"]
            cat = row["category"]
            daily_c = float(row.get("daily_cost", 0.0))
            runtime_h = float(row.get("runtime_hours", 24.0))

            res_sim = CounterfactualSimulator.calculate_resource_savings(
                daily_cost=daily_c,
                category=cat,
                runtime_hours=runtime_h,
                target_runtime_hours=custom_runtime_hours,
                downsize_discount_pct=custom_downsize_pct,
                storage_archival_discount_pct=custom_storage_archival_pct
            )

            total_current_monthly += res_sim["current_monthly_cost"]
            total_avoidable_monthly += res_sim["potential_avoidable_monthly"]

            res_sim["resource_id"] = res_id
            res_sim["category"] = cat
            resource_results.append(res_sim)

        overall_pct = ((total_avoidable_monthly / total_current_monthly) * 100.0) if total_current_monthly > 0 else 0.0

        return {
            "total_current_monthly_cost": round(total_current_monthly, 2),
            "total_counterfactual_monthly_cost": round(total_current_monthly - total_avoidable_monthly, 2),
            "total_potential_avoidable_monthly": round(total_avoidable_monthly, 2),
            "overall_percentage_savings": round(overall_pct, 1),
            "resources": resource_results
        }
