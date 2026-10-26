# Story 1.4: Trust and Safety Framing on Public Content

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want the site to clearly explain its educational-only posture and trust-sensitive boundaries,
so that I understand how to use the guidance without mistaking it for medical advice.

## Acceptance Criteria

1. Given a visitor lands on a trust-sensitive public page, when they view recipe, scanner-adjacent, preparedness, testing, or medical-alert-related content, then the page presents clear educational-only framing, and it does not imply diagnosis, treatment, or clinical authority.
2. Given a visitor reads public safety guidance, when the product communicates food, ingredient, or preparedness recommendations, then the language remains practical and conservative, and it avoids guaranteed safety claims or false certainty.
3. Given a visitor encounters content about testing, bracelet guidance, tattoo guidance, or emergency-preparedness topics, when those sections are displayed, then the page includes trust-sensitive explanatory framing appropriate to the topic, and it reinforces that AlphaGalData is a decision-support and education resource, not a diagnostic system.
4. Given a visitor moves between public pages with different levels of sensitivity, when they encounter trust-critical content areas, then educational-only disclaimers and trust framing appear consistently where needed, and they do not clutter low-risk content unnecessarily.
5. Given a visitor encounters uncertain or cautionary safety guidance, when the page explains the recommendation, then the content distinguishes clearly between what is known, what is uncertain, and what safer next step is recommended, and it preserves confidence without overstating evidence.
6. Given public content is reviewed for moderation and editorial standards, when trust-sensitive content is published, then it aligns with rules prohibiting unsafe medical claims, unverified treatment advice, and dangerous safety assertions, and those constraints are reflected in the published public framing.
7. Given the trust-framing system is implemented, when users access the site from desktop or mobile, then the educational-only posture remains readable, accessible, and appropriately placed in the content hierarchy, and it does not depend on modal-only or hidden interactions to be understood.
8. Given search engines or first-time visitors encounter AlphaGalData as an entry point, when they land directly on a trust-sensitive public page, then the page contains enough visible framing to prevent obvious misunderstanding of the site’s role, and it still preserves the calm, non-alarmist tone defined by the UX direction.

## Tasks / Subtasks

- [x] Audit current trust-sensitive public pages and framing patterns (AC: 1, 3, 4, 8)
  - [x] Review recipes, scanner-adjacent pages, testing, downloads, tattoo/medical-alert content, and related learning pages for existing disclaimers and trust language.
  - [x] Identify where trust framing is missing, inconsistent, too weak, or too repetitive.
  - [x] Keep the audit focused on public content surfaces rather than moderation/admin workflows.
- [x] Standardize educational-only trust framing where needed (AC: 1, 2, 3, 4, 7, 8)
  - [x] Introduce or refine reusable trust-framing copy patterns for high-sensitivity pages.
  - [x] Make sure the site presents itself as educational decision support rather than diagnosis or treatment authority.
  - [x] Avoid adding disclaimers everywhere; keep low-risk pages readable and uncluttered.
- [x] Improve uncertainty and caution language on public guidance pages (AC: 2, 5, 6)
  - [x] Strengthen wording around uncertainty, caution, and safer next steps where current copy overreaches or underspecifies limits.
  - [x] Preserve a practical tone that helps users act without promising universal safety.
  - [x] Align trust-sensitive wording with the risk-language direction already chosen in UX and architecture.
- [x] Ensure direct-entry trust-sensitive pages make the site’s role legible (AC: 1, 3, 7, 8)
  - [x] Improve visible framing on search-entry pages so first-time visitors understand what AlphaGalData is and is not.
  - [x] Keep trust framing in the content flow rather than burying it in footer-only treatment.
  - [x] Preserve mobile readability and non-modal behavior.
- [ ] Verify trust-framing quality (AC: 7, 8)
  - [x] Run `npm run typecheck`.
  - [x] Attempt `npm run lint` and record if the repo-level ESLint configuration gap still blocks it.
  - [ ] Manually verify several trust-sensitive public pages in the local browser.

## Dev Notes

- This story is about public trust framing, not legal-policy overhauls, backend moderation logic, or full copy rewrites of every page.
- The current repo already has scattered trust language such as “Educational only; not medical advice,” but it appears uneven across routed pages and templates. The goal is consistency with restraint.
- Story 1.1 already added shell-level trust framing. Story 1.4 should complement that with page-level framing on trust-sensitive content, not duplicate the same message mechanically on every page.
- Story 1.3 improved routed discoverability; this story should make sure the newly improved direct-entry pages also explain the site’s role clearly when users land from search.
- Keep this work frontend-only and content-focused. Do not drift into moderation/admin implementation from Epic 5.

### Technical Requirements

