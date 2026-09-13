import pandas as pd
import numpy as np
from typing import List, Dict, Any
from src.utils.logger import get_logger
from src.utils.config_loader import load_thresholds

logger = get_logger("StatisticalDetector")

class StatisticalAnomalyDetector:
    def __init__(self, config_dir: str = "config"):
        self.cfg = load_thresholds(config_dir).get("anomaly_detection", {})
        self.ma_threshold_pct = self.cfg.get("moving_average", {}).get("deviation_threshold_pct", 35.0)
        self.z_warn = self.cfg.get("z_score", {}).get("warning_threshold", 2.0)
        self.z_crit = self.cfg.get("z_score", {}).get("critical_threshold", 3.0)
        self.mad_warn = self.cfg.get("mad_robust_z_score", {}).get("warning_threshold", 2.5)
        self.mad_crit = self.cfg.get("mad_robust_z_score", {}).get("critical_threshold", 3.5)
        self.pct_spike = self.cfg.get("pct_change", {}).get("spike_threshold_pct", 50.0)

    def detect_anomalies(self, df_features: pd.DataFrame) -> pd.DataFrame:
        logger.info("Executing Statistical Anomaly Detection (No-ML)...")
        df_res = df_features.copy()
        
        anomaly_records = []
        
        for rid, group in df_res.groupby("resource_id"):
            g = group.copy().sort_values(by="timestamp")
            costs = g["cost"].values
            
            if len(costs) < 3:
                continue
                
            # 1. Moving Average Baseline
            ma_baseline = g["cost_rolling_avg_7d"].values
            
            # 2. Standard Z-Score
            mean_cost = np.mean(costs)
            std_cost = np.std(costs)
            z_scores = np.where(std_cost > 0, (costs - mean_cost) / std_cost, 0.0)
            
            # 3. Robust Z-Score (MAD)
            median_cost = np.median(costs)
            mad = np.median(np.abs(costs - median_cost))
            with np.errstate(divide='ignore', invalid='ignore'):
                robust_z_scores = np.where(mad > 0, (0.6745 * (costs - median_cost)) / mad, 0.0)
            
            # 4. Percentage Change
            pct_changes = g["cost_pct_change"].values
            
            for idx in range(len(g)):
                row = g.iloc[idx]
                curr_cost = float(costs[idx])
                base_cost = float(ma_baseline[idx])
                z_sc = float(z_scores[idx])
                r_z_sc = float(robust_z_scores[idx])
                pct_chg = float(pct_changes[idx])
                
                if curr_cost == 0.0:
                    continue
                    
                is_anomaly = False
                methods = []
                
                # Check MAD Robust Z-score first
                if r_z_sc >= self.mad_crit:
                    is_anomaly = True
                    methods.append(f"Robust MAD Z-Score ({r_z_sc:.2f})")
                elif r_z_sc >= self.mad_warn:
                    is_anomaly = True
                    methods.append(f"Robust MAD Z-Score Warning ({r_z_sc:.2f})")
                    
                # Check Standard Z-Score
                if z_sc >= self.z_crit:
                    is_anomaly = True
                    methods.append(f"Standard Z-Score ({z_sc:.2f})")
                    
                # Check Moving Average deviation
                if base_cost > 0 and (curr_cost - base_cost) / base_cost * 100.0 >= self.ma_threshold_pct:
                    is_anomaly = True
                    dev_pct = ((curr_cost - base_cost) / base_cost) * 100.0
                    methods.append(f"Moving Average Deviation (+{dev_pct:.1f}%)")
                    
                # Check Sudden % Change
                if pct_chg >= self.pct_spike:
                    is_anomaly = True
                    methods.append(f"Sudden Cost Spike (+{pct_chg:.1f}%)")
                    
                if is_anomaly:
                    # Severity evaluation
                    if r_z_sc >= self.mad_crit or z_sc >= self.z_crit or pct_chg >= 100.0:
                        severity = "High"
                        score = min(100.0, 70.0 + r_z_sc * 6.0)
                    else:
                        severity = "Medium"
                        score = min(70.0, 45.0 + r_z_sc * 8.0)
                        
                    ts_val = row["timestamp"]
                    ts_str = ts_val.strftime("%Y-%m-%d") if hasattr(ts_val, "strftime") else str(ts_val)

                    anomaly_records.append({
                        "resource_id": rid,
                        "timestamp": ts_str,
                        "service": row.get("service", "Unknown"),
                        "region": row.get("region", "Unknown"),
                        "environment": row.get("environment", "Unknown"),
                        "application": row.get("application", "Unknown"),
                        "anomaly_status": "Flagged",
                        "anomaly_score": round(score, 1),
                        "detection_method": ", ".join(methods),
                        "z_score": round(z_sc, 2),
                        "robust_mad_z_score": round(r_z_sc, 2),
                        "baseline_cost": round(base_cost, 2),
                        "current_cost": round(curr_cost, 2),
                        "deviation_amount": round(curr_cost - base_cost, 2),
                        "severity": severity
                    })

        df_anomalies = pd.DataFrame(anomaly_records)
        logger.info(f"Statistical Anomaly Detection complete. Found {len(df_anomalies)} anomaly records.")
        return df_anomalies
