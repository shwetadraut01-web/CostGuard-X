import pandas as pd
from typing import List, Dict, Any
from src.utils.logger import get_logger

logger = get_logger("TemporalEvidenceEngine")

class TemporalEvidenceEngine:
    @staticmethod
    def correlate_events(df_anomalies: pd.DataFrame, df_events: pd.DataFrame, time_window_hours: int = 48) -> List[Dict[str, Any]]:
        logger.info("Correlating cost anomalies with temporal event logs...")
        correlated_evidence = []
        
        if df_anomalies.empty or df_events.empty:
            return correlated_evidence

        df_ev = df_events.copy()
        if not pd.api.types.is_datetime64_any_dtype(df_ev["event_timestamp"]):
            df_ev["event_timestamp"] = pd.to_datetime(df_ev["event_timestamp"], utc=True)

        for _, anomaly in df_anomalies.iterrows():
            rid = anomaly["resource_id"]
            anom_time = pd.to_datetime(anomaly["timestamp"], utc=True)
            
            # Find events for this resource within time_window_hours
            res_events = df_ev[df_ev["resource_id"] == rid]
            
            for _, ev in res_events.iterrows():
                ev_time = ev["event_timestamp"]
                time_diff_hrs = (anom_time - ev_time).total_seconds() / 3600.0
                
                # If event occurred prior to or near anomaly within window
                if 0 <= time_diff_hrs <= time_window_hours or abs(time_diff_hrs) <= 24:
                    ev_name = ev.get("event_name", "Event")
                    user_role = ev.get("user_or_role", "Unknown User")
                    
                    statement = (
                        f"Cost spike of ${anomaly['current_cost']:.2f}/day occurred approximately "
                        f"{abs(time_diff_hrs):.1f} hours after '{ev_name}' event "
                        f"executed by '{user_role}'."
                    )
                    
                    correlated_evidence.append({
                        "resource_id": rid,
                        "anomaly_timestamp": str(anom_time),
                        "event_timestamp": str(ev_time),
                        "event_name": ev_name,
                        "event_type": ev.get("event_type", "Config"),
                        "user_or_role": user_role,
                        "hours_difference": round(time_diff_hrs, 1),
                        "correlation_statement": statement
                    })

        logger.info(f"Temporal correlation complete. Found {len(correlated_evidence)} event matches.")
        return correlated_evidence
