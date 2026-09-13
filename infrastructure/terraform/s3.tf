# S3 bucket configuration (Optional storage layer)
# If bucket creation is restricted by workshop lab policies, Lambda runs self-contained from lambda_payload.zip.

output "s3_info" {
  value = "Data embedded in Lambda payload; S3 optional."
}
