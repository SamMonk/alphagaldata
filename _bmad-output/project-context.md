---
project_name: 'alphagaldata'
user_name: 'Monk'
date: '2026-04-15'
sections_completed: ['technology_stack', 'version_compatibility', 'language_rules']
existing_patterns_found: 0
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework:** Gatsby ^5.13.0 (React ^18.2.0, MDX via gatsby-plugin-mdx)
- **Language:** TypeScript ^5.5.4 (strict mode), ES2020 target, jsx: react-jsx
- **Styling:** TailwindCSS ^3.4.9 + PostCSS + autoprefixer
- **Auth:** Cognito OIDC via `react-oidc-context` ^2.4.0 + `oidc-client-ts` ^2.4.1
- **Mapping:** Leaflet ^1.9.4 + react-leaflet ^4.2.1, topojson-client, us-atlas
- **Data utilities:** xlsx, gray-matter, pdfkit, tesseract.js, @zxing/browser
- **Hosting:** S3 (`alphagal` bucket) + CloudFront E2ME15PLS6E69R via shared `../deploy_s3.sh`
- **IaC:** Terraform in `tf/` (state local, gitignored)
- **Tooling:** ESLint ^8.57, Prettier ^3.3, Sharp ^0.32

**Version compatibility constraints (do not bump without coordination):**
- React 18 + Gatsby 5 are paired — do not jump to React 19 or Gatsby 6
- `react-leaflet` v4 requires React 18; v5 requires React 19 — stay on v4
- `gatsby-plugin-offline` registers a service worker; cached assets can mask deploys — bust via CloudFront invalidation in `deploy_s3.sh`
- TS `module: ESNext` + `moduleResolution: Node` (not `bundler`) — avoid `.js` import extensions in TS source
- @types/node ^20 implies Node 20+ for tooling

## Critical Implementation Rules

### Language-Specific Rules (TypeScript / JS / MDX)

- TS `strict: true` — no implicit any; honor optional/null types
- `tsconfig.json` `include` covers `src/**/*`, `gatsby-*.ts`, `scripts/**/*`, `config/**/*.json` — `npm run typecheck` validates build scripts too
- `resolveJsonModule: true` — prefer typed JSON imports over `fs.readFileSync` in `src/`
- No path aliases — use relative imports
- Default exports for Gatsby pages and layout components; named exports for utilities/shared components
- **Browser-only libs (Leaflet, react-leaflet, @zxing/browser, tesseract.js) MUST be dynamically imported inside `useEffect`** to avoid SSR `window is not defined`. Pattern: `src/components/HeatMap.tsx`
- MDX and `.tsx` pages coexist in `src/pages/` — both produce routes
- Mixed JS/TS in `src/`: keep new code TypeScript; don't opportunistically convert existing `.js` (e.g., `auth-provider-wrapper.js`)
- Async fetches in components use `try/catch` with silent fallback to bundled sample data (see `HeatMap.tsx`) — intentional for PWA/offline resilience; preserve for external data fetches
- Lint via `npm run lint` (ESLint 8 + `eslint-config-prettier`); format via `npm run format` (Prettier 3) — no eslintrc/prettierrc in repo root, defaults apply
