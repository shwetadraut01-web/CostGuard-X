"""
Packages CostGuard-X Python backend, datasets, and analytical engine into a deployment zip
for AWS Lambda execution via Terraform.
"""
import os
import sys
import zipfile

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.utils.logger import get_logger

logger = get_logger("LambdaPackager")

def package_lambda(output_zip: str = "infrastructure/terraform/lambda_payload.zip"):
    logger.info(f"Creating Lambda deployment zip payload: '{output_zip}'...")
    
    os.makedirs(os.path.dirname(output_zip), exist_ok=True)

    dirs_to_pack = ["backend", "src", "config", "knowledge", "data"]
    
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for d in dirs_to_pack:
            if os.path.exists(d):
                for root, _, files in os.walk(d):
                    for file in files:
                        if file.endswith((".py", ".json", ".yaml", ".yml", ".csv", ".parquet")) and "__pycache__" not in root:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, ".")
                            zipf.write(file_path, arcname)

    logger.info(f"Lambda payload zip created successfully ({os.path.getsize(output_zip) / 1024:.1f} KB).")

if __name__ == "__main__":
    package_lambda()
