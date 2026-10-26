# Story 1.3: Discoverable Public Content and Topical Routing

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want public routed pages for recipes, learning content, downloads, and caregiver guidance,
so that I can browse AlphaGalData through clear topical pathways and search-friendly URLs.

## Acceptance Criteria

1. Given a visitor navigates beyond the homepage, when they choose a primary content area, then they can reach routed public pages for recipes, learning content, downloads/resources, and caregiver-relevant guidance, and each page type has a clear purpose within the overall site structure.
2. Given a visitor browses public content categories, when they move between related public pages, then the site provides clear internal linking between recipes, educational content, downloads, and safety resources, and those links support natural discovery without forcing the user back to the homepage.
3. Given a visitor lands on a routed public page from search or a shared link, when the page loads, then the page stands on its own with enough structure and context to be understandable as an entry point, and it provides clear paths to adjacent relevant content.
4. Given recipe, education, download, and caregiver pages are implemented, when URLs are generated for those public routes, then the URLs are clean, stable, and human-readable, and they support crawlability and long-term SEO use.
5. Given a visitor uses the public site on modern desktop or mobile browsers, when they browse these routed pages, then the layouts remain responsive and readable, and the content structure preserves trust-critical hierarchy across breakpoints.
6. Given the routed public content is rendered for users and search engines, when metadata and page structure are evaluated, then important pages support titles, metadata, and crawlable content output, and key public content is not hidden behind JavaScript-dependent rendering.
7. Given caregiver-relevant guidance is part of the public experience, when a visitor looks for support-oriented content, then they can find caregiver pathways without confusion, and those pathways remain integrated with the broader food, safety, and preparedness experience.
8. Given this routed public content foundation is implemented, when accessibility is evaluated, then pages use clear heading hierarchy, understandable links, and semantic structure, and they remain usable without requiring complex interactions.

## Tasks / Subtasks

- [x] Audit and tighten the public route structure (AC: 1, 4, 6)
  - [x] Review current routed public pages under `src/pages/` and `src/templates/` for recipes, learning content, downloads/resources, testing, and related support pages.
  - [x] Identify route gaps or weak entry pages that prevent the site from reading as a clear topical system.
  - [x] Preserve clean Gatsby routes and avoid introducing JS-only navigation behavior.
- [x] Improve stand-alone entry quality on key routed pages (AC: 1, 3, 5, 6, 8)
  - [x] Ensure major public pages can make sense when landed on directly from search or shared links.
  - [x] Strengthen page-level headings, framing, and adjacent next-step links where needed.
  - [x] Preserve responsive readability and semantic structure across desktop and mobile.
- [x] Add or refine internal linking between major content modes (AC: 2, 3, 7)
  - [x] Connect recipes, learning content, downloads/resources, and safety/testing pages through clearer in-page pathways.
  - [x] Reduce dependency on the homepage as the only discovery hub.
  - [x] Keep links task-oriented and aligned with the shell language established in Story 1.1.
- [x] Introduce caregiver-relevant routing or landing support if missing (AC: 1, 7)
  - [x] Determine whether caregiver guidance should be a dedicated routed page or a clearly surfaced routed section within existing learning content.
  - [x] Keep caregiver content integrated with food, safety, and preparedness rather than isolated as a disconnected subsection.
  - [x] Avoid turning this story into broad new content authoring beyond what is needed to satisfy routed discoverability.
- [ ] Verify routed content quality (AC: 4, 5, 6, 8)
  - [x] Preserve clean, stable URLs and static-friendly Gatsby rendering.
  - [x] Run `npm run typecheck`.
  - [x] Attempt `npm run lint` and record if the repo-level ESLint configuration gap still blocks it.
  - [ ] Manually verify key public routes and cross-links in the local browser.

## Dev Notes

- This story is about routed discoverability and page-to-page coherence, not shell navigation (Story 1.1), homepage product thesis (Story 1.2), or trust-framing copy policy in depth (Story 1.4).
- The current repo already has routed pages for recipes, downloads, testing, and learning, plus Gatsby templates for recipe and learn-article pages. The likely work is selective refinement and cross-linking, not a full site-map rebuild.
- There is no clearly named caregiver-specific route in the current public surface. That is the main structural gap relative to the story acceptance criteria, and it should be resolved with the smallest coherent routed addition or refinement.
- Keep this story frontend-only. It should not require backend APIs or moderation logic.
- Preserve the task-oriented shell language and the homepage entry logic established by Stories 1.1 and 1.2.

### Technical Requirements

- Keep Gatsby’s routed page model intact using `src/pages/` and `src/templates/`.
- Prefer small improvements to existing public pages over broad component or content-system rewrites.
- Maintain static rendering, crawlability, and readable direct-entry pages for public content.
- Keep TypeScript strict-mode compatible and continue using relative imports.
- Avoid introducing browser-only dependencies or client-heavy route logic for this story.

