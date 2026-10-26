# AlphaGalData Data Models

**Date:** 2026-04-16

## Summary

AlphaGalData does not have database tables or ORM entities in this repository. Its effective data model is file-based: MDX frontmatter, JSON datasets, GeoJSON features, and YAML CMS configuration.

## Recipe Model

**Source:** `content/recipes/*.mdx`  
**Managed by:** Decap CMS recipe collection and manual edits  
**Rendered by:** `src/templates/recipe.tsx`

### Frontmatter fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | required |
| `slug` | string | required, route path |
| `date` | datetime/string | required |
| `description` | text | required |
| `servings` | string | optional |
| `prep_time` | string | optional |
| `cook_time` | string | optional |
| `image` | string | optional uploaded image path |
| `safety_notes` | string[] | optional |
| `ingredients` | string[] | expected list |
| `steps` | string[] | expected list |
| `cms_id` | string | optional editor convenience field when present |
| `body` | markdown/body | optional extended notes |

## Article Model

**Source:** `content/**/*.mdx` and `src/pages/learn/*.mdx`  
**Rendered by:** `src/templates/learn-article.tsx` or Gatsby file-system page routing

### Known fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | required in practice |
| `description` | string | used for SEO |
| `date` | string/date | published date |
| `updated` | string/date | optional last-updated field |

## Affiliate Configuration Model

**Source:** `config/affiliates.json`

### Structure

- `programs`: dictionary keyed by program ID
- `placements`: dictionary mapping page placement names to arrays of program IDs

### Program shape

| Field | Type |
| --- | --- |
| `programId` | string |
| `category` | string |
| `url` | string |
| `description` | string optional |

## Ingredient Dataset Model

**Source:** `src/data/ingredients.json`  
**Producer:** `scripts/sync-ingredients.js`

The exact schema is imported from an external dataset repository and is not strongly typed in this repo. Its role is to support ingredient-scanning workflows. Changes to this file should be treated as contract-sensitive because downstream scanner logic and UI assumptions may depend on field names even if that coupling is loose today.

## Tick GeoJSON Model

**Primary source:** `src/data/lone_star_ticks.geojson`  
**Runtime copy:** `static/data/lone_star_ticks.geojson`

### Collection shape

- GeoJSON `FeatureCollection`
- County polygons inherited from `us_counties.geojson`

### Feature properties in active workflow

| Field | Type | Notes |
| --- | --- | --- |
| `GEOID` | string | county FIPS code |
| `state` | string | state name/abbr from joined spreadsheet |
| `county` | string | county label |
| `status` | string or null | values normalized to `Established`, `Reported`, `No records`, or null |
| `source` | string or null | provenance note from spreadsheet |

## County Geometry Model

**Source:** `src/data/us_counties.geojson`  
**Producer:** `scripts/prepare_counties.js`

### Core fields

| Field | Type |
| --- | --- |
| `type` | `FeatureCollection` |
| `features[].id` | county identifier |
| `features[].properties.GEOID` | zero-padded FIPS string |
| `features[].geometry` | county polygon/multipolygon |

## State Geometry Model

**Source:** `src/data/us_states.json`  
**Producer:** `scripts/prepare_states.js`

### Feature properties

| Field | Type |
| --- | --- |
| `FIPS` | string |
| `abbr` | string |
| `name` | string |

Only the 50 states plus DC are retained.

## Timeline Dataset Model

**Source:** `src/data/ags-timeline.json`

This is the structured input for timeline/spread visualization. The exact schema was not exhaustively typed in the app, but it functions as presentation data for `TimelineMap`. If extended, add explicit TS types before increasing complexity.

## CMS Collection Model

**Source:** `static/admin/config.yml`

One configured collection exists:

- `recipes`
  - folder: `content/recipes`
  - create: true
  - slug: `{{year}}-{{month}}-{{day}}-{{slug}}`
  - extension: `mdx`

## Observations

- The repo’s data architecture is content-first, not application-database-first.
- Frontmatter and JSON shape changes are effectively schema migrations and should be treated as such.
- Introducing typed model definitions would improve safety for scanner/map/content work.

---

_Generated using BMAD Method `document-project` workflow_
