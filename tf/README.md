# AlphaGalData CloudFront + S3 (Terraform)

This Terraform stack provisions a CloudFront distribution fronting the existing S3 bucket `alphagal`, an ACM certificate for `alphagaldata.com` (+ optional `www`), and Route 53 records for DNS validation and the CloudFront alias.

What it does
- ACM certificate in `us-east-1` with DNS validation
- CloudFront distribution using Origin Access Control (OAC) to private S3
- Route 53 records for certificate validation and `A`/`AAAA` aliases
- Optional S3 bucket policy that only allows CloudFront to read objects

Prereqs
- Hosted zone for `alphagaldata.com` exists in Route 53
- S3 bucket `alphagal` already exists and contains your build artifacts
- AWS credentials configured with permissions for ACM, CloudFront, Route53, and S3 policy

Usage
```bash
cd tf
terraform init
terraform plan \
  -var="domain_name=alphagaldata.com" \
  -var="s3_bucket=alphagal" \
  -var="s3_bucket_region=us-east-1"
terraform apply
```

Key variables
- `domain_name`: apex domain (default: `alphagaldata.com`)
- `include_www`: also alias `www.domain` (default: true)
- `s3_bucket`: existing bucket name (default: `alphagal`)
- `s3_bucket_region`: region of that bucket (default: `us-east-1`)
- `manage_bucket_policy`: attach restrictive bucket policy (default: true)
- `price_class`: CloudFront price class (default: `PriceClass_100`)

Notes
- CloudFront requires the certificate in `us-east-1`; this is handled via a provider alias.
- The bucket policy references the distribution ARN and will be created after the distribution is known.
- If your S3 bucket is publicly readable, set `manage_bucket_policy=false` and harden it manually later.
- Default behavior uses REST S3 origin with OAC; do not use the S3 static website endpoint with OAC.

Outputs
- `cloudfront_domain`: distribution domain for testing
- `cloudfront_distribution_id`: distribution ID
- `certificate_arn`: validated cert ARN
- `route53_zone_id`: hosted zone ID used
```
