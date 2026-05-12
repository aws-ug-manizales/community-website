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
  description = "Custom domain aliases (CNAMEs) for CloudFront. The site has a single environment, so the real value is the default; override only when testing locally."
  type        = list(string)
  default     = ["awsug.cloud-manizales.com"]
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN in us-east-1 covering the aliases above. The site has a single environment, so the real value is the default. Set to \"\" to fall back to the default CloudFront certificate."
  type        = string
  default     = "arn:aws:acm:us-east-1:746669207643:certificate/83630519-ebb5-4af8-b8dd-e23224e477a7"
}