- Keep Gatsby public pages and templates as the implementation surface.
- Favor small, repeated trust-framing modules or consistent inline structures over one-off wording chaos.
- Preserve static rendering, crawlability, and accessible page structure.
- Keep TypeScript strict-mode compatible and continue using relative imports.
- Avoid modal-only disclaimers or client-heavy trust logic.

### Architecture Compliance

- Public pages must remain educational, public-first, and crawlable, with trust meaning visible in static output.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- The public MVP must not present itself as a clinical or diagnostic system, and trust-sensitive wording should reflect that boundary consistently.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Frontend public-content changes belong in `src/`, across pages, templates, and presentational components only.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not introduce alternate routing or rendering systems.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- `npm run lint` may still fail due to missing ESLint configuration in the repo root; record that outcome if unchanged.  
  [Source: package.json]
- Keep SSR safety intact and avoid browser-only APIs in shared trust-framing components.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- Likely touch points:
  - trust-sensitive pages in `src/pages/`
  - routed templates in `src/templates/`
  - possibly a shared trust-framing helper/component in `src/components/`
- Do not create backend files, admin workflows, or moderation logic for this story.

### Testing Requirements

- Run `npm run typecheck`
- Attempt `npm run lint`
- Manually verify:
  - recipe pages
  - testing page
  - downloads / medical-alert-related pages
  - learn pages with diagnosis / treatment / tattoo guidance
  - scanner-adjacent pages or scanner landing copy
- Confirm trust framing is visible where needed and not sprayed across every low-risk surface.

### Previous Story Intelligence

- Story 1.1 already established shell-level trust framing and task-oriented navigation.
- Story 1.2 repositioned the homepage around safe decision-making and conservative ingredient guidance.
- Story 1.3 improved direct-entry routes and cross-links, which raises the importance of consistent page-level trust framing on those entry pages.
- All recent stories documented the same repo-level lint blocker: missing ESLint configuration.

### Current Implementation Baseline

- Existing trust-sensitive framing already appears in:
  - `src/components/Layout.tsx`
  - `src/templates/recipe.tsx`
  - `src/pages/testing.tsx`
  - many `src/pages/learn/*.mdx` guides
  - downloads / tattoo / disclosure pages
- Current weaknesses:
  - wording is inconsistent from page to page
  - some high-sensitivity pages rely on a footer-like disclaimer rather than clear in-flow framing
  - some pages speak with stronger certainty than the selected UX posture recommends

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-1.4:-Trust-and-Safety-Framing-on-Public-Content]
- UX trust posture and emotional response guidance: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Desired-Emotional-Response]
- UX consistency patterns for feedback, uncertainty, and next actions: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback-Patterns]
- PRD trust-sensitive public requirements and no-medical-advice posture: [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
- Current trust-sensitive public files: [Source: src/pages/] [Source: src/templates/] [Source: src/components/Layout.tsx]
- Previous story files: [Source: _bmad-output/implementation-artifacts/1-1-public-site-shell-and-trust-navigation.md] [Source: _bmad-output/implementation-artifacts/1-2-homepage-with-dual-entry-points.md] [Source: _bmad-output/implementation-artifacts/1-3-discoverable-public-content-and-topical-routing.md]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from epics, UX, architecture, PRD, current public trust-language usage, and prior Epic 1 story learnings
- Added a reusable trust-notice component and applied it to the scanner, recipes, testing, downloads, cards, and selected high-sensitivity learn pages
- Softened scanner result wording so “no match” reads as a conservative watchlist result rather than guaranteed safety

### Completion Notes List

- Added `src/components/TrustNotice.tsx` as a reusable page-level trust-framing block for high-sensitivity public content
- Standardized trust framing across scanner, recipe template, testing, downloads, cards, and key learn pages without adding clutter to every routed page
- Updated scanner copy and result language to better distinguish educational guidance from guarantees of safety
- Preserved shell-level framing from Story 1.1 while making direct-entry trust-sensitive pages clearer on their own
- `npm run typecheck` passed
- `npm run lint` is still blocked by missing ESLint configuration in the repository root
- Manual browser verification of trust-sensitive pages is still pending in the local environment

### File List

- _bmad-output/implementation-artifacts/1-4-trust-and-safety-framing-on-public-content.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/TrustNotice.tsx
- src/pages/cards/index.tsx
- src/pages/downloads.tsx
- src/pages/learn/alpha-gal-101.mdx
- src/pages/learn/medical-alert-tattoo.mdx
- src/pages/learn/symptoms-and-diagnosis.mdx
- src/pages/learn/treatment-and-management.mdx
- src/pages/scanner.tsx
- src/pages/testing.tsx
- src/templates/recipe.tsx

### Change Log

- Introduced a reusable trust-framing component for high-sensitivity public pages
- Standardized educational-only and uncertainty language across key entry pages and guidance surfaces
