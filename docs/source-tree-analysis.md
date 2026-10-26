# alphagaldata - Source Tree Analysis

**Date:** 2026-04-16

## Overview

This repository is a single Gatsby application. Code is concentrated under `src/`, authored content under `content/`, public assets under `static/`, automation under `scripts/`, and AWS infrastructure under `tf/`. Generated or transient directories such as `node_modules/`, `public/`, and `.cache/` should not be treated as source-of-truth project structure.

## Complete Directory Structure

```text
.
├── _bmad/
├── _bmad-output/
├── config/
│   └── affiliates.json
├── content/
│   ├── 2025/
│   └── recipes/
├── docs/
├── scripts/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   │   ├── cards/
│   │   └── learn/
│   ├── styles/
│   ├── templates/
│   └── types/
├── static/
│   ├── admin/
│   ├── data/
│   ├── downloads/
│   ├── pins/
│   └── uploads/
├── tf/
├── gatsby-browser.js
├── gatsby-config.ts
├── gatsby-node.js
├── gatsby-ssr.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Critical Directories

### `src/pages`

Primary route entry points for the Gatsby site. Contains static pages, TSX utilities, MDX pages, and nested route groups such as `/cards` and `/learn`.

**Purpose:** Route-level UI and page metadata
**Contains:** Home page, scanner, maps, downloads, testing, auth, recipe index, static legal pages
**Entry Points:** `src/pages/index.tsx`, `src/pages/recipes.tsx`, `src/pages/scanner.tsx`, `src/pages/heat-map.tsx`

### `src/components`

Reusable UI and interactive client modules.

**Purpose:** Shared layout, SEO, map widgets, cookie consent, icons, auth wrapper
**Contains:** `Layout`, `SEO`, `HeatMap`, `TimelineMap`, `CookieConsent`, icon set

### `src/templates`

Gatsby page templates used by `gatsby-node.js` when creating content-driven pages.

**Purpose:** Render recipe and article MDX content
**Contains:** `recipe.tsx`, `learn-article.tsx`
**Integration:** Connected to `content/` via GraphQL queries and `createPages`

### `content`

Source-authored MDX files that become generated routes.

**Purpose:** Editorial and recipe publishing
**Contains:** Recipe MDX files plus long-form article content

### `src/data`

Structured datasets checked into the repo and bundled or imported by application code.

**Purpose:** Tick map data, timeline data, ingredient data, images
**Contains:** `ingredients.json`, `lone_star_ticks.geojson`, `us_counties.geojson`, `us_states.json`, `ags-timeline.json`

### `static`

Public assets copied directly into the built site.

**Purpose:** Decap CMS admin app, downloadable PDFs/SVGs, pre-generated pins, public GeoJSON
**Contains:** `static/admin/config.yml`, `static/downloads/*`, `static/pins/*`, `static/data/lone_star_ticks.geojson`

### `scripts`

Node and shell automation for data prep, card generation, image generation, and deployment.

**Purpose:** Keep datasets and downloadable assets current; publish the site
**Contains:** GeoJSON transforms, PubMed fetch, ingredient sync, PDF generation, S3 deploy script

### `tf`

Infrastructure-as-code for the production AWS footprint.

**Purpose:** CloudFront, S3 access control, Route53, ACM, Cognito, SES, Lambda email forwarding
**Contains:** `main.tf`, `cognito.tf`, `email.tf`, `variables.tf`, `outputs.tf`

## Entry Points

- **Main Entry:** `src/pages/index.tsx`
- **Additional:**
  - `gatsby-config.ts`: Gatsby plugin and site metadata configuration
  - `gatsby-node.js`: content-driven page creation and post-build sitemap copy
  - `gatsby-browser.js` / `gatsby-ssr.js`: Gatsby runtime wrappers
  - `static/admin/index.html`: Decap CMS admin shell

## File Organization Patterns

- Route pages live in `src/pages/` and usually compose shared layout wrappers.
- Content that needs custom rendering is authored in `content/` and mapped through GraphQL templates.
- Browser-only libraries are isolated in components and loaded lazily at runtime.
- Public, download, and CMS assets are kept under `static/` rather than imported into the bundle.
- Infra and deployment concerns are intentionally outside application source in `tf/` and `scripts/`.

## Key File Types

### Gatsby / app config

- **Pattern:** `gatsby-*.{js,ts}`, `*.config.{js,ts}`, `tsconfig.json`
- **Purpose:** Build behavior, plugins, routing, and typing
- **Examples:** `gatsby-config.ts`, `gatsby-node.js`, `tailwind.config.js`

### Route pages

- **Pattern:** `src/pages/**/*.{tsx,mdx}`
- **Purpose:** First-class site routes and legal/content pages
- **Examples:** `src/pages/scanner.tsx`, `src/pages/learn/faq.mdx`

### Content files

- **Pattern:** `content/**/*.mdx`, `content/**/*.md`
- **Purpose:** Long-form articles and recipes
- **Examples:** `content/recipes/2026-02-26-colorado-green-chili.mdx`

### Structured datasets

- **Pattern:** `src/data/*.{json,geojson}`
- **Purpose:** Map layers, ingredient data, timeline data
- **Examples:** `src/data/lone_star_ticks.geojson`, `src/data/ingredients.json`

### Public assets

- **Pattern:** `static/**`
- **Purpose:** Files served as-is from the built site
- **Examples:** `static/downloads/ags_wallet_card_v1.pdf`, `static/pins/what-is-alpha-gal.png`

### Infrastructure code

- **Pattern:** `tf/*.tf`
- **Purpose:** AWS provisioning and configuration
- **Examples:** `tf/main.tf`, `tf/cognito.tf`, `tf/email.tf`

## Asset Locations

- **Downloads and printable assets:** `static/downloads/`
- **Pinterest/social graphics:** `static/pins/`
- **Uploaded CMS media:** `static/uploads/`
- **Public map data copy:** `static/data/`
- **Bundled app data assets:** `src/data/`

## Configuration Files

- **`package.json`**: npm scripts, dependencies, build entrypoints
- **`gatsby-config.ts`**: site metadata, plugins, sitemap, offline, S3 deploy plugin
- **`tsconfig.json`**: strict TypeScript configuration
- **`tailwind.config.js` / `postcss.config.js`**: styling toolchain
- **`.env.example`**: analytics and Cognito public env variables
- **`static/admin/config.yml`**: Decap CMS S3 backend and recipe collection schema
- **`config/affiliates.json`**: affiliate program placement data for downloads/products pages

## Notes for Development

- Ignore `.cache/`, `public/`, and local Terraform state when documenting or editing source behavior.
- Route/content behavior is split between file-system pages and `gatsby-node.js` generated pages.
- Changes to data structures often require coordinated updates across `src/data`, scripts, and UI consumers.

---

_Generated using BMAD Method `document-project` workflow_
