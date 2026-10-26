# Story 1.5: Featured Content Management for Public Discovery

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an editor,
I want to control which recipes and trust-critical resources are featured in public discovery surfaces,
so that the most useful and reliable content is easy for visitors to find.

## Acceptance Criteria

1. Given an authorized editor accesses the content management workflow for public discovery, when they review available recipes and eligible trust-critical resources, then they can mark selected items for featured placement, and the workflow is protected from public or unauthorized access.
2. Given an editor selects recipes or resources to feature, when those selections are saved, then the chosen items are reflected on the appropriate public discovery surfaces, and non-featured items remain available through standard browsing paths.
3. Given featured content appears on the homepage or other public entry surfaces, when a visitor loads those pages, then featured recipes and resources are visually distinguishable from standard content, and they preserve the trust-first hierarchy defined in the UX direction.
4. Given an editor updates the order or selection of featured items, when the changes are published, then the public pages reflect the updated ordering without breaking routed content access, and the feature logic does not require manual code edits to change day-to-day priorities.
5. Given a recipe or resource is not appropriate for featuring, when an editor removes it from featured placement, then it no longer appears in featured surfaces, and the item remains accessible through its normal routed page unless explicitly unpublished elsewhere.
6. Given editorial actions affect trust-sensitive public content discovery, when changes are made, then the workflow preserves the product’s publication safety rules, and it does not allow unreviewed or unsafe user-submitted content to become featured accidentally.
7. Given featured discovery surfaces are evaluated for performance and accessibility, when featured content modules render on public pages, then they remain crawlable, keyboard accessible, and readable across supported breakpoints, and they do not add unnecessary client-side overhead to high-value public pages.

## Tasks / Subtasks

- [x] Audit the current editorial path and content model for featuring (AC: 1, 4, 6)
  - [x] Review the existing Decap CMS config in `static/admin/config.yml`, current content frontmatter, and current homepage/public discovery queries.
  - [x] Identify what metadata is missing to support featured selection and ordering for recipes and eligible public resources.
  - [x] Preserve the current protected editorial path rather than inventing a separate admin surface for this story.
- [x] Extend the content model for featured content control (AC: 1, 2, 4, 5)
  - [x] Add frontmatter or CMS fields needed to mark content as featured and control ordering.
  - [x] Limit the first implementation to content types already flowing through the current Gatsby content pipeline, unless a small resource-level solution is clearly needed.
  - [x] Ensure non-featured items still render normally in their routed destinations.
- [x] Implement featured-content queries and public rendering (AC: 2, 3, 4, 5, 7)
  - [x] Update homepage or other appropriate public entry surfaces to pull featured items from content metadata instead of relying only on hardcoded selection.
  - [x] Keep featured content visually distinct without overpowering the primary homepage hierarchy established in Story 1.2.
  - [x] Preserve static rendering, crawlability, and accessible link structure.
- [x] Preserve editorial safety boundaries (AC: 1, 6)
  - [x] Ensure featuring only applies to already publishable content in the current public content flow.
  - [x] Avoid creating a path that could expose unreviewed submissions or bypass future moderation rules.
  - [x] Keep auth/editorial assumptions aligned with the existing Decap CMS + Cognito direction.
- [x] Verify featured-content management quality (AC: 7)
  - [x] Run `npm run typecheck`.
  - [x] Attempt `npm run lint` and record if the repo-level ESLint configuration gap still blocks it.
  - [x] Manually verify featured selection, ordering, and public rendering in the local environment.

### Review Findings

> ⚠️ Partial review (2026-04-18): Edge Case Hunter and Acceptance Auditor layers failed due to usage limits. Only the Blind Hunter (adversarial) layer ran. Spec-compliance and edge-case coverage were not evaluated in this pass — consider re-running CR after the usage window resets.

