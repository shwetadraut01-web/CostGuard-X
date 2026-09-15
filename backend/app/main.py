import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure root path is accessible
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.app.routes.api import router as api_router
from backend.app.services.pipeline_service import PipelineService

app = FastAPI(
    title="CostGuard-X API",
    description="Industry-Oriented Cloud Cost Waste Intelligence Backend (No-ML)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "app": "CostGuard-X Backend API",
        "status": "online",
        "mode": os.getenv("APP_MODE", "local"),
        "docs_url": "/docs"
    }

# AWS Lambda Handler Entry Point
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    import json
    def handler(event, context):
        raw_path = event.get("rawPath") or event.get("path") or "/"
        
        if raw_path.endswith("/api/summary"):
            data = PipelineService.get_data()
            body = {
                "status": "success",
                "kpis": data["summary_kpis"],
                "cost_by_service": data["cost_by_service"],
                "cost_by_environment": data["cost_by_environment"],
                "cost_by_region": data["cost_by_region"]
            }
            status_code = 200
        elif raw_path.endswith("/api/cost-trends"):
            data = PipelineService.get_data()
            body = {
                "status": "success",
                "daily_trends": data["daily_trends"],
                "resource_spend": data["resource_spend"],
                "correlations": data["correlations"]
            }
            status_code = 200
        elif raw_path.endswith("/api/anomalies"):
            data = PipelineService.get_data()
            body = {"status": "success", "total": len(data["anomalies"]), "anomalies": data["anomalies"]}
            status_code = 200
        elif raw_path.endswith("/api/waste-cases"):
            data = PipelineService.get_data()
            body = {"status": "success", "total": len(data["waste_cases"]), "waste_cases": data["waste_cases"]}
            status_code = 200
        else:
            body = {
                "app": "CostGuard-X Backend API",
                "status": "online",
                "mode": "aws_lambda",
                "docs_url": "/docs"
            }
            status_code = 200
            
        return {
            "statusCode": status_code,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            },
            "body": json.dumps(body)
        }

# Alias for standard lambda handler names
lambda_handler = handler

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

