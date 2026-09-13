import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_api_summary():
    response = client.get("/api/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "kpis" in data
    assert data["kpis"]["total_spend"] > 0

def test_api_waste_cases():
    response = client.get("/api/waste-cases")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "waste_cases" in data

def test_api_what_if():
    response = client.post("/api/what-if", json={
        "custom_runtime_hours": 10.0,
        "custom_downsize_pct": 40.0,
        "custom_storage_archival_pct": 65.0
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "simulation" in data

def test_api_methodology():
    response = client.get("/api/methodology")
    assert response.status_code == 200
    assert "STRICT NO-MACHINE-LEARNING" in response.json()["constraint"]
