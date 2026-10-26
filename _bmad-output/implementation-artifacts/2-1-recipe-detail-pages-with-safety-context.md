# Story 2.1: Recipe Detail Pages With Safety Context

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to view a recipe page that combines ingredients, instructions, and alpha-gal safety context,
so that I can decide whether the recipe is worth considering before I save it.

## Acceptance Criteria

1. Given a visitor opens a recipe detail page, when the page loads, then the page presents the recipe title, core description, ingredient list, and preparation instructions, and it includes visible alpha-gal safety context as part of the page rather than treating safety as a hidden secondary detail.
2. Given a visitor scans the recipe detail page, when they review the content structure, then ingredients, safety notes, substitutions, and instructions are organized in a clear reading hierarchy, and trust-critical information appears before or alongside save-oriented actions.
3. Given a recipe has important substitutions or warnings, when the page is rendered, then those substitutions or warnings are visible in context with the recipe, and they do not require the user to leave the page to understand the basic safety framing.
4. Given a visitor reaches the recipe page from homepage discovery, internal links, or search, when the page is used as a landing page, then it stands on its own with enough context to be understandable as an entry point, and it provides clear paths to related recipes, scanner help, or supporting education where relevant.
5. Given the recipe detail page is displayed on desktop or mobile, when the layout adapts across breakpoints, then the page remains readable and structured, and trust-critical content is not pushed below ornamental or low-priority content.
6. Given the recipe page is rendered for public users and search engines, when SEO and crawlability are evaluated, then the page supports clean routed URLs, crawlable output, and page metadata, and the core recipe and safety content is not hidden behind JavaScript-only rendering.
7. Given the recipe detail experience is evaluated for accessibility, when users navigate headings, lists, links, and actions, then the page uses semantic structure and understandable labels, and the reading flow remains usable with keyboard and assistive technologies.

## Tasks / Subtasks

- [x] Audit the current recipe detail baseline and identify what Story 2.1 still needs beyond Epic 1 work (AC: 1, 2, 4, 5, 6, 7)
  - [x] Review `src/templates/recipe.tsx`, current recipe frontmatter, and `gatsby-node.js` route generation.
  - [x] Identify which ACs are already partially met by the existing recipe template and which gaps remain around landing-page completeness, hierarchy, and related guidance.
  - [x] Keep this story scoped to recipe detail presentation and context, not recipe save persistence or backend save APIs.
- [x] Improve recipe detail hierarchy and page completeness (AC: 1, 2, 3, 4)
  - [x] Ensure the page clearly presents title, description, metadata, ingredients, instructions, and visible safety context in a trust-first order.
  - [x] Surface substitutions or warning context on-page where supported by existing content fields or a minimal content-model extension.
  - [x] Ensure recipe pages work as standalone landing pages with clear onward paths to scanner, related recipes, downloads, or supporting education.
- [x] Refine responsive and accessible recipe detail behavior (AC: 2, 5, 7)
  - [x] Keep trust-critical content visible before lower-priority modules across supported breakpoints.
  - [x] Use semantic headings, lists, and labels consistently through the recipe template.
  - [x] Preserve keyboard-friendly navigation and readable mobile layouts established in Story 1.6.
- [x] Preserve public-site SEO and static rendering expectations (AC: 4, 6)
  - [x] Keep recipe pages statically rendered and crawlable through the existing Gatsby page-generation path.
  - [x] Maintain or improve page metadata and structured content output without shifting recipe content into client-only rendering.
  - [x] Avoid introducing frontend business logic that belongs to later save-flow stories or backend APIs.
- [x] Verify implementation quality (AC: 5, 6, 7)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and record any remaining warnings or blockers.
  - [x] Manually verify recipe detail pages on desktop and mobile in the local browser.

## Dev Notes

- This story starts Epic 2, but the repo already has an existing recipe detail template. Treat this as an improvement pass on an existing public surface, not a greenfield page build.
- Story 2.1 should make the recipe page feel complete and trustworthy as a decision page before save behavior exists. Do not drift into Story 2.3 save persistence or Story 2.2's richer dedicated safety-note system beyond the minimum needed for this page to stand on its own.
- The UX direction makes `find -> understand safety -> save` the core journey. This story is the `understand safety` foundation on the recipe page.
- Story 1.6 already strengthened responsiveness and accessibility across the public site. Reuse those patterns instead of creating one-off recipe-page exceptions.

### Technical Requirements

- Keep Gatsby recipe pages and templates as the implementation surface.
- Maintain static rendering and the current `gatsby-node.js` page-generation pattern.
- Preserve TypeScript strict-mode compatibility and continue using relative imports.
- Prefer incremental extension of existing recipe frontmatter and template logic over architectural rework.
- Do not implement backend save APIs, authentication changes, or DynamoDB work in this story.

