output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (use this URL to access the website)"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "cloudfront_distribution_domain" {
  description = "Raw CloudFront distribution domain (target for DNS alias/CNAME)"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "configured_aliases" {
  description = "Configured CloudFront custom domain aliases"
  value       = aws_cloudfront_distribution.website.aliases
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.website.id
}
