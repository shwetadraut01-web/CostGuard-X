import pandas as pd
import numpy as np
from typing import Dict, Any, List
from src.utils.logger import get_logger

logger = get_logger("CostAttributor")

class CostAttributor:
    @staticmethod
    def attribute_cost_drivers(df_cost: pd.DataFrame) -> Dict[str, Any]:
        logger.info("Computing cost attribution and driver analysis...")
        total_spend = float(df_cost["cost"].sum())
        
        # 1. Top Resource Drivers
        res_grp = df_cost.groupby(["resource_id", "service", "environment", "application"])["cost"].sum().reset_index()
        res_grp["contribution_pct"] = np.where(total_spend > 0, (res_grp["cost"] / total_spend) * 100.0, 0.0)
        res_grp.sort_values(by="cost", ascending=False, inplace=True)
        
        top_resources = [
            {
                "resource_id": r["resource_id"],
                "service": r["service"],
                "environment": r["environment"],
                "application": r["application"],
                "cost": round(r["cost"], 2),
                "contribution_pct": round(r["contribution_pct"], 2)
            }
            for _, r in res_grp.head(10).iterrows()
        ]
        
        # 2. Top Service Drivers
        srv_grp = df_cost.groupby("service")["cost"].sum().reset_index()
        srv_grp["contribution_pct"] = np.where(total_spend > 0, (srv_grp["cost"] / total_spend) * 100.0, 0.0)
        srv_grp.sort_values(by="cost", ascending=False, inplace=True)
        
        top_services = [
            {
                "service": r["service"],
                "cost": round(r["cost"], 2),
                "contribution_pct": round(r["contribution_pct"], 2)
            }
            for _, r in srv_grp.iterrows()
        ]

        # 3. Top Environment Drivers
        env_grp = df_cost.groupby("environment")["cost"].sum().reset_index()
        env_grp["contribution_pct"] = np.where(total_spend > 0, (env_grp["cost"] / total_spend) * 100.0, 0.0)
        env_grp.sort_values(by="cost", ascending=False, inplace=True)
        
        top_environments = [
            {
                "environment": r["environment"],
                "cost": round(r["cost"], 2),
                "contribution_pct": round(r["contribution_pct"], 2)
            }
            for _, r in env_grp.iterrows()
        ]

        return {
            "total_spend": round(total_spend, 2),
            "top_resources": top_resources,
            "top_services": top_services,
            "top_environments": top_environments
        }
