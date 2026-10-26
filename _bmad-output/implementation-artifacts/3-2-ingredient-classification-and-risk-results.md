# Story 3.2: Ingredient Classification and Risk Results

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want structured ingredient classification results with clear risk labels and next actions,
so that I can understand what the scanner thinks and what I should do next.

## Acceptance Criteria

1. Given a visitor submits a valid ingredient list, when the backend classification flow completes successfully, then the scanner returns structured results for the submitted ingredients, and the results are rendered through a consistent result-state UI rather than raw text output.
2. Given classified results are displayed, when the visitor reviews the outcome, then each ingredient or grouped result uses the product's canonical trust vocabulary: `known_risk`, `caution`, or `unknown`, and each result is paired with the appropriate next action.
3. Given a result is classified as `known_risk`, when the result is shown to the visitor, then it is paired with the next action `avoid`, and the UI explains why the ingredient was flagged.
4. Given a result is classified as `caution`, when the result is shown to the visitor, then it is paired with the next action `verify_before_using`, and the UI explains why caution applies without overstating certainty.
5. Given a result is classified as `unknown`, when the result is shown to the visitor, then it is paired with the next action `research_before_buying`, and the UI makes clear that uncertainty is a designed outcome rather than a silent failure.
6. Given a visitor reviews scanner results, when they need more than the status label alone, then the result UI provides explanation and context for the classification, and the meaning does not rely on color alone.
7. Given scanner results are shown on desktop or mobile, when the result list and status cards render, then they remain readable, accessible, and logically grouped, and they preserve the same trust meaning across breakpoints.
8. Given the scanner result contract is implemented, when frontend and backend integration are reviewed, then the frontend renders backend-provided risk tiers and next actions directly, and it does not invent separate client-side classification rules.

## Tasks / Subtasks

- [x] Normalize scanner result rendering around the shared contract (AC: 1, 2, 8)
  - [x] Use the `src/contracts/scanner.ts` types from Story 3.1 as the single result-shape source for the scanner page and any scanner UI components.
  - [x] Ensure the UI renders `risk_tier`, `next_action`, `explanation`, and optional `source_note` directly from contract data rather than deriving alternate status names in the page layer.
  - [x] Remove or isolate leftover legacy scanner result code paths that still imply page-owned risk semantics for pasted ingredient results.
- [x] Build a reusable scanner summary/result-state card (AC: 1, 2, 3, 4, 5, 6, 7)
  - [x] Create a reusable scanner result summary component, likely under `src/components/scanner/`, that presents the overall result state with clear trust language and next action.
  - [x] Map `known_risk -> avoid`, `caution -> verify_before_using`, and `unknown -> research_before_buying` visibly and consistently.
  - [x] Keep the result summary understandable without relying on color alone.
- [x] Build a reusable ingredient classification list (AC: 1, 2, 3, 4, 5, 6, 7)
  - [x] Render per-ingredient or grouped classifications in a list treatment that shows ingredient name, matched text or relevant context, risk label, next action, and explanation.
  - [x] Support optional source/context note display without making it mandatory for every item.
  - [x] Keep the layout readable on narrow screens without requiring side-by-side comparison.
- [x] Improve explanation quality for each trust state (AC: 3, 4, 5, 6)
  - [x] Make `known_risk` items clearly explain why they were flagged.
  - [x] Make `caution` items clearly explain why source verification still matters without overstating certainty.
  - [x] Make `unknown` items clearly communicate designed uncertainty rather than failure or absence of logic.
- [x] Replace transitional scanner result copy with structured result UI (AC: 1, 2, 6, 8)
  - [x] Update `src/pages/scanner.tsx` so pasted ingredient results no longer stop at transitional service-boundary messaging once structured results are available.
  - [x] Keep barcode/photo results working, but do not expand this story into the full barcode backend integration if the structured pasted-result path is the only implemented contract path.
  - [x] Avoid raw text dumps or ad hoc paragraphs where a consistent result-state UI should exist.
- [x] Preserve accessibility and responsive behavior (AC: 6, 7)
  - [x] Ensure headings, labels, and status blocks are semantically structured and screen-reader-friendly.
  - [x] Preserve readable spacing, controlled widths, and stacked mobile behavior for summary plus classification list.
  - [x] Ensure next-action messaging remains visible and understandable in grayscale and keyboard-only use.
- [x] Keep architecture and boundary discipline (AC: 1, 2, 8)
  - [x] Keep trust interpretation centralized in the scanner service/contract layer and render backend-provided semantics directly.
  - [x] Do not add alternate client-side synonym sets like `high risk`, `check source`, or other drift from canonical vocabulary in the structured result path.
  - [x] Do not add unrelated save-flow, account, moderation, or backend-infrastructure work in this story.
