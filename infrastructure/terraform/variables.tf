variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS Region for serverless CostGuard-X infrastructure"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment stage"
}

variable "project_name" {
  type        = string
  default     = "costguard-x"
  description = "Project resource name prefix"
}

variable "aws_access_key" {
  type        = string
  default     = ""
  sensitive   = true
  description = "AWS Access Key ID"
}

variable "aws_secret_key" {
  type        = string
  default     = ""
  sensitive   = true
  description = "AWS Secret Access Key"
}

variable "aws_session_token" {
  type        = string
  default     = ""
  sensitive   = true
  description = "AWS Session Token (Required for AWS Student / Learner Lab accounts)"
}