- [x] [Review][Patch] Homepage GraphQL sort lacks null-tolerance for `featured_order` [src/pages/index.tsx] — `sort: { frontmatter: { featured_order: ASC } }` in the page query orders nulls unpredictably in Gatsby. If an editor marks `featured: true` without setting `featured_order`, ordering on `/` becomes inconsistent. Recipes page already handles this via a `Number.MAX_SAFE_INTEGER` fallback in client-side sort — homepage should do the same (or explicitly filter out featured items missing `featured_order`). ✅ Resolved 2026-04-18: removed GraphQL sort clause and added client-side `.sort()` with `Number.MAX_SAFE_INTEGER` fallback in `featuredRecipes` derivation, matching `recipes.tsx`. Typecheck passes.
- [x] [Review][Defer] Fallback recipe highlights both link to `/recipes` [src/pages/index.tsx] — deferred, pre-existing. Both `recipeHighlightsFallback` entries target `/recipes` with different accessible names (a11y: duplicate links with different labels). Pre-existing behavior inherited from the original `recipeHighlights` block; this block also only renders when no recipes are featured, which is not the steady state post-story.

## Dev Notes

- This story is about editorial control for public discovery, not full moderation workflows. Do not drift into Epic 5 moderation-state design.
- There is already an admin/editorial path via Decap CMS in `static/admin/config.yml` with S3 + Cognito configuration. Use that as the implementation base.
- Current public discovery surfaces, especially the homepage, still rely heavily on hardcoded content selection. The main gap is content-driven featured selection and ordering.
- The current content pipeline is centered on MDX under `content/`, especially recipes. That makes recipes the safest first-class target for featuring. Trust-critical resources may need a minimal path if they are already content-backed or can be represented cleanly without inventing a backend.
- Maintain the trust-first public hierarchy built in Stories 1.1 through 1.4. Featured content should improve discovery, not turn the homepage into an editorial dashboard.

### Technical Requirements

- Keep Gatsby’s existing content pipeline and page generation flow intact.
- Prefer frontmatter-driven featuring over introducing a new service or data store for this story.
- Preserve clean static queries and avoid client-only editorial logic on public pages.
- Keep TypeScript strict-mode compatible and continue using relative imports.
- Avoid backend/API work unless an absolutely minimal existing-path change is required.

### Architecture Compliance

- Public discovery surfaces must remain crawlable and statically rendered, with featured logic resolved through Gatsby content/query patterns where possible.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Editorial changes must stay within protected editorial paths and must not weaken publication-safety assumptions.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Frontend/content work belongs in `src/`, `content/`, and the existing admin config path, not in new backend systems for this story.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not introduce a new CMS or alternate routing/rendering system.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- Existing editorial/auth direction already includes Decap CMS S3 backend config and Cognito/OIDC client scaffolding. Reuse that direction instead of building parallel auth behavior.  
  [Source: static/admin/config.yml] [Source: src/pages/auth.tsx] [Source: src/components/auth-provider-wrapper.js]
- `npm run lint` may still fail due to missing ESLint configuration in the repo root; record that outcome if unchanged.  
  [Source: package.json]

### File Structure Requirements

- Likely touch points:
  - `static/admin/config.yml`
  - content files/frontmatter in `content/`
  - homepage/public discovery rendering in `src/pages/index.tsx`
  - possibly `src/pages/recipes.tsx` if featured treatments surface there too
  - possibly `gatsby-node.js` or related queries only if content metadata changes require it
- Do not create a new backend or moderation system for this story.

### Testing Requirements

- Run `npm run typecheck`
- Attempt `npm run lint`
- Manually verify:
  - editors can set featured metadata in the current CMS/content path
  - homepage or other discovery surfaces reflect featured selection and ordering
  - removing featured status removes the item from featured placement without breaking its normal routed page
  - public rendering remains accessible and crawlable

### Previous Story Intelligence

- Story 1.2 reworked the homepage into a clear dual-entry surface. Featured content must now support that hierarchy, not dilute it.
- Story 1.3 improved routed discovery and cross-linking; featured content should enhance discovery into those routes rather than bypass them awkwardly.
- Story 1.4 standardized trust-sensitive framing, so any featured recipe/resource surfaces must preserve that trust posture.
- Earlier stories consistently documented the same repo-level lint blocker: missing ESLint configuration.

### Current Implementation Baseline

- Current admin/editorial baseline:
  - Decap CMS config exists at `static/admin/config.yml`
  - Recipes are editable through the `recipes` collection under `content/recipes`
  - Cognito/OIDC auth scaffolding exists in `src/pages/auth.tsx` and `src/components/auth-provider-wrapper.js`
