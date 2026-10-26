# Story 2.2: Recipe Safety Notes and Trust Explanation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want recipe safety notes that explain why a recipe may be safer, where caution applies, and what substitutions or warnings matter,
so that I can make an informed food decision without guessing.

## Acceptance Criteria

1. Given a visitor views a recipe with trust-sensitive guidance, when they review the recipe page, then the page includes a dedicated safety-note treatment rather than burying safety details in generic body copy, and the treatment is visually and structurally distinct from standard recipe instructions.
2. Given a recipe includes safety reasoning, when the visitor reads the safety-note section, then the content explains why the recipe may be safer in alpha-gal terms, and it distinguishes ingredients, substitutions, caution points, or uncertainty in plain language.
3. Given a recipe includes cautionary or uncertain guidance, when that guidance is displayed, then the page clearly communicates what is known, what may vary by person, and what safer next step is recommended, and it avoids false certainty or oversimplified universal safety claims.
4. Given a recipe contains relevant substitution guidance, when a visitor reviews safety notes, then substitutions are connected directly to the safety explanation, and the user can understand how substitutions affect the trustworthiness of the recipe.
5. Given a recipe has multiple levels of detail, when the visitor wants either a quick read or deeper understanding, then the page supports an immediately visible safety summary with an option for expanded detail where appropriate, and the user does not need to leave the recipe flow to understand the core safety logic.
6. Given risk or caution language appears within recipe safety notes, when status labels or cues are shown, then they use the product's standardized trust vocabulary and next-action framing, and the meaning does not rely on color alone.
7. Given a visitor uses the recipe page on desktop or mobile, when the safety-note treatment is rendered, then it remains readable, accessible, and positioned near the decision moment, and it does not get pushed behind low-priority content or hover-only interactions.
8. Given the recipe safety-note system is implemented, when content is reviewed for trust and moderation posture, then the guidance aligns with the site's educational-only standards, and it does not introduce unsafe medical claims, unverified treatment advice, or dangerous ingredient assertions.

## Tasks / Subtasks

- [x] Audit the current recipe safety-note baseline after Story 2.1 (AC: 1, 2, 4, 5, 6, 7)
  - [x] Review `src/templates/recipe.tsx`, the new recipe frontmatter fields, and current featured recipe content.
  - [x] Identify which safety-note needs are already partially covered by `safety_summary`, `substitutions`, `caution_points`, and `safety_notes`, and which parts still need a clearer dedicated treatment.
  - [x] Keep this story focused on trust explanation and presentation, not recipe save controls or backend persistence.
- [x] Implement a dedicated recipe safety-note treatment (AC: 1, 2, 3, 4, 5, 6)
  - [x] Create or extract a reusable recipe safety-note block that is visually and structurally distinct from generic instructions.
  - [x] Present clear sections for what is known, what requires caution, substitutions, and the safest next action in plain language.
  - [x] Support both a quick-read summary and a deeper explanation path without forcing users off the recipe page.
- [x] Align recipe safety language with the product trust vocabulary (AC: 2, 3, 6, 8)
  - [x] Ensure recipe safety-note labels and next-step phrasing align with the product's canonical trust framing.
  - [x] Avoid universal safety claims and make individual variation explicit where needed.
  - [x] Preserve the educational-only posture and avoid drifting into diagnostic or medical-advice language.
- [x] Refine responsive and accessible placement of safety-note content (AC: 5, 6, 7)
  - [x] Keep safety-note content near the decision moment and before later save interactions.
  - [x] Ensure the treatment remains readable and understandable on mobile and desktop.
  - [x] Preserve semantic structure, keyboard usability, and color-independent meaning.
- [x] Verify implementation quality (AC: 7, 8)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and record any remaining warnings or blockers.
  - [ ] Manually verify recipe safety-note behavior in the local browser.

## Dev Notes

- Story 2.1 already turned the recipe page into a stronger decision page and introduced content-backed fields for `safety_summary`, `substitutions`, and `caution_points`. Story 2.2 should build on that baseline rather than replacing it.
- The goal here is a more intentional and reusable trust explanation system on recipes, not save behavior. Do not drift into Story 2.3 save interactions or backend save APIs.
- UX direction explicitly calls for a dedicated `Safety Note Block` custom component at trust-critical moments. This story is the natural place to establish that pattern on recipe detail pages.
- Keep the implementation depth-first: a small number of polished, reusable trust-critical patterns is preferable to adding many ad hoc recipe-specific variants.

### Technical Requirements

