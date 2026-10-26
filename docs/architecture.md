# AlphaGalData Architecture

**Date:** 2026-04-16

## System Shape

AlphaGalData is a single Gatsby application that statically builds most pages and hydrates selected browser-only features on the client. The codebase is best understood as five cooperating layers:

1. Content and data sources
2. Gatsby build and routing
3. React UI and interactive feature islands
4. Asset/data generation scripts
5. AWS hosting and identity infrastructure

## Runtime Architecture

### Static content layer

- `src/pages/**/*.mdx` provides directly routed informational pages
- `content/**/*.mdx` provides content that is turned into routes at build time
- `gatsby-source-filesystem` and `gatsby-plugin-mdx` ingest both page and article/recipe sources

### Gatsby build and route generation

- `gatsby-config.ts` defines plugin wiring, site metadata, manifest, sitemap, robots, and S3 deployment plugin settings
- `gatsby-node.js` queries all MDX files under `content/`
- Recipes are routed with `src/templates/recipe.tsx`
- Non-recipe articles are routed with `src/templates/learn-article.tsx`
- `onPostBuild` copies `sitemap-index.xml` to `sitemap.xml` for Search Console compatibility

### UI composition

- `src/components/Layout.tsx` provides the global chrome, nav, footer, disclosure bar, SEO, and cookie consent
- Page components in `src/pages/` are mostly lightweight compositions over shared components and static content
- Interactive tools such as the heat map, spread timeline, and scanner are isolated in dedicated components/pages

### Client-only interactive islands

Several features intentionally avoid SSR access to browser-only dependencies:

- `src/components/HeatMap.tsx` dynamically imports Leaflet and `react-leaflet`, then fetches GeoJSON from `/data/lone_star_ticks.geojson`
- `src/components/TimelineMap.tsx` follows a similar pattern for state-level spread visualization
- `src/pages/scanner.tsx` dynamically imports barcode and OCR libraries for device camera and uploaded-image workflows
- `src/components/auth-provider-wrapper.js` skips `AuthProvider` during SSR to keep Cognito OIDC client code browser-only
- `src/pages/auth.tsx` mounts auth UI only after hydration to avoid SSR hooks errors

This is the primary repo-wide architectural constraint: browser-specific libraries must stay behind runtime guards.

## Data Architecture

## Content models

- **Recipe MDX:** title, slug, date, description, servings, prep/cook time, image, safety notes, ingredients, steps, optional body
- **Article MDX:** title, description, date, updated, body content

## Structured datasets

- `src/data/ingredients.json`: ingredient dataset copied from external `data-bot` source during build prep
- `src/data/lone_star_ticks.geojson`: county-level tick distribution map data
- `src/data/us_counties.geojson`: county geometry used when joining spreadsheet surveillance data
- `src/data/us_states.json`: state polygons for spread timeline
- `src/data/ags-timeline.json`: temporal spread or timeline metadata

## Public asset copies

- `static/data/lone_star_ticks.geojson` serves map data at runtime without bundling it into JS
- `static/downloads/*` and `static/pins/*` are distributed as direct assets

There is no relational database, ORM, or server-side persistence layer in this repo.

## Integration Architecture

### Internal integrations

- Gatsby GraphQL joins MDX frontmatter with page templates at build time
- Page routes use shared `Layout` and `SEO`
- Downloads and product pages consume config-driven metadata from `config/affiliates.json`
- Scripts write into `src/data/` and `static/`, which are then consumed by the frontend

### External integrations

- **Cognito OIDC:** front-end auth bootstrap for admin/editor flows
- **Decap CMS on S3 backend:** recipe editing and media uploads
- **AWS S3 + CloudFront:** production hosting and CDN
- **Route53 + ACM:** DNS and TLS
- **SES + Lambda:** inbound email forwarding
- **Third-party references:** Labcorp, Quest, CDC, Amazon affiliate links, allergist directories

## State Management

There is no centralized client store such as Redux. State management is local and component-driven:

- React `useState` and `useEffect` handle scanner/map UI state
- Some derived values use `useMemo`
- Auth state is delegated to `react-oidc-context`
- Content pages are mostly stateless beyond render-time props

## UI Component Pattern

The UI is pragmatic rather than design-system-heavy:

- Shared shell in `Layout`
- Utility-first styling with Tailwind classes
- Per-feature components encapsulate their own logic
- Iconography lives in `src/components/icons.tsx`
- MDX article rendering relies on prose styles plus a lighter `TopicLayout` variant where needed

## Security and Auth

- Public site pages are largely anonymous
- Auth is scoped to editor/admin flows and testing pages
- Public env vars configure Cognito client-side OIDC
- `static/admin/config.yml` points Decap CMS to S3/Cognito resources
- Recipe template conditionally shows editor shortcuts when authenticated users belong to the `editors` group

## Build and Deployment Architecture

### Build flow

1. `npm run build`
2. `npm run prepare:data` copies ingredient dataset into `src/data/ingredients.json`
3. Gatsby compiles routes, MDX, assets, and generated pages into `public/`

### Deploy flow

1. `scripts/deploy_s3.sh` runs the build
2. Non-HTML assets sync to S3 with immutable cache headers
3. HTML syncs with no-cache headers
4. Optional CloudFront invalidation is requested

### Infrastructure

- `tf/main.tf`: CloudFront, ACM, DNS aliases, S3 OAC bucket policy
- `tf/cognito.tf`: user pool, domain, app client
- `tf/email.tf`: SES inbound mail, S3, Lambda forwarder, DNS records

## Testing Strategy

There is currently no automated test suite in the repo. Quality gates are:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- manual browser verification for maps, scanner, auth, and downloads

This is a meaningful project risk and a likely target for future QA automation.

## Architectural Constraints

- Keep React 18 and Gatsby 5 compatible
- Do not SSR browser-only libraries directly
- Prefer new code in TypeScript; do not opportunistically convert older JS files unless necessary
- Data sync scripts are part of the production content pipeline
- The repo relies on file-based content and static assets rather than server APIs

## High-Value Extension Points

- Add more MDX content types or collections
- Expand interactive tools using the existing client-only island pattern
- Introduce provider/location data sourced similarly to existing ingredient and map datasets
- Add CI-backed validation and deploy automation around existing scripts

---

_Generated using BMAD Method `document-project` workflow_
