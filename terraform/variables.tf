variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket (must be globally unique, only lowercase letters, numbers, and hyphens)"
  type        = string
  default     = "web-aws-group-manizales"
}

variable "domain_aliases" {
  description = "Custom domain aliases (CNAMEs) for CloudFront, e.g. [\"awsug.cloud-manizales.com\"]"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for CloudFront custom domains. Leave empty to use default CloudFront certificate."
  type        = string
  default     = ""
}