### Architecture Compliance

- Recipe pages remain part of the public Gatsby presentation layer and must stay crawlable, lightweight, and independently understandable as routed pages.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Trust-critical operations like future save flows belong in shared frontend services and backend APIs later; this story should not embed premature save business logic in the page template.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Frontend recipe work belongs in `src/templates/recipe.tsx`, related public components, and content-backed recipe fields rather than new backend modules.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not introduce alternate routing/rendering systems or client-heavy recipe-page state managers.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- Browser-only libraries must continue to be guarded for SSR safety; do not introduce browser-only recipe-page behavior that breaks static rendering.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- `npm run lint` is now configured via repo ESLint files and should be run as part of verification, even if brownfield warnings remain.  
  [Source: package.json] [Source: .eslintrc.cjs]

### File Structure Requirements

- Likely touch points:
  - `src/templates/recipe.tsx`
  - recipe content frontmatter under `content/recipes/`
  - `gatsby-node.js` only if metadata/query needs change
  - shared trust or recipe-presentational components if the implementation naturally benefits from reuse
- Avoid backend, Terraform, or API handler changes for this story.

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - recipe pages opened directly from routed URLs
  - recipe pages entered from homepage/recipes listing
  - trust-critical content visibility on mobile and desktop
  - accessibility of headings, lists, links, and reading order
  - metadata/crawlability preserved in the generated page output where practical

### Previous Story Intelligence

- Story 1.5 introduced content-driven featured recipe discovery, which increases the likelihood that recipe detail pages are used as direct landing pages from homepage discovery.
- Story 1.6 hardened recipe, scanner, and long-form surfaces for accessibility and responsive behavior. The recipe detail page should build on those patterns rather than re-solving them locally.
- Existing Epic 1 work already established task-oriented onward links to scanner, downloads, and caregiver support from recipe pages. Preserve and refine those routes as part of landing-page completeness.

### Current Implementation Baseline

- Current recipe routing is generated in `gatsby-node.js` based on MDX content under `content/recipes/`.
- Current recipe template already renders:
  - title
  - description
  - servings / prep / cook metadata
  - image
  - `safety_notes`
  - ingredients
  - instructions
  - onward links to scanner, downloads, and caregivers
- Current gaps relative to this story are likely:
  - stronger landing-page completeness and hierarchy
  - clearer on-page handling of substitutions or warning context
  - more intentional organization of trust-critical content before later save interactions exist
  - ensuring the recipe page reads as a high-trust entry point, not only as a content record

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-2.1:-Recipe-Detail-Pages-With-Safety-Context]
- Relevant architecture decisions: [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- Relevant UX decisions: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Project Vision] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Custom-Component-Strategy] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design-&-Accessibility]
- Current recipe routing/template baseline: [Source: gatsby-node.js] [Source: src/templates/recipe.tsx]
- Current recipe content baseline: [Source: content/recipes/]
- Previous story files: [Source: _bmad-output/implementation-artifacts/1-5-featured-content-management-for-public-discovery.md] [Source: _bmad-output/implementation-artifacts/1-6-responsive-and-accessible-public-experience.md]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from Epic 2 acceptance criteria, architecture/frontend boundaries, UX trust patterns, current recipe template implementation, and recent Epic 1 learnings
- Audit confirmed the existing template already covers core content rendering, but still needs a stronger trust-first hierarchy, explicit substitution/caution treatment, and better standalone landing-page completeness

### Completion Notes List

- Extended the recipe content model with `safety_summary`, `substitutions`, and `caution_points` so recipe pages can explain the decision logic on-page without waiting for later save-flow work.
- Updated the recipe template to create a stronger landing-page hierarchy with a trust-first hero, an at-a-glance decision panel, explicit substitutions/caution sections, and clearer onward paths to related recipes, scanner help, and education.
- Preserved static Gatsby rendering and SEO-friendly recipe metadata while keeping all recipe-detail logic content-backed and frontend-only.
- Updated the two existing featured recipes to exercise the new recipe-detail trust fields with real substitution and caution content.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits successfully with the same six pre-existing warnings in unrelated brownfield files (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`, `src/pages/scanner.tsx`).
- Manual browser verification completed by user review on 2026-04-20; sandbox still cannot directly access the user's loopback `http://localhost:8001`.

### File List

- _bmad-output/implementation-artifacts/2-1-recipe-detail-pages-with-safety-context.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- static/admin/config.yml
- content/recipes/2026-02-26-cinnamon-roll-hack.mdx
- content/recipes/2026-02-26-colorado-green-chili.mdx
- src/templates/recipe.tsx
