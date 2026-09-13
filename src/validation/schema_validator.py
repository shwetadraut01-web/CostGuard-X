import pandas as pd
from typing import List, Tuple, Dict, Any
from src.utils.logger import get_logger

logger = get_logger("SchemaValidator")

REQUIRED_COST_COLUMNS = [
    "timestamp", "account_id", "region", "service", 
    "resource_id", "resource_type", "cost", "currency"
]

REQUIRED_METRIC_COLUMNS = [
    "timestamp", "resource_id", "cpu_utilization", "memory_utilization"
]

class SchemaValidator:
    @staticmethod
    def validate_cost_schema(df: pd.DataFrame) -> Tuple[bool, List[str]]:
        errors = []
        missing_cols = [col for col in REQUIRED_COST_COLUMNS if col not in df.columns]
        if missing_cols:
            errors.append(f"Missing required cost columns: {missing_cols}")
        
        if "cost" in df.columns:
            if not pd.api.types.is_numeric_dtype(df["cost"]):
                errors.append("'cost' column must be numeric")
            elif (df["cost"] < 0).any():
                logger.warning("Detected negative cost values. Will require cleaning.")
                
        is_valid = len(errors) == 0
        return is_valid, errors

    @staticmethod
    def validate_metrics_schema(df: pd.DataFrame) -> Tuple[bool, List[str]]:
        errors = []
        missing_cols = [col for col in REQUIRED_METRIC_COLUMNS if col not in df.columns]
        if missing_cols:
            errors.append(f"Missing required metric columns: {missing_cols}")
            
        for col in ["cpu_utilization", "memory_utilization"]:
            if col in df.columns:
                if not pd.api.types.is_numeric_dtype(df[col]):
                    errors.append(f"'{col}' column must be numeric")
                elif (df[col] < 0).any() or (df[col] > 100).any():
                    logger.warning(f"'{col}' contains values outside 0-100% range.")
                    
        is_valid = len(errors) == 0
        return is_valid, errors
