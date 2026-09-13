# CostGuard-X: AWS Cloud Cost Waste Intelligence Platform

[![Python Version](https://img.shields.io/badge/python-3.11%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-emerald.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-blue.svg)](https://react.dev/)
[![Statistical Engine](https://img.shields.io/badge/analytics-No--ML%20Statistics-indigo.svg)](#statistical-anomaly-detection)
[![AWS Serverless](https://img.shields.io/badge/AWS-Serverless-orange.svg)](#aws-serverless-architecture)

**CostGuard-X** is an industry-oriented Data Science + Cloud FinOps + Explainable AI web application designed for AWS cloud cost waste intelligence.

It analyzes cloud cost and resource usage datasets to detect avoidable spend, classify waste patterns, correlate temporal infrastructure events, calculate counterfactual savings, and generate human-readable business explanations.

> **IMPORTANT CONSTRAINT ENFORCED**:
> **NO MACHINE LEARNING**. CostGuard-X intentionally avoids trained black-box ML models (Random Forest, XGBoost, Neural Nets, Isolation Forest). The analytical core relies entirely on time-series statistics, moving averages, standard Z-scores, robust Z-scores via Median Absolute Deviation (MAD), temporal correlation, explainable rule-based waste fingerprinting, and transparent confidence scoring.

---

## Key Questions Answered by CostGuard-X

1. **What is costing money?** Precise cost attribution down to service, resource, region, environment, and application.
2. **Is the cost unusual?** Multi-method statistical anomaly detection comparing actual spend against rolling baselines.
3. **Is behavior waste or legitimate growth?** Rule-based waste fingerprinting distinguishing between idle/over-provisioned waste and proportional traffic growth.
4. **What evidence supports the conclusion?** Transparent mathematical evidence bullets and event log correlations.
5. **How much cost could potentially be avoided?** Counterfactual "What-If" scenario simulator calculating daily and monthly savings.
6. **How confident is the system?** Transparent 0–100 waste confidence score matrix with positive and negative evidence factors.
7. **Can an LLM explain the result?** Amazon Bedrock integration (with deterministic template fallback) converting structured data into simple business language.

---

## Core Data Science Pipeline

```
DATA INGESTION (CSV/Parquet)
      ↓
DATA VALIDATION & CLEANING
      ↓
FEATURE ENGINEERING (Rolling Averages, Growth Rates, Runtime Ratios)
      ↓
EDA & COST ANALYTICS (Breakdowns & Utilization Correlations)
      ↓
STATISTICAL ANOMALY DETECTION (Moving Avg, Z-Score, MAD Robust Z-Score)
      ↓
COST ATTRIBUTION & DRIVER ANALYSIS
      ↓
WASTE FINGERPRINTING (Configurable Rule Matrix)
      ↓
TEMPORAL EVIDENCE CORRELATION (Event Log Matching)
      ↓
COUNTERFACTUAL COST ENGINE ("What-If" Avoidable Savings)
      ↓
WASTE CONFIDENCE MATRIX (0-100 Score Engine)
      ↓
SAFETY & ADVISORY RECOMMENDATIONS (Advisory Only)
      ↓
BEDROCK / DETERMINISTIC EXPLANATION LAYER
      ↓
REACT + TYPESCRIPT WEB APPLICATION (9 Interactive Pages)
```

---

## 8 Synthetic Scenarios Built-In

CostGuard-X includes realistic multi-month synthetic datasets embedding 8 specific test scenarios:

1. **Idle Resource**: `i-0dev123456789a` (EC2 dev instance running 24h continuous with 3–6% CPU, $14.50/day).
2. **Over-provisioned Resource**: `db-overprov-prod01` (RDS `db.r5.2xlarge` instance costing $48/day with 12% CPU and 18% RAM).
3. **Non-production Waste**: `i-0nonprod998877` (QA test server running 24/7 over weekends with minimal load).
4. **Abnormal Storage Growth**: `vol-0storagebloat01` (EBS volume expanding from 100GB to 5TB without request growth).
5. **Legitimate Business Growth**: `i-0prodapp0123` (Cost increasing from $22 to $55/day, but request count jumping 5x and CPU load at 75%).
6. **Sudden Cost Spike**: `i-0spike991122` (Baseline $6/day suddenly jumping to $88.50/day after a `ConfigurationChange` event).
7. **New Resource Deployment**: `i-0newdeploy77` (Launched recently via `RunInstances` event).
8. **High-cost High-utilization Legitimate Resource**: `i-0heavyworker01` (Costing $135/day, running at 88% CPU load under heavy ETL batch processing).

---

## Statistical & FinOps Formulas

### 1. Moving Average Baseline
$$\mu_{7d}(t) = \frac{1}{7} \sum_{i=0}^{6} x(t-i)$$

### 2. Standard Z-Score
$$Z = \frac{x(t) - \mu}{\sigma}$$

### 3. Robust Z-Score via Median Absolute Deviation (MAD)
$$\text{MAD} = \text{median}\left( |x_i - \text{median}(x)| \right)$$
$$\text{Robust } Z = \frac{0.6745 \cdot (x(t) - \text{median}(x))}{\text{MAD}}$$

### 4. Counterfactual Avoidable Cost
$$C_{cf} = C_{current} \times \left( \frac{h_{target}}{h_{current}} \right)$$
$$\text{Avoidable Monthly} = (C_{current} - C_{cf}) \times 30$$

---

## Web Application Pages

The web application consists of 9 distinct, responsive pages:

1. **Home / Overview**: Project hero section, quick metrics, high-confidence alerts, architectural flow diagram.
2. **Executive Dashboard**: High-level KPI cards, daily cost trend line chart, service distribution pie chart, environment stack bar chart, waste category breakdown.
3. **Cost Explorer**: Filterable cost timeline (by service, environment, search term), cumulative cost growth chart, resource granularity tables.
4. **Anomaly Explorer**: Table of flagged statistical anomalies with Z-score, MAD Robust Z-score, baseline cost, severity badges, and drill-down inspection modal.
5. **Waste Intelligence**: Categorized waste findings, 0–100 confidence meter, evidence bullets, advisory recommendations, estimated monthly savings.
6. **Resource Details**: Individual resource deep-dive displaying CPU/memory metrics, cost history, correlated event logs, counterfactual savings breakdown.
7. **What-If Simulator**: Interactive sliders for target runtime hours, instance downsize discount %, and storage archival discount % to recalculate avoidable cost in real time.
8. **AI Explanation**: Comparison viewer displaying Amazon Bedrock LLM explanations alongside deterministic template fallbacks and structured JSON inputs.
9. **Methodology / About**: Mathematical documentation explaining Z-score formulas, MAD equations, waste fingerprint rules, FinOps safety boundaries, and academic evaluation framework.

---

## Local Development Quickstart

### Prerequisites
- Python 3.11 or 3.13
- Node.js v24+ and npm 11+

### Step 1: Install Python Dependencies & Generate Synthetic Data
```bash
# Install Python packages
pip install -r requirements.txt

# Generate synthetic datasets
python scripts/generate_synthetic_data.py

# Run unit & integration tests
python -m pytest tests/
```

### Step 2: Start FastAPI Backend
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Swagger documentation will be available at: `http://127.0.0.1:8000/docs`

### Step 3: Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## AWS Serverless Infrastructure & Terraform

CostGuard-X includes Terraform infrastructure blueprints (`infrastructure/terraform/`) for zero out-of-pocket deployment:
- **Amazon S3**: Raw and processed cost data storage.
- **AWS Lambda**: Serverless execution of the FastAPI analytical engine.
- **Amazon API Gateway**: HTTP API routing.
- **AWS Amplify Hosting**: Production React frontend hosting.
- **Amazon Bedrock**: Optional Claude 3 Haiku invocation for business language explanations.

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

> **AWS Cost Notice**: CostGuard-X is designed for zero out-of-pocket deployment within applicable AWS Free Plan, Free Tier allowances and available AWS credits, using a serverless architecture and controlled usage.

---

## Project Structure

```
H:\CostXGuard\
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── config/
│   ├── settings.yaml
│   ├── thresholds.yaml
│   └── waste_rules.yaml
├── knowledge/
│   ├── waste_definitions.json
│   ├── recommendation_rules.json
│   └── safety_rules.json
├── data/
│   ├── raw/
│   ├── processed/
│   ├── synthetic/
│   └── sample/
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_eda.ipynb
│   ├── 03_statistical_analysis.ipynb
│   ├── 04_waste_analysis.ipynb
│   └── 05_counterfactual_analysis.ipynb
├── src/
│   ├── ingestion/         # M01: Local CSV/Parquet reader
│   ├── validation/        # M02: Schema validation & null checks
│   ├── cleaning/          # M02: Time alignment, unit conversion, deduplication
│   ├── features/          # M03: Rolling stats, growth rates, utilization ratios
│   ├── analytics/         # M04: Aggregations, service/region breakdown, correlation
│   ├── anomaly/           # M05: Moving Avg, Z-score, MAD Z-score, % Change
│   ├── attribution/       # M06: Cost driver & resource breakdown
│   ├── waste/             # M07: Rule-based waste fingerprinting
│   ├── temporal/          # M08: Event-to-cost proximity correlation engine
│   ├── counterfactual/    # M09: "What-If" avoidable cost calculation
│   ├── confidence/        # M10: Transparent 0-100 score matrix engine
│   ├── recommendations/   # M11: Advisory safety-aware recommendation engine
│   └── llm/               # M12: Amazon Bedrock API wrapper & Deterministic generator
├── backend/
│   └── app/
│       ├── main.py        # FastAPI app instance
│       ├── routes/        # REST API Endpoints
│       ├── services/      # Pipeline service orchestrator
│       └── models/        # Pydantic schemas
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── components/    # Reusable UI cards, tables, badges, Plotly charts
│   │   ├── pages/         # 9 Web Pages (Overview, Dashboard, Explorer, Anomalies, Waste, Resource, Simulator, AI, Methodology)
│   │   ├── services/      # Axios API client
│   │   ├── types/         # TypeScript interfaces
│   │   └── App.tsx
├── infrastructure/
│   └── terraform/         # Serverless AWS deployment scripts (S3, Lambda, API Gateway, Amplify, IAM)
├── tests/                 # Pytest automated test suite (12 passing tests)
└── scripts/               # Data generation & setup scripts
```

---

## Advisory Safety Boundary

CostGuard-X operates strictly as a **read-only advisory intelligence platform**. It **NEVER** automatically terminates instances, stops databases, deletes S3 buckets, or modifies AWS infrastructure. All recommendations require human review by cloud engineers or FinOps analysts.
