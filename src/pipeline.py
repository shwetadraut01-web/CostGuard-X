import os
import pandas as pd
from typing import Dict, Any, List
from src.utils.logger import get_logger
from src.ingestion.data_loader import DataLoader
from src.validation.schema_validator import SchemaValidator
from src.cleaning.data_cleaner import DataCleaner
from src.features.feature_engineer import FeatureEngineer
from src.analytics.cost_analytics import CostAnalytics
from src.anomaly.statistical_detector import StatisticalAnomalyDetector
from src.attribution.cost_attributor import CostAttributor
from src.waste.fingerprint_engine import WasteFingerprintEngine
from src.temporal.evidence_engine import TemporalEvidenceEngine
from src.counterfactual.simulator import CounterfactualSimulator
from src.confidence.score_matrix import ScoreMatrixEngine
from src.recommendations.advisory_engine import AdvisoryEngine
from src.llm.bedrock_explainer import BedrockExplainer

logger = get_logger("CostGuardPipeline")

class CostGuardPipeline:
    def __init__(self, data_dir: str = "data/sample", config_dir: str = "config", knowledge_dir: str = "knowledge"):
        self.data_dir = data_dir
        self.config_dir = config_dir
        self.knowledge_dir = knowledge_dir
        
        self.loader = DataLoader(data_dir)
        self.cleaner = DataCleaner()
        self.feature_eng = FeatureEngineer()
        self.detector = StatisticalAnomalyDetector(config_dir)
        self.waste_engine = WasteFingerprintEngine(config_dir)
        self.evidence_engine = TemporalEvidenceEngine()
        self.counterfactual = CounterfactualSimulator()
        self.confidence_engine = ScoreMatrixEngine()
        self.advisory_engine = AdvisoryEngine(knowledge_dir)
        self.explainer = BedrockExplainer()

    def run_pipeline(self) -> Dict[str, Any]:
        logger.info("Executing CostGuard-X end-to-end Data Science Pipeline...")
        
        # 1. Ingestion
        df_raw_cost = self.loader.load_cost_data()
        df_raw_metrics = self.loader.load_metrics_data()
        df_raw_meta = self.loader.load_metadata()
        df_raw_events = self.loader.load_events_data()
        
        # 2. Validation & Cleaning
        df_cost = self.cleaner.clean_cost_data(df_raw_cost)
        df_metrics = self.cleaner.clean_metrics_data(df_raw_metrics)
        df_events = self.cleaner.clean_events_data(df_raw_events)
        
        # 3. Feature Engineering
        df_features = self.feature_eng.engineer_features(df_cost, df_metrics)
        
        # 4. EDA Analytics
        analytics = CostAnalytics(df_features)
        summary_kpis = analytics.get_summary_kpis()
        cost_by_service = analytics.get_cost_by_service()
        cost_by_env = analytics.get_cost_by_environment()
        cost_by_region = analytics.get_cost_by_region()
        daily_trends = analytics.get_daily_cost_trends()
        resource_spend = analytics.get_resource_spend_breakdown()
        correlations = analytics.get_utilization_correlations()
        
        # 5. Statistical Anomaly Detection
        df_anomalies = self.detector.detect_anomalies(df_features)
        
        # 6. Cost Attribution
        attribution = CostAttributor.attribute_cost_drivers(df_cost)
        
        # 7. Waste Fingerprinting
        df_waste = self.waste_engine.analyze_resource_waste(df_features, df_anomalies)
        
        # 8. Temporal Evidence Correlation
        temporal_matches = self.evidence_engine.correlate_events(df_anomalies, df_events)
        
        # 9 & 10 & 11. Counterfactual, Confidence, and Advisory Recommendations
        waste_items = []
        total_avoidable_monthly = 0.0
        
        for _, w_row in df_waste.iterrows():
            rid = w_row["resource_id"]
            cat = w_row["category"]
            daily_c = float(w_row["daily_cost"])
            cpu = float(w_row["cpu_utilization"])
            runtime = float(w_row["runtime_hours"])
            env = str(w_row["environment"])
            evidence = w_row["evidence"]
            is_waste = bool(w_row["is_waste"])
            
            # Counterfactual savings
            savings = self.counterfactual.calculate_resource_savings(
                daily_cost=daily_c,
                category=cat,
                runtime_hours=runtime
            )
            
            # Confidence score
            has_ev = any(m["resource_id"] == rid for m in temporal_matches)
            conf_res = self.confidence_engine.calculate_confidence_score(
                category=cat,
                cpu_utilization=cpu,
                runtime_hours=runtime,
                environment=env,
                has_temporal_event=has_ev
            )
            
            # Advisory Recommendation
            rec = self.advisory_engine.generate_recommendation(
                resource_id=rid,
                category=cat,
                confidence_score=conf_res["score"],
                daily_cost=daily_c,
                avoidable_daily=savings["potential_avoidable_daily"],
                environment=env,
                evidence=evidence
            )

            # LLM explanation payload
            llm_payload = {
                "resource_id": rid,
                "service": w_row["service"],
                "environment": env,
                "current_daily_cost": daily_c,
                "category": cat,
                "confidence_score": conf_res["score"],
                "estimated_monthly_savings": savings["potential_avoidable_monthly"],
                "evidence": evidence
            }

            explanation_res = self.explainer.generate_explanation(llm_payload)

            if is_waste:
                total_avoidable_monthly += savings["potential_avoidable_monthly"]

            waste_items.append({
                "resource_id": rid,
                "service": w_row["service"],
                "instance_type": w_row["instance_type"],
                "environment": env,
                "application": w_row["application"],
                "category": cat,
                "is_waste": is_waste,
                "daily_cost": daily_c,
                "cpu_utilization": cpu,
                "memory_utilization": float(w_row["memory_utilization"]),
                "runtime_hours": runtime,
                "counterfactual": savings,
                "confidence": conf_res,
                "recommendation": rec,
                "ai_explanation": explanation_res
            })

        summary_kpis["total_anomalies"] = len(df_anomalies)
        summary_kpis["total_waste_cases"] = len([w for w in waste_items if w["is_waste"]])
        summary_kpis["total_avoidable_monthly_spend"] = round(total_avoidable_monthly, 2)
        summary_kpis["avg_waste_confidence"] = round(
            sum(w["confidence"]["score"] for w in waste_items if w["is_waste"]) / max(1, summary_kpis["total_waste_cases"]), 1
        )

        logger.info("CostGuard-X Pipeline execution complete.")

        return {
            "summary_kpis": summary_kpis,
            "cost_by_service": cost_by_service,
            "cost_by_environment": cost_by_env,
            "cost_by_region": cost_by_region,
            "daily_trends": daily_trends,
            "resource_spend": resource_spend,
            "correlations": correlations,
            "attribution": attribution,
            "anomalies": df_anomalies.to_dict(orient="records") if not df_anomalies.empty else [],
            "waste_cases": waste_items,
            "temporal_events": temporal_matches
        }
