#!/usr/bin/env bash
set -euo pipefail

# Deploy Gatsby build to S3 with sensible cache headers.
# Requires: AWS CLI v2 installed and configured (aws configure), Gatsby installed via npm scripts.
# Usage:
#   S3_BUCKET=alphagal S3_REGION=us-east-1 CF_DISTRIBUTION_ID=E123... ./scripts/deploy_s3.sh

S3_BUCKET=${S3_BUCKET:-}
S3_REGION=${S3_REGION:-${AWS_REGION:-us-east-1}}
CF_DISTRIBUTION_ID=${CF_DISTRIBUTION_ID:-}

if [[ -z "$S3_BUCKET" ]]; then
  echo "Error: S3_BUCKET environment variable is required (e.g., alphagal)" >&2
  exit 1
fi

echo "Building Gatsby site..."
npm run build

echo "Syncing non-HTML assets to s3://$S3_BUCKET with long cache..."
aws s3 sync public "s3://$S3_BUCKET" \
  --region "$S3_REGION" \
  --delete \
  --size-only \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"

echo "Syncing HTML to s3://$S3_BUCKET with no-cache..."
aws s3 sync public "s3://$S3_BUCKET" \
  --region "$S3_REGION" \
  --delete \
  --exact-timestamps \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"

if [[ -n "$CF_DISTRIBUTION_ID" ]]; then
  echo "Creating CloudFront invalidation for /* on distribution $CF_DISTRIBUTION_ID ..."
  aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*" >/dev/null
  echo "Invalidation requested."
else
  echo "CF_DISTRIBUTION_ID not set; skipping CloudFront invalidation."
fi

echo "Deploy complete."

