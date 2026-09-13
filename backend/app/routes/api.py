from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from backend.app.models.schemas import WhatIfRequest, ExplainRequest
from backend.app.services.pipeline_service import PipelineService

router = APIRouter(prefix="/api", tags=["CostGuard-X Intelligence API"])

@router.get("/summary")
def get_summary() -> Dict[str, Any]:
    data = PipelineService.get_data()
    return {
        "status": "success",
        "kpis": data["summary_kpis"],
        "cost_by_service": data["cost_by_service"],
        "cost_by_environment": data["cost_by_environment"],
        "cost_by_region": data["cost_by_region"]
    }

@router.get("/cost-trends")
def get_cost_trends() -> Dict[str, Any]:
    data = PipelineService.get_data()
    return {
        "status": "success",
        "daily_trends": data["daily_trends"],
        "resource_spend": data["resource_spend"],
        "correlations": data["correlations"]
    }

@router.get("/anomalies")
def get_anomalies(
    severity: Optional[str] = None,
    service: Optional[str] = None
) -> Dict[str, Any]:
    data = PipelineService.get_data()
    anomalies = data["anomalies"]
    
    if severity:
        anomalies = [a for a in anomalies if a.get("severity", "").lower() == severity.lower()]
    if service:
        anomalies = [a for a in anomalies if a.get("service", "").lower() == service.lower()]
        
    return {
        "status": "success",
        "total": len(anomalies),
        "anomalies": anomalies
    }

@router.get("/waste-cases")
def get_waste_cases(category: Optional[str] = None) -> Dict[str, Any]:
    data = PipelineService.get_data()
    waste_cases = data["waste_cases"]
    
    if category:
        waste_cases = [w for w in waste_cases if w.get("category", "").lower() == category.lower()]
        
    return {
        "status": "success",
        "total": len(waste_cases),
        "waste_cases": waste_cases
    }

@router.get("/resource/{resource_id}")
def get_resource_details(resource_id: str) -> Dict[str, Any]:
    data = PipelineService.get_data()
    
    # Filter waste case and anomalies for specific resource
    waste_match = next((w for w in data["waste_cases"] if w["resource_id"] == resource_id), None)
    res_anomalies = [a for a in data["anomalies"] if a["resource_id"] == resource_id]
    res_events = [e for e in data["temporal_events"] if e["resource_id"] == resource_id]
    
    if not waste_match and not res_anomalies:
        # Fallback check in resource spend
        res_spend = [r for r in data["resource_spend"] if r["resource_id"] == resource_id]
        if not res_spend:
            raise HTTPException(status_code=404, detail=f"Resource '{resource_id}' not found.")
            
    return {
        "status": "success",
        "resource_id": resource_id,
        "waste_details": waste_match,
        "anomalies": res_anomalies,
        "temporal_events": res_events
    }

@router.post("/what-if")
def post_what_if(req: WhatIfRequest) -> Dict[str, Any]:
    sim_res = PipelineService.run_what_if(
        runtime_h=req.custom_runtime_hours,
        downsize_pct=req.custom_downsize_pct,
        storage_pct=req.custom_storage_archival_pct
    )
    return {
        "status": "success",
        "simulation": sim_res
    }

@router.post("/explain")
def post_explain(req: ExplainRequest) -> Dict[str, Any]:
    explanation = PipelineService.explain_result(req.dict())
    return {
        "status": "success",
        "ai_explanation": explanation
    }

@router.get("/methodology")
def get_methodology() -> Dict[str, Any]:
    return {
        "status": "success",
        "title": "CostGuard-X Statistical & FinOps Analytical Methodology",
        "constraint": "STRICT NO-MACHINE-LEARNING. Built using classical time-series statistics and explainable rule matrices.",
        "statistical_methods": {
            "moving_average": "7-day rolling window mean calculation to establish non-linear spend baseline.",
            "standard_z_score": "Z = (X - μ) / σ measuring standard deviations from historical baseline mean.",
            "robust_mad_z_score": "Robust Z = 0.6745 * (X - Median) / MAD where MAD = Median(|X - Median|), immune to outlier skew.",
            "percentage_change": "% Δ = ((Cost_t - Cost_t-1) / Cost_t-1) * 100 detecting sudden step-changes."
        },
        "waste_fingerprints": [
            "Idle Resource: CPU < 10%, Runtime >= 18h/day, Cost >= $1.0/day.",
            "Over-provisioning: CPU < 20%, Memory < 25%, Instance size = large/xlarge, Cost >= $5.0/day.",
            "Non-production Waste: Env in (Dev, Test, Staging), Runtime >= 20h/day, CPU < 15%.",
            "Abnormal Storage Growth: Storage growth > 15%/day without request growth.",
            "Legitimate Growth: Cost ↑ + Requests ↑ + CPU >= 40% (Confirmed non-waste)."
        ],
        "counterfactual_analysis": "Mathematical scenario projection calculating current spend vs. hypothetical optimized schedule/sizing.",
        "confidence_scoring": "Explainable 0-100 score matrix aggregating statistical anomaly strength, utilization, environment risk, and counter-evidence."
    }
