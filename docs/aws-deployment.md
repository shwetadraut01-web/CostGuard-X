# CostGuard-X AWS Serverless Deployment Guide

## 1. Local Pre-Deployment Setup
Before deploying to AWS, verify the local application runs cleanly:
```bash
python scripts/generate_synthetic_data.py
python -m pytest tests/
cd frontend && npm run build
```

---

## 2. Serverless AWS Architecture & Prerequisites
- AWS CLI configured with valid credentials (`aws configure`)
- Terraform v1.5+ installed
- Node.js v24+ and Python 3.11/3.13

---

## 3. Deployment Steps via Terraform

1. Navigate to infrastructure folder:
```bash
cd infrastructure/terraform
```

2. Package Lambda zip artifact:
```bash
cd ../../
powershell -Command "Compress-Archive -Path backend, src, config, knowledge -DestinationPath infrastructure/terraform/lambda_payload.zip -Force"
cd infrastructure/terraform
```

3. Initialize & apply Terraform:
```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

4. Outputs generated:
- `s3_bucket_name`: `costguard-x-data-storage-production`
- `api_gateway_endpoint`: `https://<api-id>.execute-api.us-east-1.amazonaws.com`
- `amplify_app_url`: `https://main.<app-id>.amplifyapp.com`

---

## 4. Mode Configuration (`.env`)

For local execution:
```env
APP_MODE=local
ENABLE_BEDROCK=false
DATA_DIR=data/sample
```

For live AWS cloud execution:
```env
APP_MODE=aws
ENABLE_BEDROCK=true
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```
