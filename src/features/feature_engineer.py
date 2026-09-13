import pandas as pd
import numpy as np
from src.utils.logger import get_logger

logger = get_logger("FeatureEngineer")

class FeatureEngineer:
    @staticmethod
    def engineer_features(df_cost: pd.DataFrame, df_metrics: pd.DataFrame, window_days: int = 7) -> pd.DataFrame:
        logger.info("Starting feature engineering pipeline...")
        
        # Merge cost and metrics on resource_id and timestamp date
        df_merged = pd.merge(
            df_cost, 
            df_metrics, 
            on=["resource_id", "timestamp"], 
            how="left",
            suffixes=("", "_metric")
        )
        
        df_merged.sort_values(by=["resource_id", "timestamp"], inplace=True)
        
        feature_dfs = []
        
        for rid, group in df_merged.groupby("resource_id"):
            g = group.copy()
            
            # 1. Cost rolling metrics
            g["cost_rolling_avg_7d"] = g["cost"].rolling(window=window_days, min_periods=1).mean()
            g["cost_rolling_std_7d"] = g["cost"].rolling(window=window_days, min_periods=1).std().fillna(0.0)
            g["cost_pct_change"] = g["cost"].pct_change().fillna(0.0) * 100.0
            
            # 2. Utilization rolling metrics
            if "cpu_utilization" in g.columns:
                g["cpu_rolling_avg_7d"] = g["cpu_utilization"].rolling(window=window_days, min_periods=1).mean()
                g["cpu_max_7d"] = g["cpu_utilization"].rolling(window=window_days, min_periods=1).max()
            else:
                g["cpu_rolling_avg_7d"] = 0.0
                g["cpu_max_7d"] = 0.0
                
            if "memory_utilization" in g.columns:
                g["memory_rolling_avg_7d"] = g["memory_utilization"].rolling(window=window_days, min_periods=1).mean()
            else:
                g["memory_rolling_avg_7d"] = 0.0

            # 3. Storage & Request Growth
            if "storage_gb" in g.columns:
                g["storage_growth_pct"] = g["storage_gb"].pct_change().fillna(0.0) * 100.0
            else:
                g["storage_growth_pct"] = 0.0
                
            if "request_count" in g.columns:
                g["request_growth_pct"] = g["request_count"].pct_change().fillna(0.0) * 100.0
            else:
                g["request_growth_pct"] = 0.0
                
            # 4. Cost-to-Usage Ratio
            if "usage_quantity" in g.columns:
                g["cost_per_usage_unit"] = np.where(g["usage_quantity"] > 0, g["cost"] / g["usage_quantity"], 0.0)
            else:
                g["cost_per_usage_unit"] = 0.0

            # 5. Continuous Runtime Ratio
            if "runtime_hours" in g.columns:
                g["runtime_ratio"] = (g["runtime_hours"] / 24.0).clip(0.0, 1.0)
            else:
                g["runtime_ratio"] = 1.0

            feature_dfs.append(g)

        result_df = pd.concat(feature_dfs, ignore_index=True)
        logger.info(f"Feature engineering completed. Columns added. Total rows: {len(result_df)}")
        return result_df
