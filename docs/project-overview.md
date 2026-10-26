# alphagaldata - Project Overview

**Date:** 2026-04-16
**Type:** web
**Architecture:** Gatsby static site with MDX publishing, client-side utilities, and AWS hosting

## Executive Summary

AlphaGalData is a content-heavy Gatsby site focused on alpha-gal syndrome education and practical utilities. The repository mixes editorial content, downloadable assets, affiliate/product pages, a barcode and OCR-assisted ingredient scanner, and geo-visualization of lone star tick spread. Operationally, it remains a single deployable frontend codebase with build-time content sourcing and a small set of supporting Node scripts and Terraform infrastructure.

## Project Classification

- **Repository Type:** monolith
- **Project Type(s):** web
- **Primary Language(s):** TypeScript, JavaScript, MDX, Terraform, YAML
- **Architecture Pattern:** static-first component hierarchy with client-only interactive islands

## Technology Stack Summary

| Category | Technology | Version | Why It Exists |
| --- | --- | --- | --- |
| Site framework | Gatsby | `^5.13.0` | Static generation, MDX page sourcing, Gatsby page APIs |
| UI | React | `^18.2.0` | Component rendering and client interactivity |
| Language | TypeScript | `^5.5.4` | Strict typing for most application code |
| Styling | Tailwind CSS | `^3.4.9` | Utility-first styling across pages/components |
| Content | MDX + gray-matter | Gatsby plugin + `^4.0.3` | Editorial pages and recipe content |
| Maps | Leaflet + react-leaflet | `^1.9.4` / `^4.2.1` | Client-side county/state map rendering |
| Barcode / OCR | `@zxing/browser`, `tesseract.js` | `^0.1.4`, `^7.0.0` | Ingredient scanner camera and image decoding |
| Auth | `react-oidc-context`, `oidc-client-ts` | `^2.4.0`, `^2.4.1` | Cognito-backed editor auth flow |
| Build tooling | ESLint, Prettier, PostCSS | current repo versions | Linting, formatting, CSS compilation |
| Infrastructure | Terraform + AWS | provider `~> 5.0` | CloudFront/S3, Cognito, SES, Route53 |

## Key Features

- Editorial `/learn` content authored in MDX
- Recipe catalog sourced from `content/recipes/` with recipe-specific template rendering
- Ingredient scanner with watchlist logic, barcode scanning, and OCR fallback
- County-level heat map and state-level spread timeline visualization
- Download center for printable cards, tattoo designs, and branded assets
- Product recommendation and affiliate content
- Cognito-backed auth test flow and Decap CMS config for recipe management

## Architecture Highlights

- Gatsby sources both page MDX and content MDX, then `gatsby-node.js` creates routed pages for recipe and article content.
- Interactive browser-only libraries are deferred to client-side `useEffect` patterns to avoid Gatsby SSR failures.
- Data is mostly file-based: JSON, GeoJSON, MDX, and static assets under source control.
- There is no internal backend API in this repo; runtime integrations are browser fetches, third-party links, and AWS-managed services.
- Infrastructure is split: shell deploy script for site publishing and Terraform for AWS resource lifecycle.

## Development Overview

### Prerequisites

- Node.js 20+
- npm
- AWS CLI for deploys
- Terraform when modifying infrastructure

### Getting Started

Install dependencies, start Gatsby in development mode, and use typecheck/lint/build for validation. The build pipeline copies ingredient data before static generation, so local or CI environments need a valid ingredient dataset or must accept the script’s skip behavior.

### Key Commands

- **Install:** `npm install`
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npm run typecheck && npm run lint`

## Repository Structure

The repo is centered on `src/` for pages/components, `content/` for authored recipes/articles, `static/` for public assets and Decap CMS, `scripts/` for one-off data/asset generation, and `tf/` for AWS infrastructure. There are no separate client/server packages or workspace boundaries.

## Documentation Map

For detailed information, see:

- [index.md](./index.md) - Master documentation index
- [architecture.md](./architecture.md) - Detailed architecture
- [source-tree-analysis.md](./source-tree-analysis.md) - Directory structure
- [development-guide.md](./development-guide.md) - Development workflow

---

_Generated using BMAD Method `document-project` workflow_
