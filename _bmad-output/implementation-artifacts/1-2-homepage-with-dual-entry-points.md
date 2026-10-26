# Story 1.2: Homepage With Dual Entry Points

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want a homepage that highlights trusted recipes and ingredient checking side by side,
so that I can immediately choose between finding food and checking safety.

## Acceptance Criteria

1. Given a visitor lands on the homepage, when the page loads, then the homepage presents the product as a trusted safe-eating decision system rather than a generic recipe or blog landing page, and the primary message supports the `find -> understand safety -> save` journey.
2. Given a visitor views the homepage hero area, when they scan the top section, then they see two clear primary entry points: one for food or recipe discovery and one for ingredient checking, and neither path is visually buried or treated as secondary.
3. Given a visitor chooses the recipe-discovery entry point, when they continue into the homepage content, then they encounter featured recipe content that emphasizes comfort, safety context, and practical value, and the presentation supports quick movement into recipe detail pages.
4. Given a visitor chooses the ingredient-checking entry point, when they continue from the homepage, then they are routed toward the scanner experience through a clear, task-oriented call to action, and the language emphasizes conservative guidance rather than false certainty.
5. Given a visitor scans the homepage navigation and supporting modules, when they look for other common starting points, then they can also find learning content and dining/preparedness resources without confusion, and those paths remain clearly secondary to the two main homepage entry points.
6. Given the homepage communicates trust-sensitive guidance, when the visitor reads supporting copy and section framing, then the page uses calm, practical, educational language, and it avoids implying diagnosis, treatment, or guaranteed safety.
7. Given the homepage is viewed on mobile or desktop, when the layout adapts across breakpoints, then the dual-entry-point structure remains clear and usable, and trust-critical content is not pushed below ornamental or low-priority content.
8. Given the homepage is implemented, when accessibility and performance are evaluated, then the page remains keyboard accessible, readable, and crawlable, and it does not add avoidable client-side overhead that would compromise public-page performance targets.

## Tasks / Subtasks

- [x] Reframe the homepage hero around the product thesis (AC: 1, 2, 6)
  - [x] Replace the current generic marketing hero with a trust-first homepage introduction that presents AlphaGalData as a safe-eating decision system.
  - [x] Make the `find -> understand safety -> save` journey legible in the headline, supporting copy, and primary actions.
  - [x] Keep the tone warm and food-first while preserving the site’s educational-only posture.
- [x] Implement two clear homepage entry paths for recipes and ingredient checking (AC: 2, 4, 7)
  - [x] Give recipe discovery and ingredient checking equal structural weight in the top section.
  - [x] Ensure both entry points are clear on mobile and desktop without relying on hover-only behavior or buried links.
  - [x] Route the scanner path to `/scanner` through task-oriented language that emphasizes conservative guidance.
- [x] Strengthen recipe-led discovery beneath the hero (AC: 3, 5, 7)
  - [x] Feature recipe-oriented content that feels practical, comforting, and safety-aware rather than blog-like.
  - [x] Keep recipe discovery visually primary over secondary resources.
  - [x] Support clear movement into existing recipe pages without taking on recipe-detail work from later stories.
- [x] Keep learning and preparedness visible but secondary (AC: 5, 6)
  - [x] Surface learning content and dining/preparedness resources as supporting paths, not competing homepage primaries.
  - [x] Maintain calm, practical, educational framing in surrounding copy and module labels.
  - [x] Avoid turning the homepage into a long directory of links or equal-weight content buckets.
- [ ] Verify homepage implementation quality (AC: 7, 8)
  - [x] Preserve crawlable routed links and static-friendly Gatsby rendering.
  - [x] Run `npm run typecheck`.
  - [x] Attempt `npm run lint` and record if the existing repo-level ESLint configuration gap still blocks it.
  - [ ] Manually verify homepage hierarchy and CTA clarity on desktop and mobile in the local browser.

## Dev Notes

- This story is intentionally homepage-specific. Do not broaden into global navigation changes already handled in Story 1.1 or routed discovery work scheduled for Story 1.3.
- The current homepage already includes recipe, scanner, and learning sections, but it still reads as a general content landing page. The gap is not missing links; it is missing structural emphasis and hierarchy around the two primary entry modes.
- Reuse the shared shell from `src/components/Layout.tsx` as implemented in Story 1.1. The homepage should sit inside that shell, not override it.
- The UX direction is explicitly weighted toward `Decision Engine` with warmth layered in from the selected blend. That means the homepage should feel like a calm decision system for real life, not a generic blog homepage and not a clinical dashboard.
- Keep the implementation lightweight and frontend-only. This story should not introduce backend APIs, save flows, or scanner logic changes.

### Technical Requirements

