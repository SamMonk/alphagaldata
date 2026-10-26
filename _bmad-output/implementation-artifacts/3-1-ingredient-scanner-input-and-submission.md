# Story 3.1: Ingredient Scanner Input and Submission

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to paste or enter an ingredient list into a scanner,
so that I can get conservative guidance about whether the ingredients may be risky for alpha-gal.

## Acceptance Criteria

1. Given a visitor navigates to the scanner experience, when the scanner page loads, then they can access a clearly labeled input area for ingredient-list entry, and the page explains that the tool provides conservative educational guidance rather than diagnosis.
2. Given a visitor has an ingredient list from packaging or another source, when they paste or type the list into the scanner input, then the input accepts freeform ingredient text in a practical paste-first format, and the user can review or edit the text before submission.
3. Given a visitor is ready to check ingredients, when they submit the scanner input, then the request is sent through the backend classification flow, and the interface shows a clear in-progress state while evaluation is happening.
4. Given a visitor submits empty, malformed, or unusable scanner input, when validation runs, then the page presents a clear, corrective error message, and the user can recover without losing the rest of the scanner context.
5. Given a visitor uses the scanner on desktop or mobile, when they interact with the input and submit controls, then the scanner remains touch-friendly, keyboard accessible, and readable, and the core interaction does not depend on complex or hidden UI behavior.
6. Given the scanner page is part of the public MVP, when it is accessed without login, then the experience works as a public tool within the routed site structure, and it does not require realtime infrastructure or account setup.
7. Given the scanner input experience is evaluated for performance and architecture alignment, when the page is rendered and submitted, then it uses shared frontend service wrappers and backend validation boundaries, and it does not embed trust-critical classification logic directly in Gatsby page components.

## Tasks / Subtasks

- [x] Establish the scanner request contract and service wrapper (AC: 3, 4, 6, 7)
  - [x] Create `src/contracts/scanner.ts` with typed `snake_case` request/response shapes for scanner submission, including a standard `{ data, meta, error }` envelope and machine-readable error codes.
  - [x] Create `src/services/scanner/classify.ts` to centralize scanner submission behind a shared async function such as `classifyIngredients(input_text)`.
  - [x] Keep page components out of API orchestration details; `src/pages/scanner.tsx` should call the shared service rather than embedding ad hoc trust-critical fetch logic.
- [x] Refocus the scanner page around paste-first ingredient submission (AC: 1, 2, 3, 5, 6)
  - [x] Keep or improve the existing `Paste ingredients` textarea in `src/pages/scanner.tsx` with visible label, practical helper copy, and enough space for ingredient-list review/editing.
  - [x] Preserve the current educational framing on page load, including a clear reminder that the tool is conservative decision support and not diagnosis.
  - [x] Ensure submit controls are touch-friendly, keyboard accessible, and readable on mobile and desktop.
- [x] Add frontend validation and recovery behavior (AC: 2, 4, 5)
  - [x] Reject empty input before submission with a specific corrective message.
  - [x] Add lightweight usability validation for obviously unusable input without inventing classification rules in the page component.
  - [x] Preserve the pasted text after validation or submission errors so the visitor can correct and resubmit without starting over.
- [x] Implement a clear in-progress state for scanner submission (AC: 3, 5)
  - [x] When submission starts, present a calm loading state that clearly communicates ingredient interpretation is in progress.
  - [x] Prevent confusing duplicate submissions while a request is in flight.
  - [x] Keep existing trust copy visible while loading rather than replacing the whole page with a spinner-only state.
- [x] Move scanner submission toward the intended backend boundary (AC: 3, 6, 7)
  - [x] Replace or isolate the current client-side watchlist submission path for pasted ingredients so the page submits through the shared scanner service boundary instead of treating page code as classification truth.
  - [x] Do not re-implement final risk-result rendering logic in this story beyond what is necessary to support the submission flow; Story 3.2 owns the structured result-state UI.
  - [x] Do not add login, realtime infrastructure, or unrelated profile/account setup.
- [x] Preserve current scanner capabilities without broadening scope unnecessarily (AC: 1, 2, 5, 6, 7)
  - [x] Keep existing barcode/photo/OCR behavior working unless a small refactor is needed for the new submission boundary.
  - [x] Avoid expanding this story into the full barcode product-result overhaul; the core requirement here is ingredient input and submission.
  - [x] If legacy watchlist UI remains temporarily during the transition, keep it clearly subordinate to the new service-oriented submission path and do not entrench page-owned classification rules further.
- [x] Align with architecture, privacy, and brownfield constraints (AC: 6, 7)
  - [x] Preserve the public routed Gatsby experience with no login requirement.
  - [x] Keep scanner-specific logic under scanner contracts/services rather than recipe or generic page files.
  - [x] Do not introduce health-tracking storage, global state libraries, or a frontend-only synonym set for trust vocabulary.
- [x] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - a visitor can paste and edit an ingredient list before submission
    - empty input shows a corrective error without clearing the textarea
    - submission shows an in-progress state and blocks duplicate clicks
    - the scanner remains usable on mobile and keyboard-only navigation
    - the page remains public and routable with no login
    - `npm run build` completes without SSR errors related to scanner changes

## Dev Notes

