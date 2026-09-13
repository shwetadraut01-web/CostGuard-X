import pandas as pd
import numpy as np
from typing import Dict, Any, List
from src.utils.logger import get_logger

logger = get_logger("CostAnalytics")

class CostAnalytics:
    def __init__(self, df_merged: pd.DataFrame):
        self.df = df_merged

    def get_summary_kpis(self) -> Dict[str, Any]:
        total_cost = float(self.df["cost"].sum())
        total_resources = int(self.df["resource_id"].nunique())
        services_count = int(self.df["service"].nunique())
        
        # Calculate recent 7-day cost change vs previous 7-day cost
        dates = sorted(self.df["timestamp"].unique())
        if len(dates) >= 14:
            recent_7d = dates[-7:]
            prev_7d = dates[-14:-7]
            cost_recent = float(self.df[self.df["timestamp"].isin(recent_7d)]["cost"].sum())
            cost_prev = float(self.df[self.df["timestamp"].isin(prev_7d)]["cost"].sum())
            pct_change = ((cost_recent - cost_prev) / cost_prev * 100.0) if cost_prev > 0 else 0.0
        else:
            cost_recent = total_cost
            pct_change = 0.0

        return {
            "total_spend": round(total_cost, 2),
            "recent_7d_spend": round(cost_recent, 2),
            "spend_pct_change_7d": round(pct_change, 2),
            "total_resources": total_resources,
            "total_services": services_count
        }

    def get_cost_by_service(self) -> List[Dict[str, Any]]:
        grp = self.df.groupby("service")["cost"].sum().reset_index()
        total = grp["cost"].sum()
        grp["percentage"] = np.where(total > 0, (grp["cost"] / total) * 100.0, 0.0)
        grp.sort_values(by="cost", ascending=False, inplace=True)
        return [
            {"service": row["service"], "cost": round(row["cost"], 2), "percentage": round(row["percentage"], 2)}
            for _, row in grp.iterrows()
        ]

    def get_cost_by_environment(self) -> List[Dict[str, Any]]:
        grp = self.df.groupby("environment")["cost"].sum().reset_index()
        total = grp["cost"].sum()
        grp["percentage"] = np.where(total > 0, (grp["cost"] / total) * 100.0, 0.0)
        grp.sort_values(by="cost", ascending=False, inplace=True)
        return [
            {"environment": row["environment"], "cost": round(row["cost"], 2), "percentage": round(row["percentage"], 2)}
            for _, row in grp.iterrows()
        ]

    def get_cost_by_region(self) -> List[Dict[str, Any]]:
        grp = self.df.groupby("region")["cost"].sum().reset_index()
        total = grp["cost"].sum()
        grp["percentage"] = np.where(total > 0, (grp["cost"] / total) * 100.0, 0.0)
        return [
            {"region": row["region"], "cost": round(row["cost"], 2), "percentage": round(row["percentage"], 2)}
            for _, row in grp.iterrows()
        ]

    def get_daily_cost_trends(self) -> List[Dict[str, Any]]:
        # Group by date string YYYY-MM-DD
        df_temp = self.df.copy()
        df_temp["date_str"] = df_temp["timestamp"].dt.strftime("%Y-%m-%d")
        grp = df_temp.groupby("date_str")["cost"].sum().reset_index()
        grp.sort_values(by="date_str", inplace=True)
        return [
            {"date": row["date_str"], "cost": round(row["cost"], 2)}
            for _, row in grp.iterrows()
        ]

    def get_resource_spend_breakdown(self) -> List[Dict[str, Any]]:
        grp = self.df.groupby(["resource_id", "service", "environment"])["cost"].sum().reset_index()
        grp.sort_values(by="cost", ascending=False, inplace=True)
        return [
            {
                "resource_id": row["resource_id"],
                "service": row["service"],
                "environment": row["environment"],
                "cost": round(row["cost"], 2)
            }
            for _, row in grp.iterrows()
        ]

    def get_utilization_correlations(self) -> Dict[str, float]:
        numeric_cols = ["cost", "cpu_utilization", "memory_utilization", "request_count", "storage_gb"]
        avail_cols = [c for c in numeric_cols if c in self.df.columns]
        if len(avail_cols) < 2:
            return {}
        
        corr_matrix = self.df[avail_cols].corr()
        res = {}
        if "cost" in corr_matrix:
            for col in avail_cols:
                if col != "cost":
                    val = corr_matrix.loc["cost", col]
                    res[f"cost_vs_{col}"] = round(float(val), 4) if not np.isnan(val) else 0.0
        return res
