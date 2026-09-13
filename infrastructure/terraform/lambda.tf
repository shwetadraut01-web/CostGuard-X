resource "aws_lambda_function" "backend_api" {
  function_name = "${var.project_name}-backend-api"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "backend.app.main.app"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 512

  filename         = "lambda_payload.zip"
  source_code_hash = filebase64sha256("lambda_payload.zip")

  environment {
    variables = {
      APP_MODE        = "aws"
      ENABLE_BEDROCK  = "true"
      AWS_REGION_NAME = var.aws_region
    }
  }
}
