# Deploy to S3/CloudFront

This repo includes a simple, AWS-CLI–based deployment that builds the Gatsby site and syncs the output to your S3 bucket with optimal caching headers.

Prerequisites
- AWS CLI v2 installed and authenticated (`aws configure`).
- S3 bucket exists (default used here: `alphagal`).
- Optional: CloudFront distribution ID if you want to invalidate after deploy.

Build and deploy
```
# One-time install
npm install

# Option A: use the npm script (edit bucket/region inside package.json if needed)
npm run deploy:s3

# Option B: call the script with env vars
S3_BUCKET=alphagal \
S3_REGION=us-east-1 \
CF_DISTRIBUTION_ID=E123YOURDISTID \
./scripts/deploy_s3.sh
```

What the script does
- Runs `gatsby build` to produce `public/`.
- Syncs non-HTML assets with long-term caching: `public, max-age=31536000, immutable`.
- Syncs HTML with no-cache: `public, max-age=0, must-revalidate`.
- Optionally invalidates your CloudFront distribution at `/*` if `CF_DISTRIBUTION_ID` is set.

Notes
- Do not set public ACLs if you are using CloudFront Origin Access Control (OAC); the script does not change ACLs.
- If your distribution is fronting the S3 REST origin (recommended with OAC), this deploy flow is compatible.
- Consider setting up a CI workflow to run this on merges to main and automatically invalidate CloudFront.

