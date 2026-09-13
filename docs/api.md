# CostGuard-X REST API Specification

## Base URL
- Local: `http://127.0.0.1:8000/api`
- AWS Production: `https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/api`

---

## Endpoints

### 1. `GET /api/summary`
Returns executive overview KPIs, spend summary, and cost breakdown by service/environment/region.

### 2. `GET /api/cost-trends`
Returns daily time-series spend trends, resource spend allocation, and utilization correlations.

### 3. `GET /api/anomalies`
Returns statistical anomaly records with standard Z-score, MAD Robust Z-score, baseline cost, and severity.
Query Params: `severity` (`High`, `Medium`, `Low`), `service`.

### 4. `GET /api/waste-cases`
Returns fingerprinted waste items with 0-100 confidence matrix, evidence bullets, and advisory recommendations.
Query Params: `category` (`Idle Resource`, `Over-provisioning`, etc.).

### 5. `GET /api/resource/{resource_id}`
Returns deep-dive resource telemetry, metric timeline, correlated event logs, and counterfactual savings.

### 6. `POST /api/what-if`
Accepts scenario adjustments and returns projected avoidable cost savings.
Request Body:
```json
{
  "custom_runtime_hours": 10.0,
  "custom_downsize_pct": 40.0,
  "custom_storage_archival_pct": 65.0
}
```

### 7. `POST /api/explain`
Generates business language explanation via Amazon Bedrock (or deterministic fallback).
Request Body:
```json
{
  "resource_id": "i-0dev123456789a",
  "category": "Idle Resource",
  "service": "EC2",
  "environment": "dev",
  "current_daily_cost": 14.5,
  "confidence_score": 92,
  "estimated_monthly_savings": 261.0,
  "evidence": ["CPU remained below 10%", "Resource ran continuously"]
}
```

### 8. `GET /api/methodology`
Returns technical breakdown of statistical algorithms and waste fingerprint rules.
