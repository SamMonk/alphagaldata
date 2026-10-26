# AlphaGalData Development Guide

**Date:** 2026-04-16

## Prerequisites

- Node.js 20 or newer
- npm
- AWS CLI v2 for deploys
- Terraform for infra changes

## Install

```bash
npm install
```

## Environment Variables

Public environment variables are documented in `.env.example`.

### Analytics

- `GATSBY_GA4_MEASUREMENT_ID`
- `GATSBY_GTM_CONTAINER_ID` is referenced in `README.md` as optional future/current usage

### Cognito OIDC

- `GATSBY_COGNITO_AUTHORITY`
- `GATSBY_COGNITO_CLIENT_ID`
- `GATSBY_COGNITO_REDIRECT_URI`
- `GATSBY_COGNITO_LOGOUT_URI`
- `GATSBY_COGNITO_DOMAIN`
- `GATSBY_COGNITO_SCOPE`

### Data sync

- `INGREDIENTS_SOURCE` optionally overrides the default ingredient dataset source path

### Deploy

- `S3_BUCKET`
- `S3_REGION`
- `CF_DISTRIBUTION_ID`
- `SITE_URL`
- `DEPLOY_HOSTNAME`

## Local Development

### Start Gatsby

```bash
npm run dev
```

### Important workflow note

`npm run build` automatically runs `npm run prepare:data`, which copies the ingredient dataset from a sibling repo path by default. If that dataset is missing, the sync script warns and skips; this behavior should be understood before assuming local build data freshness.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Project Commands

### Core app

- `npm run dev` - start Gatsby dev server
- `npm run build` - sync ingredients then build production site
- `npm run serve` - serve built site
- `npm run format` - format repository with Prettier
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint run

### Data and asset tasks

- `npm run tasks:cards`
- `npm run tasks:pubmed`
- `npm run tasks:cdc`
- `npm run tasks:xlsx`
- `npm run tasks:counties`
- `npm run tasks:map`
- `npm run tasks:states`
- `npm run tasks:pins`

## Content Workflow

### Recipes

- Recipe source lives in `content/recipes/`
- Gatsby queries recipe MDX and routes them through `src/templates/recipe.tsx`
- Decap CMS config is in `static/admin/config.yml`
- Uploaded images land in `static/uploads/`

### Learn content

- Direct file-routed MDX pages live under `src/pages/learn/`
- Additional routed article content can be added under `content/`

## Development Conventions

- Prefer TypeScript for new source files
- Avoid direct SSR imports of browser-only libraries such as Leaflet, ZXing, and Tesseract
- Keep reusable page chrome inside `Layout`
- Prefer file-based content and config-driven pages over hardcoding repeated structures

## Auth and CMS Notes

- `src/pages/auth.tsx` is the smoke-test page for Cognito/OIDC wiring
- `src/components/auth-provider-wrapper.js` is the SSR guard for the auth provider
- Recipe editing paths depend on authenticated users belonging to the `editors` group

## Testing Reality

The repo does not include automated unit or end-to-end tests today. The effective regression checks are:

- typecheck
- lint
- production build
- manual browser validation of scanner, maps, and content routes

If you add riskier interactive behavior, adding QA automation should be considered part of the same work.

## Common Change Areas

### Add or update content

Edit `src/pages/learn/*.mdx` or `content/**/*.mdx`.

### Add a new interactive tool

Use a TSX route or component under `src/pages/` or `src/components/`, and isolate browser-only dependencies behind `useEffect` or hydration guards.

### Update map data

Regenerate or replace inputs under `src/data/` and `static/data/` using the scripts in `scripts/`.

### Update hosting or auth

Modify Terraform files under `tf/` and keep public env/config values aligned.

---

_Generated using BMAD Method `document-project` workflow_
