"""
Uploads local CSV/Parquet datasets to Amazon S3 for CostGuard-X.
Supports AWS Learner Lab / Student Access credentials (with Session Token).
"""
import os
import sys
import boto3
from botocore.exceptions import ClientError

# Ensure sys.path includes root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.utils.logger import get_logger

logger = get_logger("S3Uploader")

def upload_data_to_s3(
    bucket_name: str = "costguard-x-data-storage-production",
    local_dir: str = "data/sample",
    region: str = "us-east-1"
):
    logger.info(f"Connecting to S3 region '{region}'...")
    
    # Read environment variables (supports AWS Session Token for student accounts)
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_session_token = os.getenv("AWS_SESSION_TOKEN")

    session_kwargs = {"region_name": region}
    if aws_access_key and aws_secret_key:
        session_kwargs["aws_access_key_id"] = aws_access_key
        session_kwargs["aws_secret_access_key"] = aws_secret_key
        if aws_session_token:
            session_kwargs["aws_session_token"] = aws_session_token

    s3_client = boto3.client("s3", **session_kwargs)

    # 1. Ensure bucket exists
    try:
        s3_client.head_bucket(Bucket=bucket_name)
        logger.info(f"S3 Bucket '{bucket_name}' exists.")
    except ClientError as e:
        error_code = int(e.response["Error"]["Code"])
        if error_code == 404:
            logger.info(f"Creating S3 Bucket '{bucket_name}' in '{region}'...")
            if region == "us-east-1":
                s3_client.create_bucket(Bucket=bucket_name)
            else:
                s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={"LocationConstraint": region}
                )
        else:
            logger.error(f"S3 Bucket Error: {e}")
            raise e

    # 2. Upload sample datasets to S3 raw/ prefix
    files_to_upload = [
        "aws_cost_usage.csv",
        "aws_cost_usage.parquet",
        "resource_metrics.csv",
        "resource_metrics.parquet",
        "resource_metadata.csv",
        "aws_events.csv"
    ]

    for fname in files_to_upload:
        local_path = os.path.join(local_dir, fname)
        if os.path.exists(local_path):
            s3_key = f"raw/{fname}"
            logger.info(f"Uploading '{local_path}' -> 's3://{bucket_name}/{s3_key}'...")
            s3_client.upload_file(local_path, bucket_name, s3_key)
        else:
            logger.warning(f"File '{local_path}' not found. Skipping.")

    logger.info("S3 Dataset Upload complete.")

if __name__ == "__main__":
    bucket = os.getenv("S3_BUCKET_NAME", "costguard-x-data-storage-production")
    reg = os.getenv("AWS_REGION", "us-east-1")
    upload_data_to_s3(bucket_name=bucket, region=reg)
