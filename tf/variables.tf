variable "domain_name" {
  description = "Primary domain for the site (apex)"
  type        = string
  default     = "alphagaldata.com"
}

variable "include_www" {
  description = "Also configure www subdomain as an alias"
  type        = bool
  default     = true
}

variable "aws_region" {
  description = "Default AWS region for Route53 (global), S3 policy, etc."
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket" {
  description = "Existing S3 bucket name hosting the site content"
  type        = string
  default     = "alphagal"
}

variable "s3_bucket_region" {
  description = "Region where the S3 bucket lives (for the origin domain)"
  type        = string
  default     = "us-east-1"
}

variable "manage_bucket_policy" {
  description = "If true, attach an S3 bucket policy granting CloudFront OAC read access"
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "comment" {
  description = "Optional CloudFront distribution comment"
  type        = string
  default     = "AlphaGalData site via CloudFront"
}

