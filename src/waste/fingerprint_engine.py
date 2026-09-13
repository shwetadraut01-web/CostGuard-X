import pandas as pd
import numpy as np
from typing import List, Dict, Any
from src.utils.logger import get_logger
from src.utils.config_loader import load_waste_rules

logger = get_logger("WasteFingerprintEngine")

class WasteFingerprintEngine:
    def __init__(self, config_dir: str = "config"):
        self.rules_cfg = load_waste_rules(config_dir).get("rules", [])

    def analyze_resource_waste(self, df_features: pd.DataFrame, df_anomalies: pd.DataFrame = None) -> pd.DataFrame:
        logger.info("Evaluating rule-based waste fingerprints...")
        waste_cases = []
        
        # Analyze grouped per resource over recent period
        for rid, group in df_features.groupby("resource_id"):
            g = group.copy().sort_values(by="timestamp")
            recent = g.tail(7) # Focus on recent 7 days
            
            avg_cpu = float(recent["cpu_utilization"].mean()) if "cpu_utilization" in recent.columns else 0.0
            avg_mem = float(recent["memory_utilization"].mean()) if "memory_utilization" in recent.columns else 0.0
            avg_runtime = float(recent["runtime_hours"].mean()) if "runtime_hours" in recent.columns else 24.0
            recent_daily_cost = float(recent["cost"].mean())
            storage_growth = float(recent["storage_growth_pct"].mean()) if "storage_growth_pct" in recent.columns else 0.0
            request_growth = float(recent["request_growth_pct"].mean()) if "request_growth_pct" in recent.columns else 0.0
            pct_change = float(recent["cost_pct_change"].mean()) if "cost_pct_change" in recent.columns else 0.0
            
            srv = recent["service"].iloc[-1] if "service" in recent.columns else "Unknown"
            env = str(recent["environment"].iloc[-1]).lower() if "environment" in recent.columns else "unknown"
            inst_type = recent["resource_type"].iloc[-1] if "resource_type" in recent.columns else "Unknown"
            app_name = recent["application"].iloc[-1] if "application" in recent.columns else "Unknown"
            
            matched_rule = None
            category = None
            is_waste = True
            evidence = []
            
            # 1. Rule: Idle Resource
            if avg_cpu < 10.0 and avg_runtime >= 18.0 and recent_daily_cost >= 1.0:
                matched_rule = "RULE_IDLE_01"
                category = "Idle Resource"
                is_waste = True
                evidence.append(f"Average CPU utilization remained at {avg_cpu:.1f}% (< 10%).")
                evidence.append(f"Resource operated continuously for {avg_runtime:.1f} hours/day.")
                evidence.append(f"Generated average daily spend of ${recent_daily_cost:.2f}/day.")

            # 2. Rule: Over-provisioning
            elif avg_cpu < 20.0 and avg_mem < 25.0 and recent_daily_cost >= 5.0 and ("large" in inst_type.lower() or "xlarge" in inst_type.lower()):
                matched_rule = "RULE_OVERPROV_01"
                category = "Over-provisioning"
                is_waste = True
                evidence.append(f"Instance size '{inst_type}' is high-capacity but utilization is low.")
                evidence.append(f"CPU average is {avg_cpu:.1f}% and Memory average is {avg_mem:.1f}%.")
                evidence.append(f"Daily cost of ${recent_daily_cost:.2f} is substantial for low load.")

            # 3. Rule: Non-production Waste
            elif env in ["dev", "development", "test", "staging"] and avg_runtime >= 20.0 and avg_cpu < 15.0:
                matched_rule = "RULE_NONPROD_01"
                category = "Non-production Waste"
                is_waste = True
                evidence.append(f"Environment is '{env.upper()}' but resource runs 24/7 ({avg_runtime:.1f} hrs/day).")
                evidence.append(f"CPU utilization averaged only {avg_cpu:.1f}%.")
                evidence.append(f"Unnecessary continuous weekend and off-hours runtime detected.")

            # 4. Rule: Abnormal Storage Growth
            elif storage_growth > 15.0 and request_growth < 5.0 and recent_daily_cost >= 2.0:
                matched_rule = "RULE_STORAGE_01"
                category = "Abnormal Storage Growth"
                is_waste = True
                evidence.append(f"Storage capacity grew rapidly by +{storage_growth:.1f}%/day.")
                evidence.append(f"User request activity grew by only +{request_growth:.1f}%.")
                evidence.append(f"Disproportionate storage growth driving costs up to ${recent_daily_cost:.2f}/day.")

            # 5. Rule: Legitimate Growth
            elif pct_change >= 20.0 and request_growth >= 20.0 and avg_cpu >= 40.0:
                matched_rule = "RULE_LEGIT_01"
                category = "Legitimate Growth"
                is_waste = False
                evidence.append(f"Cost increased by +{pct_change:.1f}%, but request volume grew by +{request_growth:.1f}%.")
                evidence.append(f"CPU load is healthy at {avg_cpu:.1f}%.")
                evidence.append(f"Spend growth directly supports active application usage growth.")

            # 6. Rule: Sudden Cost Spike
            elif pct_change >= 50.0 and recent_daily_cost >= 10.0:
                matched_rule = "RULE_SPIKE_01"
                category = "Cost Spike"
                is_waste = True
                evidence.append(f"Sudden daily cost increase of +{pct_change:.1f}%.")
                evidence.append(f"Cost jumped to ${recent_daily_cost:.2f}/day without matching CPU/request growth.")

            if category is not None:
                waste_cases.append({
                    "resource_id": rid,
                    "service": srv,
                    "instance_type": inst_type,
                    "environment": env.upper(),
                    "application": app_name,
                    "category": category,
                    "rule_id": matched_rule,
                    "is_waste": is_waste,
                    "daily_cost": round(recent_daily_cost, 2),
                    "cpu_utilization": round(avg_cpu, 1),
                    "memory_utilization": round(avg_mem, 1),
                    "runtime_hours": round(avg_runtime, 1),
                    "evidence": evidence
                })

        df_waste = pd.DataFrame(waste_cases)
        logger.info(f"Waste Fingerprinting analysis complete. Categorized {len(df_waste)} cases.")
        return df_waste
