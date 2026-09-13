# CostGuard-X Dataset Specifications & Synthetic Scenarios

## 1. Dataset Flow

```
Excel (.xlsx)  -->  CSV / Parquet  -->  Local data/sample  -->  S3 Bucket  -->  FastAPI / Lambda Engine
```

The system natively loads both `.csv` and `.parquet` file formats.

---

## 2. Dataset Schemas

### Cost & Usage Data (`aws_cost_usage.csv` / `.parquet`)
- `timestamp`: ISO 8601 UTC timestamp string (`YYYY-MM-DDTHH:MM:SSZ`)
- `account_id`: 12-digit AWS account ID (`123456789012`)
- `region`: AWS region code (`us-east-1`, `us-west-2`)
- `service`: AWS service name (`EC2`, `RDS`, `EBS`, `S3`)
- `resource_id`: Unique AWS resource identifier (`i-0dev123456789a`, `db-overprov-prod01`)
- `resource_type`: Instance type or volume tier (`t3.xlarge`, `db.r5.2xlarge`, `gp3`)
- `usage_type`: AWS usage type (`Hrs`, `GB-Mo`)
- `usage_quantity`: Numerical usage quantity
- `cost`: Billed cost in USD
- `currency`: Currency code (`USD`)
- `environment`: Deployment stage (`dev`, `test`, `staging`, `production`)
- `application`: Business application name

### Resource Metrics (`resource_metrics.csv` / `.parquet`)
- `timestamp`: ISO 8601 UTC timestamp string
- `resource_id`: AWS resource ID
- `cpu_utilization`: Average CPU load (0.0% - 100.0%)
- `memory_utilization`: Average RAM load (0.0% - 100.0%)
- `network_in`: Network ingress bytes
- `network_out`: Network egress bytes
- `disk_read`: Disk read operations
- `disk_write`: Disk write operations
- `storage_gb`: Provisioned storage size in GB
- `request_count`: Total API/user request volume
- `runtime_hours`: Operating hours per day (0.0 - 24.0)

### Resource Metadata (`resource_metadata.csv`)
- `resource_id`, `service`, `resource_type`, `instance_type`, `region`, `environment`, `application`, `owner`

### AWS Events Log (`aws_events.csv`)
- `event_timestamp`, `resource_id`, `event_type`, `event_name`, `user_or_role`, `application`, `environment`

---

## 3. Synthetic Test Scenarios Included

1. **Scenario 1: Idle Resource** (`i-0dev123456789a` - EC2 dev instance running 24h continuous with 3-6% CPU, $14.50/day).
2. **Scenario 2: Over-provisioned Resource** (`db-overprov-prod01` - RDS r5.2xlarge instance costing $48/day with 12% CPU, 18% RAM).
3. **Scenario 3: Non-production Waste** (`i-0nonprod998877` - QA server running 24h continuous over weekends with low load).
4. **Scenario 4: Abnormal Storage Growth** (`vol-0storagebloat01` - EBS storage expanding from 100GB to 5TB with minimal request growth).
5. **Scenario 5: Legitimate Business Growth** (`i-0prodapp0123` - Cost increasing from $22 to $55/day accompanied by 5x request volume growth).
6. **Scenario 6: Sudden Cost Spike** (`i-0spike991122` - Baseline $6/day jumping to $88.50/day after a `ConfigurationChange` event).
7. **Scenario 7: New Resource Deployment** (`i-0newdeploy77` - Created recently via `RunInstances` event).
8. **Scenario 8: High-cost High-utilization Legitimate Resource** (`i-0heavyworker01` - Costing $135/day at 88% CPU load under heavy ETL batch processing).
