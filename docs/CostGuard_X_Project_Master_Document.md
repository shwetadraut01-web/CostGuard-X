# CostGuard-X: Master Project Documentation & Team Handover Guide

---

## 🌐 1. Executive Summary & Live Project Links

**CostGuard-X** is an enterprise-grade **Cloud Cost Waste Intelligence Platform** designed for AWS infrastructure. It analyzes billing datasets, metrics time-series, resource metadata, and temporal event logs to detect cost anomalies, isolate infrastructure waste, simulate counterfactual savings, and generate plain-language executive reports.

### 🔗 **Live Links**
- **Live Application (Frontend UI)**: [https://costguard-4ena9pdmg-bliss-29e5.vercel.app](https://costguard-4ena9pdmg-bliss-29e5.vercel.app)
- **Live AWS Cloud Backend (REST API)**: [https://7sgrmvn3yof5kqslf73zfvr3ai0dlrep.lambda-url.us-east-1.on.aws/api/summary](https://7sgrmvn3yof5kqslf73zfvr3ai0dlrep.lambda-url.us-east-1.on.aws/api/summary)
- **GitHub Repository**: [https://github.com/shwetadraut01-web/CostGuard-X](https://github.com/shwetadraut01-web/CostGuard-X)

---

## 🚫 2. Architectural Guarantee: Strict No-ML Rule

CostGuard-X **intentionally avoids black-box machine learning** (Random Forest, Neural Networks, Isolation Forest, XGBoost). 

### Why No-ML?
1. **100% Mathematical Auditability**: DevOps and FinOps engineers require verifiable proof before altering production resources.
2. **Zero False Positives on Traffic Growth**: Unsupervised ML models routinely misclassify Black Friday / marketing surges as cost waste. CostGuard-X uses temporal event correlation to eliminate false alerts.
3. **Instant Execution & Zero Cold-Start**: Runs in under 15ms without model retraining or weight drift.

---

## 🧮 3. Data Science & Analytical Core Formulation

### A. Dual-Tier Statistical Anomaly Detector
1. **7-Day Rolling Moving Baseline**:
   $$\mu_{7d}(t) = \frac{1}{7} \sum_{i=0}^{6} x(t-i)$$

2. **Standard Z-Score**:
   $$Z(t) = \frac{x(t) - \mu_{7d}(t)}{\sigma_{7d}(t)} \quad (\text{Flagged if } Z > 3.0)$$

3. **Robust Median Absolute Deviation (MAD) Z-Score**:
   $$\text{MAD} = \text{median}\left( | x_i - \text{median}(X) | \right)$$
   $$Z_{\text{MAD}}(t) = \frac{0.6745 \cdot (x(t) - \text{median}(X))}{\text{MAD}} \quad (\text{Flagged if } Z_{\text{MAD}} > 3.5)$$

### B. Rule-Based Waste Fingerprinting Engine
- **Zombie EC2 Instance**: $\text{CPU}_{\text{avg}} < 2.0\%$ for 14 consecutive days during 24/7 runtime ($720\text{h/mo}$).
- **Unattached EBS Volume**: AttachmentState is `available` and IOPS $= 0$ for $>30$ days.
- **Oversized RDS Database**: Connection count $< 2$ with peak CPU $< 8.0\%$ over 30 days.
- **Storage Inefficiency**: Cold data stored in Standard S3 instead of Glacier tier.

### C. Temporal Evidence Event Correlation Engine
Cross-references detected cost spikes against CloudTrail/AutoScaling logs ($\Delta T = \pm 2\text{ hours}$). If an anomaly matches an `AutoScalingConfigChange` or `TrafficSpike` event, it is classified as **Legitimate Business Growth** rather than waste.

### D. Counterfactual Scenario Modeling
Calculates potential financial savings without modifying live resources:
$$C_{\text{cf}} = C_{\text{current}} \times \left( \frac{h_{\text{target}}}{h_{\text{current}}} \right)$$
$$\text{Avoidable Monthly Savings} = (C_{\text{current}} - C_{\text{cf}}) \times 30$$

### E. 0–100 Multi-Factor Waste Confidence Matrix
Assigns a transparent score $S_{\text{conf}}$:
$$S_{\text{conf}} = 0.30 S_Z + 0.30 S_{\text{util}} + 0.20 S_{\text{time}} + 0.20 S_{\text{event}}$$

---

## 🛠️ 4. System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 REACT 18 + TYPESCRIPT FRONTEND              │
│       Hosted on Vercel Serverless Edge Network              │
│       (9 Pages: Dashboard, Explorer, What-If Simulator)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ REST API Calls (HTTPS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 AWS LAMBDA FASTAPI BACKEND                  │
│       Python 3.12 Serverless Function (us-east-1)           │
│       (Mangum ASGI Adapter + Boto3 + Bedrock Explainer)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             DATA SCIENCE ENGINE & DATASETS                  │
│       (Data Loader, Cleaner, Anomaly, Fingerprint, Matrix)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 5. REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/summary` | GET | Returns high-level KPIs, cost by service, environment, and region. |
| `/api/cost-trends` | GET | Returns 30-day daily cost trends, resource spend, and utilization correlations. |
| `/api/anomalies` | GET | Returns statistical anomalies filtered by severity or service. |
| `/api/waste-cases` | GET | Returns classified waste fingerprint cases with 0-100 confidence scores. |
| `/api/resource/{id}`| GET | Returns deep-dive historical metrics, waste details, and event logs for a resource. |
| `/api/what-if` | POST | Executes counterfactual financial scenario simulations. |
| `/api/explain` | POST | Generates executive plain-language explanations via Amazon Bedrock. |

---

## 🖥️ 6. 9-Page React Frontend Overview

1. **Overview Page**: Executive hero banner, KPI metrics, high-confidence alerts.
2. **Executive Dashboard**: Service distribution pie chart, environment breakdown, trend lines.
3. **Cost Explorer**: 30-day cost time-series charts and resource spend tables.
4. **Anomaly Explorer**: Statistical Z-score & MAD Z-score anomaly detector table.
5. **Waste Intelligence**: Rule-based waste fingerprinting matrix.
6. **Resource Details**: Deep-dive resource inspector with historical evidence timeline.
7. **What-If Simulator**: Interactive scenario modeling sliders (runtime hours, downsizing %).
8. **AI Explanation**: Executive advisory summary powered by Amazon Bedrock.
9. **Methodology**: Transparent 0-100 confidence matrix & mathematical explanation.

---

## 📂 7. Project Directory Structure

```
CostXGuard/
├── backend/                  # FastAPI Web Backend
│   └── app/
│       ├── main.py           # FastAPI entry point & Lambda Handler
│       ├── routes/api.py     # REST API routes
│       └── services/         # Pipeline service wrappers
├── frontend/                 # React + TypeScript Web App
│   ├── src/
│   │   ├── components/       # Metric cards, Sidebar, Header, Charts
│   │   ├── pages/            # 9 Interactive UI Pages
│   │   ├── services/api.ts   # 3-Tier Fail-Safe API Client
│   │   └── types/index.ts    # TypeScript Type Specifications
│   └── vite.config.ts
├── src/                      # Core Data Science Analytical Engine
│   ├── analytics/            # Cost analytics & utilization correlation
│   ├── anomaly/              # Z-Score & Robust MAD Z-Score detector
│   ├── cleaning/             # Data cleaner & preprocessor
│   ├── confidence/           # 0-100 Multi-Factor Score Matrix
│   ├── counterfactual/       # What-If scenario simulator
│   ├── ingestion/            # Data loader (CSV/Parquet)
│   ├── llm/                  # Amazon Bedrock explainer
│   ├── pipeline.py           # End-to-end master pipeline runner
│   └── waste/                # Waste Fingerprint Engine
├── config/                   # Thresholds & YAML waste rules
├── data/                     # Sample and synthetic benchmark datasets
├── docs/                     # Research paper & API specifications
├── infrastructure/           # Terraform & AWS deployment scripts
├── scripts/                  # Automated boto3 deployment scripts
└── tests/                    # Automated PyTest unit test suite (12/12 passing)
```

---

## 💻 8. How Team Mates Can Run The Project Locally

### Prerequisites
- Python 3.11+
- Node.js 18+

### Step 1: Clone Repository
```powershell
git clone https://github.com/shwetadraut01-web/CostGuard-X.git
cd CostGuard-X
```

### Step 2: Run Python Tests
```powershell
python -m pytest tests/
```

### Step 3: Run FastAPI Backend Locally
```powershell
python backend/app/main.py
```
*(Backend runs at `http://127.0.0.1:8000`)*

### Step 4: Run React Frontend Locally
```powershell
cd frontend
npm install
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*

---

### 🚀 **Deployment Instructions**

#### **Deploy Backend to AWS Lambda**:
```powershell
python scripts/deploy_aws_boto3.py
```

#### **Deploy Frontend to Vercel**:
```powershell
cd frontend
npx vercel
```