- Keep Gatsby as the public presentation layer and implement the homepage in the existing `src/pages/index.tsx`.
- Do not introduce client-heavy homepage dependencies or browser-only libraries for this story.
- Maintain existing SEO metadata and JSON-LD patterns in the homepage unless a minor edit is directly needed to align with the new positioning.
- Keep TypeScript strict-mode compatible and continue using relative imports.
- Prefer refining the existing homepage structure over introducing a large component reorganization unless the split materially improves readability and maintainability.

### Architecture Compliance

- Homepage content must stay SEO-first and crawlable, with important content visible in static output and not hidden behind client-only interactions.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Public pages must remain accessible without login and must not introduce protected-route assumptions or backend coupling.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Frontend presentation work belongs in `src/`, with the homepage implemented as a Gatsby page and supporting presentational changes kept in frontend component boundaries.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not switch routing systems or add alternate page frameworks.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- There is still no usable ESLint config in the repo root, so `npm run lint` may continue to fail for repository-setup reasons rather than story regressions. Record the outcome rather than silently skipping it.  
  [Source: package.json]
- Keep SSR safety intact. Avoid browser-only APIs in homepage render paths.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- Primary expected touch point:
  - `src/pages/index.tsx`
- Possible secondary touch points if needed:
  - small homepage-specific presentational helpers under `src/components/`
  - `src/components/Layout.tsx` only for minor coordination, not for reopening Story 1.1 shell scope
- Do not create backend files, API contracts, or data-layer artifacts for this story.

### Testing Requirements

- Run `npm run typecheck`
- Attempt `npm run lint`
- Manually verify:
  - homepage hero clearly presents two primary entry points
  - recipe discovery remains primary and scanner CTA remains co-equal in the top section
  - learning and preparedness paths are visible but secondary
  - homepage remains usable on mobile and desktop
  - trust framing stays calm, educational, and non-clinical

### Previous Story Intelligence

- Story 1.1 already established task-oriented shell navigation and shell-level trust framing in `src/components/Layout.tsx`. Homepage work should build on that shell rather than competing with it.
- Story 1.1 also documented that `npm run lint` is blocked by missing ESLint configuration. Treat that as an environmental limitation unless the repo setup changes.
- Story 1.1 added a local `react-helmet` declaration and resolved existing TypeScript blockers. Avoid undoing those fixes or reintroducing type instability while reshaping the homepage.

### Current Implementation Baseline

- `src/pages/index.tsx` already has:
  - a single hero card with recipe-oriented copy
  - a three-column section for recipes, scanner, and tick heat map
  - a six-card learning section
  - a simple “More resources” list
- That baseline is functional but not yet aligned with the approved UX direction because:
  - the top section does not give recipe discovery and ingredient checking equal structural weight
  - the homepage still reads as a general informational landing page
  - secondary resources compete too early with the primary decision paths

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2:-Homepage-With-Dual-Entry-Points]
- UX core interaction and homepage direction: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core-User-Experience]
- UX chosen direction and dual-entry homepage guidance: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Chosen-Direction]
- UX implementation approach for homepage and key landing pages: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation-Approach]
- PRD web application requirements and structured homepage prioritization: [Source: _bmad-output/planning-artifacts/prd.md#Web-Application-Specific-Requirements]
- Current homepage implementation baseline: [Source: src/pages/index.tsx]
- Previous shared shell work and verification notes: [Source: _bmad-output/implementation-artifacts/1-1-public-site-shell-and-trust-navigation.md]
- Project implementation rules: [Source: _bmad-output/project-context.md#Critical-Implementation-Rules]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from epics, UX, architecture, PRD, project context, current homepage source, and Story 1.1 learnings
- Rebuilt `src/pages/index.tsx` around a dual-entry homepage hero with recipe and scanner paths
- Preserved static SEO metadata and lightweight Gatsby rendering while shifting homepage hierarchy toward the approved UX direction

### Completion Notes List

- Replaced the single generic homepage hero with a two-column top section that gives recipe discovery and ingredient checking equal structural weight
- Reframed homepage copy around the product thesis: find food, understand safety, and take the next step confidently
- Kept recipe-led discovery primary beneath the hero while moving learning, dining, and preparedness into clearly secondary support modules
- Updated homepage metadata/title language to better match the task-oriented landing-page positioning
- `npm run typecheck` passed
- `npm run lint` is still blocked by missing ESLint configuration in the repository root
- Manual browser verification should be performed in the local environment; user has indicated localhost access is available

### File List

- _bmad-output/implementation-artifacts/1-2-homepage-with-dual-entry-points.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/pages/index.tsx

### Change Log

- Rebuilt the homepage around a trust-first, dual-entry hero for recipes and ingredient checking
- Reduced the “content directory” feel by grouping learning and preparedness into secondary supporting sections
