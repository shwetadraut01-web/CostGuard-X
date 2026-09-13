import os
import pandas as pd
from typing import Dict, Optional
from src.utils.logger import get_logger

logger = get_logger("DataLoader")

class DataLoader:
    def __init__(self, data_dir: str = "data/sample"):
        self.data_dir = data_dir

    def load_cost_data(self, filename: Optional[str] = None) -> pd.DataFrame:
        path_parquet = os.path.join(self.data_dir, "aws_cost_usage.parquet")
        path_csv = os.path.join(self.data_dir, filename or "aws_cost_usage.csv")
        
        if os.path.exists(path_parquet):
            logger.info(f"Loading cost data from Parquet: {path_parquet}")
            return pd.read_parquet(path_parquet)
        elif os.path.exists(path_csv):
            logger.info(f"Loading cost data from CSV: {path_csv}")
            return pd.read_csv(path_csv)
        else:
            raise FileNotFoundError(f"No cost data found at {path_csv} or {path_parquet}")

    def load_metrics_data(self, filename: Optional[str] = None) -> pd.DataFrame:
        path_parquet = os.path.join(self.data_dir, "resource_metrics.parquet")
        path_csv = os.path.join(self.data_dir, filename or "resource_metrics.csv")
        
        if os.path.exists(path_parquet):
            logger.info(f"Loading metrics data from Parquet: {path_parquet}")
            return pd.read_parquet(path_parquet)
        elif os.path.exists(path_csv):
            logger.info(f"Loading metrics data from CSV: {path_csv}")
            return pd.read_csv(path_csv)
        else:
            raise FileNotFoundError(f"No metrics data found at {path_csv} or {path_parquet}")

    def load_metadata(self, filename: str = "resource_metadata.csv") -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            logger.info(f"Loading metadata from CSV: {path}")
            return pd.read_csv(path)
        else:
            logger.warning(f"Metadata file not found at {path}. Returning empty DataFrame.")
            return pd.DataFrame()

    def load_events_data(self, filename: str = "aws_events.csv") -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            logger.info(f"Loading events data from CSV: {path}")
            return pd.read_csv(path)
        else:
            logger.warning(f"Events file not found at {path}. Returning empty DataFrame.")
            return pd.DataFrame()

    def load_all() -> Dict[str, pd.DataFrame]:
        return {
            "cost": self.load_cost_data(),
            "metrics": self.load_metrics_data(),
            "metadata": self.load_metadata(),
            "events": self.load_events_data()
        }
