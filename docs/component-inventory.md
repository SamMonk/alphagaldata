# AlphaGalData Component Inventory

**Date:** 2026-04-16

## Shared Components

### `src/components/Layout.tsx`

Global shell component. Owns header navigation, disclosure bar, footers, page wrapper, `SEO`, and cookie consent integration.

### `src/components/SEO.tsx`

Shared metadata helper for title, description, canonical URL, and social tags.

### `src/components/CookieConsent.tsx`

Consent banner component used at the layout level.

### `src/components/TopicLayout.tsx`

Alternate article/content wrapper for topic-style pages.

### `src/components/icons.tsx`

Internal SVG icon library used by downloads, testing, and other pages.

## Interactive Feature Components

### `src/components/HeatMap.tsx`

County-level map UI. Dynamically loads Leaflet/react-leaflet, fetches GeoJSON from `/data/lone_star_ticks.geojson`, provides filtering, selection, and legends.

### `src/components/TimelineMap.tsx`

State-level spread/timeline visualization backed by `src/data/us_states.json` and timeline data.

### `src/components/auth-provider-wrapper.js`

Browser-only OIDC provider wrapper that prevents SSR failures.

## Key Page Routes

### `src/pages/index.tsx`

Marketing-style home page linking into recipes, scanner, maps, and educational content.

### `src/pages/recipes.tsx`

GraphQL-backed recipe index. Reads recipe MDX frontmatter and renders recipe cards.

### `src/pages/scanner.tsx`

Most complex page in the repo. Combines:

- manual ingredient text scanning
- barcode camera scanning
- uploaded image decoding
- OCR-assisted ingredient extraction
- watchlist matching and severity tiers

### `src/pages/heat-map.tsx`

Host page for `HeatMap`.

### `src/pages/testing.tsx`

Educational testing page with external clinical/testing links and branded iconography.

### `src/pages/downloads.tsx`

Config-driven asset catalog for wallet cards, dining cards, tattoo assets, and partner placements.

### `src/pages/recommended.tsx`

Curated affiliate-style product recommendations page using statically defined category/product metadata.

### `src/pages/auth.tsx`

OIDC smoke-test page for Cognito redirect/auth flows.

### `src/pages/submit-recipe.tsx`

Submission funnel page directing users toward recipe contribution.

### Other static/legal routes

- `about.mdx`
- `ads-and-cookies.mdx`
- `privacy.tsx`
- `terms.mdx`
- `disclosure.tsx`
- `/cards/index.tsx`
- `/learn/*.mdx`

## Content Templates

### `src/templates/recipe.tsx`

Recipe detail template with:

- frontmatter-driven content
- hardcoded safety banner
- ingredient and instructions rendering
- editor-only shortcut button for CMS users in the `editors` group
- schema.org recipe metadata

### `src/templates/learn-article.tsx`

Article template for non-recipe MDX content with article metadata and structured header rendering.

## Content Collections

### Recipes

- Source: `content/recipes/*.mdx`
- Managed by: Decap CMS collection `recipes`
- Rendered by: `src/templates/recipe.tsx`

### Articles

- Source: `content/**/*.mdx` and selected `src/pages/learn/*.mdx`
- Rendered by: direct page routing or `src/templates/learn-article.tsx`

## Scripts Inventory

### Data preparation

- `scripts/sync-ingredients.js`: copies ingredient dataset from sibling data source
- `scripts/prepare_counties.js`: generates county GeoJSON from `us-atlas`
- `scripts/prepare_states.js`: generates state GeoJSON/JSON from `us-atlas`
- `scripts/build_map_from_xlsx.js`: joins county geometry with surveillance spreadsheet data
- `scripts/convert_xlsx_to_geojson.js`: converts spreadsheet coordinate data into GeoJSON
- `scripts/fetch_cdc_ticks.js`: copies sample tick data into active dataset
- `scripts/fetch_pubmed.js`: fetches recent PubMed summaries for alpha-gal research

### Asset generation

- `scripts/generate_cards.js`: builds printable PDF cards
- `scripts/generate_pins.js`: generates social/Pinterest images

### Deployment

- `scripts/deploy_s3.sh`: builds and syncs the Gatsby site to S3, then optionally invalidates CloudFront

## Infrastructure Modules

### `tf/main.tf`

Core hosting stack: ACM, Route53, CloudFront, OAC, and bucket access policy.

### `tf/cognito.tf`

User pool, domain, and OIDC client for site/editor authentication.

### `tf/email.tf`

Inbound SES email routing into S3 plus Lambda forwarding.

## Reuse Notes

- Most new routes should compose `Layout` rather than starting a new shell pattern.
- Browser-only functionality should follow the existing `HeatMap`/scanner/auth wrapper patterns.
- New content types should mimic the recipe MDX + template + CMS schema pipeline.

---

_Generated using BMAD Method `document-project` workflow_
