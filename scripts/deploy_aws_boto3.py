"""
Direct Python AWS Boto3 Serverless Deployer for CostGuard-X.
Deploys Lambda + Function URL (Live HTTPS Endpoint) using AWS Python SDK (boto3).
"""
import os
import sys
import boto3
from botocore.exceptions import ClientError

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.utils.logger import get_logger

logger = get_logger("Boto3Deployer")

from scripts.package_lambda import package_lambda

def deploy_to_aws():
    region = os.getenv("AWS_REGION", "us-east-1")
    logger.info(f"Deploying CostGuard-X serverless backend to AWS Region '{region}'...")

    # First package the payload zip
    zip_path = "infrastructure/terraform/lambda_payload.zip"
    package_lambda(output_zip=zip_path)

    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_session_token = os.getenv("AWS_SESSION_TOKEN")

    session_kwargs = {"region_name": region}
    if aws_access_key and aws_secret_key:
        session_kwargs["aws_access_key_id"] = aws_access_key
        session_kwargs["aws_secret_access_key"] = aws_secret_key
        if aws_session_token:
            session_kwargs["aws_session_token"] = aws_session_token

    lambda_client = boto3.client("lambda", **session_kwargs)

    fn_name = "costguard-x-backend-api"
    handler_name = "backend.app.main.lambda_handler"
    
    # Read payload zip bytes
    with open(zip_path, "rb") as f:
        zip_bytes = f.read()

    # 1. Check or Update Lambda Function
    try:
        fn_res = lambda_client.get_function(FunctionName=fn_name)
        fn_arn = fn_res["Configuration"]["FunctionArn"]
        logger.info(f"Found live Lambda Function: {fn_arn}. Updating code & handler...")
        
        # Update function code
        lambda_client.update_function_code(
            FunctionName=fn_name,
            ZipFile=zip_bytes
        )
        
        # Update function configuration (handler)
        lambda_client.update_function_configuration(
            FunctionName=fn_name,
            Handler=handler_name,
            Timeout=30,
            MemorySize=512
        )
    except ClientError as e:
        logger.error(f"Error accessing or updating Lambda function '{fn_name}': {e}")
        return

    # 2. Create or Get Live Lambda Function URL (Direct HTTPS Endpoint)
    try:
        url_res = lambda_client.get_function_url_config(FunctionName=fn_name)
        fn_url = url_res["FunctionUrl"]
        logger.info(f"Found existing Lambda Function URL: {fn_url}")
    except ClientError:
        logger.info(f"Creating Function URL (Live HTTPS Endpoint) for '{fn_name}'...")
        url_res = lambda_client.create_function_url_config(
            FunctionName=fn_name,
            AuthType="NONE",
            Cors={
                "AllowOrigins": ["*"],
                "AllowMethods": ["*"],
                "AllowHeaders": ["*"]
            }
        )
        fn_url = url_res["FunctionUrl"]

    # 3. Add public permission for Function URL
    try:
        # Remove existing statement if present to ensure clean state
        try:
            lambda_client.remove_permission(
                FunctionName=fn_name,
                StatementId="FunctionURLAllowPublicAccess"
            )
        except ClientError:
            pass

        lambda_client.add_permission(
            FunctionName=fn_name,
            StatementId="FunctionURLAllowPublicAccess",
            Action="lambda:InvokeFunctionUrl",
            Principal="*",
            FunctionUrlAuthType="NONE"
        )
        logger.info("Public invoke permission attached successfully.")
    except ClientError as e:
        logger.warning(f"Could not attach public permission (may already exist): {e}")

    logger.info("==================================================================")
    logger.info("🎉 SUCCESS! Your CostGuard-X Live AWS Cloud Backend is LIVE:")
    logger.info(f"LIVE AWS ENDPOINT URL: {fn_url}")
    logger.info(f"SUMMARY API: {fn_url}api/summary")
    logger.info("==================================================================")

if __name__ == "__main__":
    deploy_to_aws()

