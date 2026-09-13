import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any
from src.utils.logger import get_logger

logger = get_logger("DataCleaner")

class DataCleaner:
    @staticmethod
    def clean_cost_data(df: pd.DataFrame) -> pd.DataFrame:
        df_clean = df.copy()
        initial_count = len(df_clean)
        
        # 1. Deduplication
        df_clean.drop_duplicates(inplace=True)
        dedup_count = len(df_clean)
        if initial_count - dedup_count > 0:
            logger.info(f"Removed {initial_count - dedup_count} duplicate cost records.")
            
        # 2. Timestamp alignment
        df_clean["timestamp"] = pd.to_datetime(df_clean["timestamp"], utc=True)
        df_clean.sort_values(by=["resource_id", "timestamp"], inplace=True)
        
        # 3. Numeric cost cleanup
        df_clean["cost"] = pd.to_numeric(df_clean["cost"], errors="coerce").fillna(0.0)
        df_clean["cost"] = df_clean["cost"].clip(lower=0.0) # Cost cannot be negative
        
        # 4. Usage quantity cleanup
        if "usage_quantity" in df_clean.columns:
            df_clean["usage_quantity"] = pd.to_numeric(df_clean["usage_quantity"], errors="coerce").fillna(0.0)
            
        # 5. Fill missing categorical fields
        for cat_col in ["environment", "application", "region", "service", "resource_type"]:
            if cat_col in df_clean.columns:
                df_clean[cat_col] = df_clean[cat_col].fillna("Unknown")
                
        logger.info(f"Successfully cleaned cost dataset. Active rows: {len(df_clean)}")
        return df_clean

    @staticmethod
    def clean_metrics_data(df: pd.DataFrame) -> pd.DataFrame:
        df_clean = df.copy()
        initial_count = len(df_clean)
        
        df_clean.drop_duplicates(inplace=True)
        df_clean["timestamp"] = pd.to_datetime(df_clean["timestamp"], utc=True)
        df_clean.sort_values(by=["resource_id", "timestamp"], inplace=True)
        
        # Handle CPU & Memory percentage bounds (0 - 100)
        for col in ["cpu_utilization", "memory_utilization"]:
            if col in df_clean.columns:
                df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce").fillna(0.0)
                df_clean[col] = df_clean[col].clip(0.0, 100.0)
                
        # Fill missing network/disk IO metrics
        for num_col in ["network_in", "network_out", "disk_read", "disk_write", "storage_gb", "request_count", "runtime_hours"]:
            if num_col in df_clean.columns:
                df_clean[num_col] = pd.to_numeric(df_clean[num_col], errors="coerce").fillna(0.0)
                df_clean[num_col] = df_clean[num_col].clip(lower=0.0)
                
        logger.info(f"Successfully cleaned metrics dataset. Active rows: {len(df_clean)}")
        return df_clean

    @staticmethod
    def clean_events_data(df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df
        df_clean = df.copy()
        df_clean.drop_duplicates(inplace=True)
        if "event_timestamp" in df_clean.columns:
            df_clean["event_timestamp"] = pd.to_datetime(df_clean["event_timestamp"], utc=True)
            df_clean.sort_values(by="event_timestamp", inplace=True)
        return df_clean