### Architecture Compliance

- Public pages must remain SEO-first and crawlable, with key content visible in static output rather than hidden behind client-only rendering.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Public routes must remain available without login and must not assume protected app behavior.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Frontend routed content belongs in `src/`, with presentation and linking concerns staying in Gatsby page/template boundaries.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not replace routing or template patterns.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- `npm run lint` may still fail due to missing ESLint configuration in the repo root; record the outcome instead of skipping it silently.  
  [Source: package.json]
- Keep SSR safety intact and avoid browser-only APIs in routed-page render paths.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- Likely touch points:
  - existing routed pages in `src/pages/`
  - existing templates in `src/templates/`
  - possibly shared routed-page presentation helpers in `src/components/`
- Potential new file:
  - a caregiver-relevant routed page or routed content entry, if that is the cleanest way to satisfy the acceptance criteria
- Do not create backend files, API contracts, or data-layer artifacts for this story.

### Testing Requirements

- Run `npm run typecheck`
- Attempt `npm run lint`
- Manually verify:
  - direct entry into recipes, learn, downloads/resources, and other key public routes makes sense without homepage context
  - cross-links connect related public sections naturally
  - caregiver-relevant guidance is reachable through a clear routed path
  - page hierarchy and readability hold on mobile and desktop

### Previous Story Intelligence

- Story 1.1 established task-oriented shell navigation and a stronger public shell; routed pages should now feel coherent within that shell rather than compensating for missing top-level navigation.
- Story 1.2 repositioned the homepage as a dual-entry decision surface; this story should make sure users can continue discovery after leaving the homepage instead of falling into disconnected content islands.
- Stories 1.1 and 1.2 both documented that `npm run lint` is currently blocked by missing ESLint configuration. Treat that as an environmental limitation unless repo setup changes.

### Current Implementation Baseline

- Existing routed public pages already include:
  - `/recipes`
  - `/learn`
  - multiple `/learn/*` guides
  - `/downloads`
  - `/testing`
  - `/heat-map`
  - `/submit-recipe`
- Existing Gatsby templates already cover:
  - recipe detail pages via `src/templates/recipe.tsx`
  - learn article pages via `src/templates/learn-article.tsx`
- Current gaps and weak spots:
  - internal linking between sections is uneven
  - some pages still feel like isolated documents rather than part of one topical system
  - caregiver-relevant guidance does not appear to have a clear dedicated routed entry today

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3:-Discoverable-Public-Content-and-Topical-Routing]
- PRD web application requirements and structured public content expectations: [Source: _bmad-output/planning-artifacts/prd.md#Web-Application-Specific-Requirements]
- UX homepage-to-content journey and task-oriented navigation guidance: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#User-Journey-Flows]
- UX consistency and navigation patterns: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation-Patterns]
- Architecture frontend constraints and public rendering rules: [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- Current public route baseline: [Source: src/pages/]
- Current template baseline: [Source: src/templates/]
- Previous story files: [Source: _bmad-output/implementation-artifacts/1-1-public-site-shell-and-trust-navigation.md] [Source: _bmad-output/implementation-artifacts/1-2-homepage-with-dual-entry-points.md]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from epics, PRD, UX, architecture, project context, current routed pages, current templates, and prior Epic 1 story learnings
- Added a new caregiver landing route and threaded cross-links through recipes, downloads, testing, and routed content templates
- Updated routed-layout SEO/context handling so direct-entry pages carry stronger page purpose and adjacent next steps

### Completion Notes List

- Added a new routed caregiver entry page at `/caregivers` and surfaced it from learning, recipes, downloads, testing, and templates
- Improved stand-alone entry quality by adding explicit next-step links on recipe and learn article templates
- Tightened discoverability across routed pages so users can move between recipes, learning, downloads, testing, and caregiver support without returning to the homepage
- Fixed `TopicLayout` to pass its description through to `Layout`, improving metadata consistency for routed topic pages
- `npm run typecheck` passed
- `npm run lint` is still blocked by missing ESLint configuration in the repository root
- Manual browser verification of cross-links and route hierarchy is still pending in the local environment

### File List

- _bmad-output/implementation-artifacts/1-3-discoverable-public-content-and-topical-routing.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/TopicLayout.tsx
- src/pages/caregivers.tsx
- src/pages/downloads.tsx
- src/pages/learn/index.mdx
- src/pages/recipes.tsx
- src/pages/testing.tsx
- src/templates/learn-article.tsx
- src/templates/recipe.tsx

### Change Log

- Added a caregiver landing route and cross-linked it through the routed public experience
- Strengthened stand-alone routed pages with clearer next actions and cross-section discovery links
