# AlphaGalData API Contracts

**Date:** 2026-04-16

## Summary

This repository does not define an internal application server or REST/GraphQL API. Runtime integration is client-driven and centered on static assets, browser APIs, and third-party services.

## Internal Runtime Interfaces

### Map dataset fetch

- **Consumer:** `src/components/HeatMap.tsx`
- **Method:** `GET`
- **Path:** `/data/lone_star_ticks.geojson`
- **Response shape:** GeoJSON `FeatureCollection`
- **Fallback:** if fetch fails, component imports `src/data/lone_star_ticks.sample.json`

Expected feature properties include:

- `GEOID`
- `state`
- `county`
- `status`
- `source`

### Gatsby GraphQL content queries

Build-time only, not public runtime APIs.

#### Recipe index query

- **Consumer:** `src/pages/recipes.tsx`
- **Source:** `allMdx`
- **Filter:** content file path matches `/content/recipes/`
- **Fields:** `title`, `slug`, `description`, `servings`, `prep_time`, `cook_time`, `image`

#### Template queries

- **Consumer:** `src/templates/recipe.tsx`, `src/templates/learn-article.tsx`
- **Source:** `mdx(id: { eq: $id })`
- **Purpose:** load frontmatter and page content for generated routes

## External Service Contracts

### Cognito OIDC

- **Consumer:** `src/components/auth-provider-wrapper.js`, `src/pages/auth.tsx`
- **Flow:** Authorization Code flow
- **Key inputs:** authority, client ID, redirect URI, logout URI, domain, scope
- **User-facing behaviors:** sign-in redirect, local sign-out, Cognito logout redirect

### Decap CMS S3 backend

- **Config:** `static/admin/config.yml`
- **Backend type:** `s3`
- **Artifacts:** recipe entries written to `content/recipes/`, uploaded media to `static/uploads/`
- **Auth dependency:** Cognito-backed config values in the CMS backend definition

### Barcode and OCR browser APIs

- **Consumer:** `src/pages/scanner.tsx`
- **Libraries:** `@zxing/browser`, `tesseract.js`
- **Device contract:** requires browser camera permissions for live scan mode
- **Fallback path:** uploaded image decode and manual text paste workflow

### External reference links

The site links to third-party informational or commerce endpoints rather than proxying them:

- CDC alpha-gal pages
- Labcorp and Quest directories
- AAAAI and ACAAI provider finders
- Amazon affiliate search URLs

## Missing Internal API Surface

The documentation requirement for web projects expects API scanning, but this repo currently has:

- no `api/`, `routes/`, or `controllers/` directory
- no custom backend handlers
- no serverless function source in the app itself

That means future full-stack work will either need a new backend surface or continued reliance on static/public data artifacts and external services.

## Risks and Implications

- Contract stability depends on file paths and dataset shapes rather than typed server APIs
- Build-time GraphQL queries are tightly coupled to MDX frontmatter keys
- Scanner behavior depends on browser capabilities and third-party library compatibility

---

_Generated using BMAD Method `document-project` workflow_
