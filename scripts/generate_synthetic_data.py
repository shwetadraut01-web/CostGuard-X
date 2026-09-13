"""
Synthetic Data Generation Script for CostGuard-X.
Generates realistic 60-day AWS cost, utilization, metadata, and event datasets
incorporating 8 explicit waste and business growth scenarios.
"""
import os
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

def generate_datasets(output_dir: str = "data/sample"):
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("data/synthetic", exist_ok=True)
    
    np.random.seed(42)
    random.seed(42)
    
    end_date = datetime(2026, 9, 13)
    start_date = end_date - timedelta(days=60)
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    # 1. Resource Metadata
    resources = [
        # Scenario 1: Idle Resource
        {
            "resource_id": "i-0dev123456789a",
            "service": "EC2",
            "resource_type": "t3.xlarge",
            "instance_type": "t3.xlarge",
            "region": "us-east-1",
            "environment": "dev",
            "application": "Analytics API Dev",
            "owner": "dev-team@company.com"
        },
        # Scenario 2: Over-provisioned Resource
        {
            "resource_id": "db-overprov-prod01",
            "service": "RDS",
            "resource_type": "db.r5.2xlarge",
            "instance_type": "db.r5.2xlarge",
            "region": "us-east-1",
            "environment": "production",
            "application": "Customer DB",
            "owner": "db-admin@company.com"
        },
        # Scenario 3: Non-production Waste
        {
            "resource_id": "i-0nonprod998877",
            "service": "EC2",
            "resource_type": "m5.large",
            "instance_type": "m5.large",
            "region": "us-west-2",
            "environment": "test",
            "application": "QA Test Server",
            "owner": "qa-team@company.com"
        },
        # Scenario 4: Abnormal Storage Growth
        {
            "resource_id": "vol-0storagebloat01",
            "service": "EBS",
            "resource_type": "gp3",
            "instance_type": "gp3",
            "region": "us-east-1",
            "environment": "staging",
            "application": "Log Archive Storage",
            "owner": "ops@company.com"
        },
        # Scenario 5: Legitimate Business Growth
        {
            "resource_id": "i-0prodapp0123",
            "service": "EC2",
            "resource_type": "c5.2xlarge",
            "instance_type": "c5.2xlarge",
            "region": "us-east-1",
            "environment": "production",
            "application": "Core Web App",
            "owner": "web-team@company.com"
        },
        # Scenario 6: Sudden Cost Spike
        {
            "resource_id": "i-0spike991122",
            "service": "EC2",
            "resource_type": "c5.4xlarge",
            "instance_type": "c5.4xlarge",
            "region": "us-west-1",
            "environment": "dev",
            "application": "Batch Experiment Server",
            "owner": "data-team@company.com"
        },
        # Scenario 7: New Resource Deployment
        {
            "resource_id": "i-0newdeploy77",
            "service": "EC2",
            "resource_type": "m5.xlarge",
            "instance_type": "m5.xlarge",
            "region": "eu-west-1",
            "environment": "production",
            "application": "Payment Gateway v2",
            "owner": "fintech@company.com"
        },
        # Scenario 8: High-cost High-utilization Legitimate Resource
        {
            "resource_id": "i-0heavyworker01",
            "service": "EC2",
            "resource_type": "c5n.9xlarge",
            "instance_type": "c5n.9xlarge",
            "region": "us-east-1",
            "environment": "production",
            "application": "Data Processing Cluster",
            "owner": "etl-team@company.com"
        }
    ]
    
    df_meta = pd.DataFrame(resources)
    
    # 2. Time-series Cost & Usage Data + Resource Metrics
    cost_rows = []
    metric_rows = []
    
    for d_idx, date_val in enumerate(dates):
        date_str = date_val.strftime("%Y-%m-%d")
        ts_str = f"{date_str}T00:00:00Z"
        day_of_week = date_val.weekday() # 5=Sat, 6=Sun
        is_weekend = day_of_week >= 5
        
        for r in resources:
            rid = r["resource_id"]
            stype = r["service"]
            env = r["environment"]
            
            if rid == "i-0dev123456789a":
                # Scenario 1: Idle Resource
                cpu = np.random.uniform(2.5, 6.0)
                mem = np.random.uniform(15.0, 22.0)
                net_in = np.random.uniform(10, 50)
                net_out = np.random.uniform(10, 50)
                disk_r = np.random.uniform(5, 20)
                disk_w = np.random.uniform(5, 20)
                storage_gb = 50.0
                req_count = int(np.random.uniform(50, 200))
                runtime_hrs = 24.0
                cost = 14.50 + np.random.uniform(-0.2, 0.2)
                usage_qty = 24.0
                usage_type = "Hrs"
                
            elif rid == "db-overprov-prod01":
                # Scenario 2: Over-provisioned Resource
                cpu = np.random.uniform(10.0, 16.0)
                mem = np.random.uniform(18.0, 24.0)
                net_in = np.random.uniform(200, 800)
                net_out = np.random.uniform(300, 900)
                disk_r = np.random.uniform(100, 300)
                disk_w = np.random.uniform(100, 300)
                storage_gb = 500.0
                req_count = int(np.random.uniform(1500, 3000))
                runtime_hrs = 24.0
                cost = 48.00 + np.random.uniform(-0.5, 0.5)
                usage_qty = 24.0
                usage_type = "Hrs"

            elif rid == "i-0nonprod998877":
                # Scenario 3: Non-production Waste (Runs 24/7 even on weekends)
                cpu = np.random.uniform(3.0, 8.0) if is_weekend else np.random.uniform(8.0, 18.0)
                mem = np.random.uniform(20.0, 30.0)
                net_in = np.random.uniform(20, 100)
                net_out = np.random.uniform(20, 100)
                disk_r = np.random.uniform(10, 40)
                disk_w = np.random.uniform(10, 40)
                storage_gb = 80.0
                req_count = int(np.random.uniform(20, 100)) if is_weekend else int(np.random.uniform(500, 1200))
                runtime_hrs = 24.0
                cost = 16.20 + np.random.uniform(-0.3, 0.3)
                usage_qty = 24.0
                usage_type = "Hrs"

            elif rid == "vol-0storagebloat01":
                # Scenario 4: Abnormal Storage Growth (Grows exponentially from day 30)
                if d_idx < 30:
                    storage_gb = 100.0 + d_idx * 2
                else:
                    storage_gb = 160.0 + (d_idx - 30) * 150.0 # Rapid bloat
                cpu = 0.0
                mem = 0.0
                net_in = 0.0
                net_out = 0.0
                disk_r = np.random.uniform(10, 30)
                disk_w = np.random.uniform(10, 30)
                req_count = int(np.random.uniform(100, 300)) # Constant low activity
                runtime_hrs = 24.0
                cost = (storage_gb * 0.08) / 30.0 + np.random.uniform(-0.1, 0.1)
                usage_qty = storage_gb
                usage_type = "GB-Mo"

            elif rid == "i-0prodapp0123":
                # Scenario 5: Legitimate Business Growth (Traffic & usage growth match cost growth)
                growth_factor = 1.0 + (d_idx / 60.0) * 2.5 # 2.5x growth over 60 days
                cpu = min(85.0, 35.0 * (1.0 + (d_idx / 60.0) * 0.8))
                mem = min(80.0, 40.0 * (1.0 + (d_idx / 60.0) * 0.7))
                net_in = 1000 * growth_factor
                net_out = 4000 * growth_factor
                disk_r = 500 * growth_factor
                disk_w = 400 * growth_factor
                storage_gb = 200.0
                req_count = int(10000 * growth_factor)
                runtime_hrs = 24.0
                cost = 22.0 * growth_factor + np.random.uniform(-0.5, 0.5)
                usage_qty = 24.0 * growth_factor
                usage_type = "Hrs"

            elif rid == "i-0spike991122":
                # Scenario 6: Sudden Cost Spike on Day 45
                if d_idx < 45:
                    cost = 6.00 + np.random.uniform(-0.2, 0.2)
                    cpu = np.random.uniform(10.0, 20.0)
                    runtime_hrs = 24.0
                else:
                    cost = 88.50 + np.random.uniform(-2.0, 2.0) # Sharp 14x spike
                    cpu = np.random.uniform(12.0, 22.0) # CPU didn't rise proportionally!
                    runtime_hrs = 24.0
                mem = np.random.uniform(25.0, 35.0)
                net_in = np.random.uniform(100, 300)
                net_out = np.random.uniform(100, 300)
                disk_r = np.random.uniform(50, 100)
                disk_w = np.random.uniform(50, 100)
                storage_gb = 100.0
                req_count = int(np.random.uniform(400, 800))
                usage_qty = 24.0
                usage_type = "Hrs"

            elif rid == "i-0newdeploy77":
                # Scenario 7: New Resource Deployment starting on Day 35
                if d_idx < 35:
                    cost = 0.0
                    cpu = 0.0
                    mem = 0.0
                    net_in = 0.0
                    net_out = 0.0
                    disk_r = 0.0
                    disk_w = 0.0
                    storage_gb = 0.0
                    req_count = 0
                    runtime_hrs = 0.0
                    usage_qty = 0.0
                    usage_type = "Hrs"
                else:
                    cost = 28.40 + np.random.uniform(-0.4, 0.4)
                    cpu = np.random.uniform(45.0, 65.0)
                    mem = np.random.uniform(50.0, 70.0)
                    net_in = np.random.uniform(800, 2000)
                    net_out = np.random.uniform(1500, 3500)
                    disk_r = np.random.uniform(200, 500)
                    disk_w = np.random.uniform(200, 500)
                    storage_gb = 150.0
                    req_count = int(np.random.uniform(5000, 12000))
                    runtime_hrs = 24.0
                    usage_qty = 24.0
                    usage_type = "Hrs"

            elif rid == "i-0heavyworker01":
                # Scenario 8: High-cost High-utilization Legitimate Resource
                cost = 135.00 + np.random.uniform(-3.0, 3.0)
                cpu = np.random.uniform(82.0, 96.0)
                mem = np.random.uniform(75.0, 90.0)
                net_in = np.random.uniform(5000, 15000)
                net_out = np.random.uniform(10000, 25000)
                disk_r = np.random.uniform(2000, 6000)
                disk_w = np.random.uniform(1500, 5000)
                storage_gb = 1000.0
                req_count = int(np.random.uniform(40000, 90000))
                runtime_hrs = 24.0
                usage_qty = 24.0
                usage_type = "Hrs"

            cost_rows.append({
                "timestamp": ts_str,
                "account_id": "123456789012",
                "region": r["region"],
                "service": stype,
                "resource_id": rid,
                "resource_type": r["resource_type"],
                "usage_type": usage_type,
                "usage_quantity": round(usage_qty, 2),
                "cost": round(cost, 4),
                "currency": "USD",
                "environment": env,
                "application": r["application"]
            })
            
            metric_rows.append({
                "timestamp": ts_str,
                "resource_id": rid,
                "cpu_utilization": round(cpu, 2),
                "memory_utilization": round(mem, 2),
                "network_in": round(net_in, 2),
                "network_out": round(net_out, 2),
                "disk_read": round(disk_r, 2),
                "disk_write": round(disk_w, 2),
                "storage_gb": round(storage_gb, 2),
                "request_count": req_count,
                "runtime_hours": round(runtime_hrs, 2)
            })

    df_cost = pd.DataFrame(cost_rows)
    df_metrics = pd.DataFrame(metric_rows)

    # 3. AWS Event Data
    events = [
        {
            "event_timestamp": (start_date + timedelta(days=35)).strftime("%Y-%m-%dT09:15:00Z"),
            "resource_id": "i-0newdeploy77",
            "event_type": "Infrastructure",
            "event_name": "RunInstances",
            "user_or_role": "arn:aws:iam::123456789012:role/DevOpsAdmin",
            "application": "Payment Gateway v2",
            "environment": "production"
        },
        {
            "event_timestamp": (start_date + timedelta(days=45)).strftime("%Y-%m-%dT14:30:00Z"),
            "resource_id": "i-0spike991122",
            "event_type": "Configuration",
            "event_name": "ConfigurationChange",
            "user_or_role": "arn:aws:iam::123456789012:user/developer-alex",
            "application": "Batch Experiment Server",
            "environment": "dev"
        },
        {
            "event_timestamp": (start_date + timedelta(days=30)).strftime("%Y-%m-%dT11:00:00Z"),
            "resource_id": "vol-0storagebloat01",
            "event_type": "Storage",
            "event_name": "ModifyVolume",
            "user_or_role": "arn:aws:iam::123456789012:role/AutoScaler",
            "application": "Log Archive Storage",
            "environment": "staging"
        }
    ]
    df_events = pd.DataFrame(events)

    # Write CSV files
    df_meta.to_csv(os.path.join(output_dir, "resource_metadata.csv"), index=False)
    df_cost.to_csv(os.path.join(output_dir, "aws_cost_usage.csv"), index=False)
    df_metrics.to_csv(os.path.join(output_dir, "resource_metrics.csv"), index=False)
    df_events.to_csv(os.path.join(output_dir, "aws_events.csv"), index=False)

    # Also save to data/synthetic
    df_meta.to_csv("data/synthetic/resource_metadata.csv", index=False)
    df_cost.to_csv("data/synthetic/aws_cost_usage.csv", index=False)
    df_metrics.to_csv("data/synthetic/resource_metrics.csv", index=False)
    df_events.to_csv("data/synthetic/aws_events.csv", index=False)

    # Parquet files
    df_cost.to_parquet(os.path.join(output_dir, "aws_cost_usage.parquet"), index=False)
    df_metrics.to_parquet(os.path.join(output_dir, "resource_metrics.parquet"), index=False)

    print(f"Successfully generated synthetic datasets in '{output_dir}' and 'data/synthetic/'!")
    print(f"Total cost records: {len(df_cost)}")
    print(f"Total metric records: {len(df_metrics)}")
    print(f"Total metadata records: {len(df_meta)}")
    print(f"Total event records: {len(df_events)}")

if __name__ == "__main__":
    generate_datasets()
