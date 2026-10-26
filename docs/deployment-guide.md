# AlphaGalData Deployment Guide

**Date:** 2026-04-16

## Hosting Model

The site is built as static Gatsby output and deployed to an S3 bucket fronted by CloudFront. Terraform manages the main AWS infrastructure, while `scripts/deploy_s3.sh` handles artifact publishing.

## Build Pipeline

### Production build

```bash
npm run build
```

This performs:

1. `npm run prepare:data`
2. Gatsby static build into `public/`

## Publish Flow

### Scripted deploy

```bash
S3_BUCKET=alphagal \
S3_REGION=us-east-1 \
CF_DISTRIBUTION_ID=<distribution-id> \
./scripts/deploy_s3.sh
```

### What the script does

- builds the site
- syncs non-HTML files to S3 with long-lived immutable cache headers
- syncs HTML with `must-revalidate` semantics
- uploads `ads.txt` with explicit content type
- optionally creates a full CloudFront invalidation

## Gatsby S3 Plugin

`gatsby-config.ts` also configures `gatsby-plugin-s3` with cache-control defaults and deployment metadata. The shell script is the clearer operational path because it makes the publish sequence explicit.

## Infrastructure Modules

### `tf/main.tf`

- ACM certificate in `us-east-1`
- CloudFront distribution
- CloudFront viewer-request function rewriting directory-style paths to `index.html`
- Route53 `A` and `AAAA` aliases
- optional S3 bucket policy tied to CloudFront OAC

### `tf/cognito.tf`

- Cognito user pool
- Cognito domain
- browser app client for OIDC code flow

### `tf/email.tf`

- SES inbound mail setup
- S3 bucket for raw email
- Lambda email forwarder
- Route53 verification, MX, SPF, and DMARC records

## Environment and Secrets Considerations

- Frontend env vars are public Gatsby variables and safe for client distribution
- AWS credentials for deploys and Terraform are not stored in this repo
- Local Terraform state files exist in `tf/` and should be handled carefully outside version-control hygiene work

## Operational Notes

- CloudFront invalidation is optional but important when service worker or cached assets could mask fresh deploys
- `gatsby-plugin-offline` is enabled only in production, which is useful but can complicate smoke-testing after releases
- The deploy script assumes the S3 bucket already exists

## Recommended Validation After Deploy

- load homepage and a few deep routes
- verify `/recipes`, `/scanner`, `/heat-map`, and `/downloads`
- confirm `sitemap.xml` exists
- confirm static assets and downloadable PDFs resolve
- verify Cognito auth route if auth-related changes were included

## Missing CI/CD

There is no checked-in GitHub Actions or equivalent pipeline for automated deploy/test orchestration. Deploys appear to be operator-driven. For a more robust production path, add:

- CI checks for lint/typecheck/build
- automated deploy on trusted branch merges
- cache-aware post-deploy smoke checks

---

_Generated using BMAD Method `document-project` workflow_