- Current public baseline:
  - homepage selections are still largely hardcoded in `src/pages/index.tsx`
  - recipes are queried from MDX/frontmatter in `src/pages/recipes.tsx`
  - page generation is frontmatter-driven via `gatsby-node.js`
- Missing today:
  - no featured flag or featured ordering in content frontmatter
  - no content-driven public query for featured recipes/resources

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-1.5:-Featured-Content-Management-for-Public-Discovery]
- Current CMS/editorial config: [Source: static/admin/config.yml]
- Current auth/editorial support files: [Source: src/pages/auth.tsx] [Source: src/components/auth-provider-wrapper.js]
- Current homepage/public discovery baseline: [Source: src/pages/index.tsx]
- Current recipe query/content model: [Source: src/pages/recipes.tsx] [Source: gatsby-node.js]
- Current content files: [Source: content/]
- Previous story files: [Source: _bmad-output/implementation-artifacts/1-2-homepage-with-dual-entry-points.md] [Source: _bmad-output/implementation-artifacts/1-3-discoverable-public-content-and-topical-routing.md] [Source: _bmad-output/implementation-artifacts/1-4-trust-and-safety-framing-on-public-content.md]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from epics, architecture, current CMS config, current content/query pipeline, and prior Epic 1 story learnings
- `npm run typecheck` — passes clean (tsc --noEmit, no errors)
- `npm run lint` — still fails due to repo-level ESLint configuration gap ("ESLint couldn't find a configuration file"), unchanged from prior Epic 1 stories
- `npm run build` — succeeds in ~38s; static HTML for `/` and `/recipes/` includes featured markers and both featured recipe titles, confirming SSG + page queries work

### Completion Notes List

- Added content-model driven featuring for recipes via two new frontmatter fields: `featured` (boolean) and `featured_order` (integer)
- Extended Decap CMS config (`static/admin/config.yml`) with matching editor fields including hints; editorial path remains Cognito-gated via existing CMS backend
- Marked existing recipes as featured (cinnamon roll hack order 1, colorado green chili order 2) to exercise the rendering path
- Homepage (`src/pages/index.tsx`) now runs a Gatsby page query for featured recipes and replaces the hardcoded recipe highlights block with a visually-distinct "Editor-featured recipes" card grid; falls back to original hardcoded copy when no recipes are featured, preserving trust-first hierarchy from Story 1.2
- Recipes page (`src/pages/recipes.tsx`) surfaces a dedicated "Editor featured" section at the top (amber border + Featured pill) while keeping the full "All Recipes" list below so non-featured items remain fully accessible via normal routed paths (AC 5)
- Feature logic is entirely frontmatter-driven — editors change day-to-day priorities via CMS fields (`featured`, `featured_order`), no code edits required (AC 4)
- Safety posture preserved: `submit-recipe.tsx` has no featured controls, featured flag is only editable via Cognito-gated Decap CMS, and queries filter to already-published `content/recipes/` (no bypass to future moderation workflows)
- Static rendering preserved — homepage and recipes page remain fully SSG with crawlable `<a>` links; no client-only editorial logic introduced

### File List

- _bmad-output/implementation-artifacts/1-5-featured-content-management-for-public-discovery.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- static/admin/config.yml
- content/recipes/2026-02-26-cinnamon-roll-hack.mdx
- content/recipes/2026-02-26-colorado-green-chili.mdx
- src/pages/index.tsx
- src/pages/recipes.tsx

### Change Log

- 2026-04-17: Implemented featured-content management for public discovery — added `featured` + `featured_order` frontmatter/CMS fields, content-driven featured section on homepage and recipes page, visual distinction via amber Featured pill, preserving SSG and editorial safety boundaries.
- 2026-04-18: Addressed code review finding — replaced GraphQL ASC sort on homepage featured query with client-side null-tolerant sort using `Number.MAX_SAFE_INTEGER` fallback, matching the pattern in `recipes.tsx`. Ensures deterministic ordering when editors mark `featured: true` without setting `featured_order`.