- Keep Gatsby recipe pages and templates as the implementation surface.
- Preserve static rendering and content-backed recipe detail logic.
- Preserve TypeScript strict-mode compatibility and continue using relative imports.
- Favor reusable trust/safety presentation components if the implementation naturally supports them.
- Do not implement backend save APIs, auth changes, or DynamoDB work in this story.

### Architecture Compliance

- Recipe pages remain public Gatsby-rendered routes and must stay crawlable, lightweight, and independently understandable.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Future save flows belong to shared frontend services and backend APIs; this story should not embed premature save-state logic in the recipe safety treatment.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Frontend trust/safety work belongs in recipe templates and reusable frontend components under the public UI structure, not new backend modules.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Framework baseline remains Gatsby 5 + React 18 + TypeScript + Tailwind. Do not introduce alternate routing, rendering, or UI frameworks.  
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- Browser-only behavior must remain SSR-safe; avoid any safety-note implementation that depends on client-only rendering for core trust content.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- `npm run lint` is now configured and should be run as part of story verification even if unrelated warnings remain.  
  [Source: package.json] [Source: .eslintrc.cjs]

### File Structure Requirements

- Likely touch points:
  - `src/templates/recipe.tsx`
  - `src/components/` with a likely reusable trust/safety component extracted if warranted
  - `content/recipes/` for content alignment and field usage
  - `static/admin/config.yml` only if the current recipe content model still needs a small editorial refinement
- Avoid backend, Terraform, or API handler changes for this story.

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - dedicated safety-note treatment on recipe pages
  - quick-read and deeper-explanation behavior on desktop and mobile
  - trust labels and next actions remain understandable without color alone
  - safety-note content stays near the decision moment and before later save actions

### Previous Story Intelligence

- Story 2.1 already added recipe-level trust fields and reorganized the page into a stronger decision-first structure.
- Story 1.6 established responsive and accessibility patterns that should continue to govern trust-critical content placement and readability.
- Story 1.5 made recipe detail pages more likely landing pages via featured discovery, so safety-note content must stand on its own for direct-entry visitors.

### Current Implementation Baseline

- Current recipe pages now include:
  - `safety_summary`
  - `safety_notes`
  - `substitutions`
  - `caution_points`
  - stronger above-the-fold trust context
  - related recipe / scanner / education onward paths
- Current likely gaps relative to this story:
  - the safety content is improved but still template-specific rather than a clear dedicated safety-note system
  - trust reasoning can be made more explicit and reusable
  - deeper explanation and standardized next-action language can be made more intentional

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-2.2:-Recipe-Safety-Notes-and-Trust-Explanation]
- Relevant UX decisions: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Custom-Component-Strategy] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design-&-Accessibility]
- Relevant architecture decisions: [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- Current recipe content/editorial baseline: [Source: static/admin/config.yml] [Source: content/recipes/]
- Previous story files: [Source: _bmad-output/implementation-artifacts/2-1-recipe-detail-pages-with-safety-context.md] [Source: _bmad-output/implementation-artifacts/1-6-responsive-and-accessible-public-experience.md]

## Dev Agent Record

### Agent Model Used

gpt-5.2

### Debug Log References

- Story context synthesized from Epic 2 acceptance criteria, UX trust-component guidance, architecture frontend boundaries, and the completed Story 2.1 recipe-detail baseline
- Audit confirmed the current recipe page has trust content, but it is still distributed across multiple sections rather than expressed through one dedicated, reusable safety-note treatment

### Completion Notes List

- Added a reusable `RecipeSafetyNoteBlock` pattern in `src/components/RecipeSafetyNoteBlock.tsx` so recipe trust explanation is no longer scattered across multiple unrelated template sections.
- Updated `src/templates/recipe.tsx` to use the dedicated safety-note treatment with explicit `What is known`, `What may vary by person or product`, `Substitutions that keep the logic intact`, and `Safest next step` framing.
- Added an expandable deeper-trust explanation so recipe pages support both quick-read and more detailed reasoning without leaving the recipe flow.
- Preserved the educational-only posture and aligned the recipe trust block with `caution` plus `verify before using` language rather than false certainty.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits successfully with the same six pre-existing warnings in unrelated brownfield files (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`, `src/pages/scanner.tsx`).
- Manual browser verification remains pending.

### File List

- _bmad-output/implementation-artifacts/2-2-recipe-safety-notes-and-trust-explanation.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/RecipeSafetyNoteBlock.tsx
- src/templates/recipe.tsx