- The repo already has a substantial scanner page in `src/pages/scanner.tsx` with barcode scanning, OCR, Open Food Facts lookup, and a client-side watchlist verdict path. Story 3.1 should not pretend the scanner starts from scratch.
- The architectural direction is explicit, though: trust-critical classification logic belongs behind backend contracts and shared service wrappers, not inside Gatsby page components. This story is the transition point for the input/submission surface.
- Keep the implementation scope disciplined. The goal is a strong input and submission boundary, not the final structured results system. Story 3.2 will own the richer risk-tier result rendering.
- Paste-first behavior is the clearest path through the acceptance criteria. Existing barcode/photo affordances can remain, but they should not dominate the implementation plan for this story.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind. Keep new code in TypeScript and use relative imports only.
- Shared scanner request/response types should live in `src/contracts/scanner.ts`.
- Frontend-side scanner orchestration should live in `src/services/scanner/` rather than being embedded directly in `src/pages/scanner.tsx`.
- Keep browser-only imports like `@zxing/browser` and `tesseract.js` dynamically imported inside event handlers or `useEffect` paths so SSR builds do not break.
- Preserve strict TypeScript compatibility and the repo’s current lint/typecheck expectations.

### Architecture Compliance

- Scanner/classification flows should go through HTTP JSON API contracts and use canonical trust vocabulary like `known_risk`, `caution`, `unknown`, and `next_action`.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Trust-critical classification logic must not stay embedded in Gatsby page components; page files should compose services and UI, not own domain rules.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- Scanner client calls should go through shared frontend service wrappers under scanner-specific service and contract modules.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- MVP remains public-first with no login for scanner use.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]

### Library / Framework Requirements

- Browser-only libraries must stay dynamically imported to avoid SSR `window is not defined` failures.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- New shared code should follow the repo’s TypeScript conventions and avoid path aliases.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- `npm run typecheck` and `npm run lint` remain required verification steps.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- New files:
  - `src/contracts/scanner.ts`
  - `src/services/scanner/classify.ts`
- Likely edits:
  - `src/pages/scanner.tsx`
  - optional new scanner UI helpers under `src/components/scanner/` if the page needs to be decomposed
- Do not touch unless implementation genuinely requires it:
  - recipe pages/templates
  - save-service files in `src/services/recipes/`
  - unrelated backend, Terraform, or auth files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - paste-first input remains editable before submission
  - empty or unusable input produces corrective messaging
  - submission clearly enters and exits a loading state
  - duplicate submissions are blocked while pending
  - scanner interactions remain accessible and usable on mobile and keyboard
  - `npm run build` succeeds without SSR regressions

### Previous Story Intelligence

- Epic 2 established the project’s trust-first, accessible public interaction patterns on recipe pages and save flows. Scanner work should keep the same clarity, touch-target, and recovery-state discipline.
- Story 2.4 reinforced the current pattern of centralizing interactive logic in contracts/services plus small reusable UI surfaces. Story 3.1 should apply that same structure to scanner submission.
- The current scanner page already contains client-owned watchlist logic; this story should start reducing that coupling rather than adding more business logic to the page.

### Current Implementation Baseline

- `src/pages/scanner.tsx` already provides:
  - paste ingredient input
  - barcode camera/photo flows via `@zxing/browser`
  - OCR ingredient extraction via `tesseract.js`
  - Open Food Facts lookup
  - client-side watchlist verdict banners and match highlighting
- The key gap relative to this story is architectural, not purely UI:
  - scanner submission and trust-critical classification behavior still live in the page component instead of scanner contracts/services and backend-oriented submission boundaries.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-3.1:-Ingredient-Scanner-Input-and-Submission]
- Current scanner baseline: [Source: src/pages/scanner.tsx]
- Architecture boundaries and scanner patterns: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- UX scanner/form guidance: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Form Patterns] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Loading states] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines]
- Project TypeScript / SSR rules: [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- Previous story file: [Source: _bmad-output/implementation-artifacts/2-4-return-to-saved-recipes.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 3 acceptance criteria, the current scanner page implementation, and architecture guidance that requires scanner submission to move behind shared contracts and services.
- Repo inspection confirmed `src/pages/scanner.tsx` already contains paste, barcode, OCR, and watchlist flows, so Story 3.1 is framed as a transition from page-owned submission logic to the intended scanner service boundary.

### Completion Notes List

- Added `src/contracts/scanner.ts` with typed request, response, summary, and error shapes using `snake_case` fields and the standard `{ data, meta, error }` envelope.
- Added `src/services/scanner/classify.ts` so paste-first scanner submission now runs through a shared scanner service boundary with an environment-configurable API endpoint and a local fallback adapter when no backend endpoint is configured yet.
- Refactored `src/pages/scanner.tsx` so pasted ingredient submission uses the shared service, keeps validation and recovery state in the UI layer, and no longer embeds the paste submission classification path directly in the page component.
- Preserved barcode, photo, and OCR flows while making the architectural split explicit: paste-first submission now uses the service boundary, while barcode product display remains on the legacy browser-side path until later scanner stories expand structured result rendering.
- Improved the paste-first scanner UX with visible labels, helper copy, corrective validation, and a clear in-progress state that blocks duplicate submissions without clearing user input.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits with five remaining brownfield warnings (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`) and no scanner warnings.
- `HOME=/tmp npm run build` passed on 2026-04-20.
- Manual browser verification remains pending.

### File List

- _bmad-output/implementation-artifacts/3-1-ingredient-scanner-input-and-submission.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/scanner.ts
- src/services/scanner/classify.ts
- src/pages/scanner.tsx