- [x] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7, 8)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - pasted ingredient results render through a consistent summary card and classification list
    - `known_risk`, `caution`, and `unknown` each show the expected next action
    - result meaning is understandable without color alone
    - mobile layout preserves legibility and action clarity
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 3.1 already introduced the scanner contract and service wrapper and moved paste-first submission behind that boundary. Story 3.2 should capitalize on that by polishing the result presentation around the contract, not by redoing submission work.
- The current scanner page still carries some transitional/legacy result behavior, especially around barcode product display and older watchlist language. This story should continue the cleanup for structured pasted-result rendering without forcing the full barcode backend story yet.
- The acceptance criteria are about result communication quality: canonical trust vocabulary, clear next actions, readable explanation, and no client-side reinvention of backend semantics.
- Keep this scoped to result-state UI and rendering discipline. Story 3.3 will go deeper on `unknown` and `caution` explanation patterns and source-posture nuance.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind. Keep new code in TypeScript and use relative imports only.
- Shared scanner result types remain in `src/contracts/scanner.ts`.
- Reusable scanner UI should live under `src/components/scanner/` when extraction improves clarity.
- `src/pages/scanner.tsx` should compose scanner services and result components, not implement new trust-classification logic.
- Preserve browser-only dynamic import patterns for camera/OCR code so SSR builds do not break.

### Architecture Compliance

- Scanner responses must use canonical trust vocabulary and `next_action` fields, and the frontend should render those directly.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- All scanner-related consumers should consume the same typed contract, and scanner result state should be normalized once per response.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]
- Gatsby page components should not own trust-critical classification rules.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Library / Framework Requirements

- Browser-only libraries must remain dynamically imported to avoid SSR `window is not defined` failures.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- New shared code should follow the repo’s TypeScript conventions and avoid path aliases.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- `npm run typecheck` and `npm run lint` remain required verification steps.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- Likely edits:
  - `src/pages/scanner.tsx`
  - `src/components/scanner/` for result UI extraction
  - `src/contracts/scanner.ts` only if a small additive contract refinement is genuinely required
  - `src/services/scanner/classify.ts` only if result normalization needs to move out of the page
- Do not touch unless implementation genuinely requires it:
  - recipe/save files
  - unrelated auth, Terraform, or editorial files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - pasted-result UI uses structured summary and list treatments
  - each trust state maps to the correct next action
  - explanations remain readable and color-independent
  - mobile and keyboard-only use stay clear and operable
  - `npm run build` succeeds without SSR regressions

### Previous Story Intelligence

- Story 3.1 created `src/contracts/scanner.ts` and `src/services/scanner/classify.ts` and refactored the scanner page so paste-first submission goes through the shared scanner service boundary.
- Story 3.1 intentionally left barcode product rendering on a legacy path and scoped structured result work for the next story. This story should improve pasted-result rendering first rather than broadening scope unnecessarily.
- Prior Epic 2 work established trust-first copy, accessible status communication, and clear action hierarchy. Scanner results should keep that same discipline.

### Current Implementation Baseline

- `src/pages/scanner.tsx` already renders pasted results using the shared scanner contract and service, but the result experience still has transitional/legacy messaging and could be decomposed into clearer reusable scanner result components.
- `src/contracts/scanner.ts` already exposes `risk_tier`, `next_action`, summary data, and explanation fields.
- `src/services/scanner/classify.ts` already normalizes pasted ingredient classification output into the shared contract and provides a local fallback adapter in MVP environments.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-3.2:-Ingredient-Classification-and-Risk-Results]
- Current scanner implementation baseline: [Source: src/pages/scanner.tsx] [Source: src/contracts/scanner.ts] [Source: src/services/scanner/classify.ts]
- Architecture rules for scanner contracts and rendering: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- UX guidance for scanner result states and trust communication: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Risk Tier Label With Next Action] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Implementation Strategy] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines]
- Previous story file: [Source: _bmad-output/implementation-artifacts/3-1-ingredient-scanner-input-and-submission.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 3 acceptance criteria, the scanner contract/service introduced in Story 3.1, and architecture/UX guidance for canonical risk-tier rendering and next-action clarity.
- Repo inspection confirmed the result path is functional but still transitional, so Story 3.2 is framed around structured result UI and rendering discipline rather than scanner submission plumbing.

### Completion Notes List

- Added `src/components/scanner/ScannerResultSummaryCard.tsx` to present the overall scanner state with canonical trust language and the associated next action.
- Added `src/components/scanner/ScannerClassificationList.tsx` to render grouped ingredient findings with explanation, matched text context, and optional source notes directly from the shared scanner contract.
- Updated `src/pages/scanner.tsx` so pasted ingredient results use the structured result components instead of transitional inline result messaging, while still leaving barcode product display on the separate legacy path for now.
- Kept result rendering aligned with `risk_tier` and `next_action` from `src/contracts/scanner.ts` instead of reintroducing alternate client-side status names.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits with the same five remaining brownfield warnings (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`) and no scanner warnings.
- `HOME=/tmp npm run build` passed on 2026-04-20.
- Manual browser verification remains pending.

### File List

- _bmad-output/implementation-artifacts/3-2-ingredient-classification-and-risk-results.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/scanner/ScannerClassificationList.tsx
- src/components/scanner/ScannerResultSummaryCard.tsx
- src/pages/scanner.tsx
