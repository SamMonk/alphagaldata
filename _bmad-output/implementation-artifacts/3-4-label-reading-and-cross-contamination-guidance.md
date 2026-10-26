# Story 3.4: Label-Reading and Cross-Contamination Guidance

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want scanner outcomes to connect me to label-reading and cross-contamination guidance,
so that I can make better real-world food decisions beyond a single ingredient check.

## Acceptance Criteria

1. Given a visitor receives scanner results, when they need more context than the classification alone, then the scanner provides clear paths to supporting guidance about label reading, suspicious ingredients, and cross-contamination, and those paths remain connected to the result the visitor is currently reviewing.
2. Given a visitor encounters an ingredient pattern that suggests caution or hidden risk, when related guidance is shown, then the product explains relevant label-reading concepts in practical language, and it helps the user understand what to watch for in real packaging or dining contexts.
3. Given a visitor needs guidance beyond ingredient names alone, when they review supporting education, then the product includes cross-contamination and dining-context considerations where relevant, and it keeps that guidance aligned with the site's educational-only posture.
4. Given a visitor moves from scanner output into educational content, when they follow related links or next actions, then the experience feels like one connected decision-support system, and the visitor can move back to recipes, scanner use, or preparedness resources without losing orientation.
5. Given supporting label-reading and contamination guidance is rendered on desktop or mobile, when the visitor reads or navigates it, then the content remains readable, accessible, and internally linked, and it does not require complex interactions to understand the next step.
6. Given scanner-linked education is reviewed for consistency, when trust language and navigation are evaluated, then the guidance uses the same risk vocabulary and next-action framing as the rest of the product, and it does not introduce conflicting terminology or separate trust models.

## Tasks / Subtasks

- [ ] Add scanner-linked follow-up guidance for uncertain or risky outcomes (AC: 1, 2, 4, 6)
  - [ ] Extend the scanner result surface so summary and/or item-level states can point users toward deeper education without burying the next action.
  - [ ] Keep those links connected to the active result context, especially for `known_risk`, `caution`, and `unknown` outcomes that need more explanation than a short classifier message can provide.
  - [ ] Reuse the canonical next-action vocabulary instead of inventing alternate labels for the education path.
- [ ] Introduce or refine educational content for label reading and cross-contamination (AC: 1, 2, 3, 5)
  - [ ] Audit current learn pages under `src/pages/learn/` and decide whether to extend an existing guide or add dedicated MDX pages for label-reading and cross-contamination support.
  - [ ] Ensure the content explains practical packaging signals such as hidden ingredient wording, sourcing uncertainty, and what to verify with manufacturers or restaurants.
  - [ ] Include cross-contamination and dining-context considerations where they materially change the safest next step.
- [ ] Connect scanner results to the educational content as one flow (AC: 1, 3, 4, 6)
  - [ ] Add clear internal links or follow-up modules from scanner results into the relevant learn pages and preparedness resources.
  - [ ] Preserve user orientation with obvious return paths back to the scanner and useful onward paths to recipes or dining resources where appropriate.
  - [ ] Avoid dead ends where the user lands on an isolated article with no clear next move.
- [ ] Keep trust language and source posture consistent (AC: 2, 3, 6)
  - [ ] Align all new copy and UI labels with the existing scanner contract terms: `known_risk`, `caution`, `unknown`, `avoid`, `verify_before_using`, and `research_before_buying`.
  - [ ] Preserve the educational-only posture and avoid language that implies diagnosis, clinical authority, or guaranteed safety.
  - [ ] Keep explanation patterns consistent with the Trust / Source Callout direction established in UX guidance.
- [ ] Preserve accessibility and responsive readability (AC: 4, 5, 6)
  - [ ] Ensure scanner-linked education is understandable without color alone and remains readable on narrow screens.
  - [ ] Keep navigation and call-to-action labels explicit and keyboard reachable.
  - [ ] Avoid modal-heavy or hover-only educational affordances in the scanner result flow.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - scanner results expose clear paths to supporting guidance
    - label-reading and cross-contamination guidance feel connected to the current result
    - learn-content navigation provides an obvious path back to scanner use and onward to related resources
    - trust language stays aligned with canonical risk tiers and next actions
    - the linked education flow remains readable on mobile and keyboard-only use
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 3.1 introduced the shared scanner service boundary, Story 3.2 established the structured scanner result UI, and Story 3.3 deepened uncertainty/caution handling. Story 3.4 should build on that result surface by connecting it to broader label-reading and cross-contamination guidance rather than reworking classification logic again.
- Current learn content already includes practical ingredient and dining guidance in pages like `src/pages/learn/alpha-gal-101.mdx`, `src/pages/learn/treatment-and-management.mdx`, `src/pages/learn/faq.mdx`, and `src/pages/learn/dining-card-guide.mdx`. This story can extend those pages or add focused new MDX routes if the scanner needs clearer destination content.
- The product risk here is fragmentation. The scanner cannot feel like an isolated utility that leaves users stranded after a result. The education path should feel like a continuation of the same decision-support system.
- Keep the implementation conservative: link structured scanner results to focused educational support and internal navigation, not to a broad content redesign.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind. Keep interactive changes in TypeScript and content pages in the repo's existing MDX/Gatsby patterns.
- Shared scanner types remain in `src/contracts/scanner.ts`; do not add contract fields unless the scanner result UI truly needs them for the education handoff.
- Reusable scanner UI should continue to live in `src/components/scanner/`.
- Public educational pages should remain routed, crawlable Gatsby pages under `src/pages/learn/` unless there is a strong reason to place content elsewhere.
- Browser-only libraries must remain dynamically imported to avoid SSR `window is not defined` regressions.

### Architecture Compliance

- Trust-sensitive result meaning should continue to come from the canonical scanner contract rather than ad hoc page-level logic.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Technical failures and trust-status outcomes must remain distinct; educational follow-up should not obscure actual scanner errors.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns]
- The implementation must preserve the canonical trust vocabulary and avoid introducing alternate labels for the same state.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]

### UX / Content Guidance

- Use the scanner result surface to guide users toward practical education, not generic article dumps.
- Follow the `Trust / Source Callout` and `Risk Tier Label With Next Action` patterns where helpful so the supporting guidance reinforces, rather than competes with, the current result state.
- Keep the scanner-linked education readable as plain text, responsive on mobile, and free of hover-only meaning.
- Preserve one connected journey across scanner, learn content, recipes, and preparedness resources.

### File Structure Requirements

- Likely edits:
  - `src/pages/scanner.tsx`
  - `src/components/scanner/`
  - existing or new files under `src/pages/learn/`
  - shared content/navigation components only if required for consistent internal linking
- Likely reference content:
  - `src/pages/learn/alpha-gal-101.mdx`
  - `src/pages/learn/treatment-and-management.mdx`
  - `src/pages/learn/faq.mdx`
  - `src/pages/learn/dining-card-guide.mdx`
- Do not touch unless implementation genuinely requires it:
  - recipe save/persistence files
  - unrelated moderation, auth, Terraform, or deployment files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - scanner result cards and lists expose supporting guidance in a way that matches the active result
  - related educational content explains label-reading and contamination considerations in practical language
  - internal links preserve orientation between scanner, learn pages, recipes, and dining/preparedness resources
  - trust-critical meaning remains understandable on mobile and for keyboard-only navigation
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Story 3.1 moved pasted ingredient submission through the shared scanner service boundary.
- Story 3.2 extracted the structured scanner summary and classification list components.
- Story 3.3 strengthened `unknown` and `caution` handling so uncertainty is visible and actionable.
- The next gap is broader decision support: users need contextual education and practical follow-up once a result is shown.

### Current Implementation Baseline

- `src/pages/scanner.tsx` already renders structured classification results through `ScannerResultSummaryCard` and `ScannerClassificationList`.
- The learn hub already exists under `src/pages/learn/` with practical AGS guidance and internal links to scanner and dining resources.
- Existing content already mentions hidden ingredients, label-reading habits, and dining challenges, but the scanner flow does not yet present those resources as a connected next step.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-3.4:-Label-Reading-and-Cross-Contamination-Guidance]
- Scanner baseline: [Source: src/pages/scanner.tsx] [Source: src/components/scanner/ScannerResultSummaryCard.tsx] [Source: src/components/scanner/ScannerClassificationList.tsx]
- Existing education pages: [Source: src/pages/learn/alpha-gal-101.mdx] [Source: src/pages/learn/treatment-and-management.mdx] [Source: src/pages/learn/faq.mdx] [Source: src/pages/learn/dining-card-guide.mdx] [Source: src/pages/learn/index.mdx]
- Architecture rules for trust vocabulary and trust/error separation: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- UX guidance for source explanation, next-action framing, and connected trust flows: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Trust / Source Callout] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Risk Tier Label With Next Action] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines]
- Previous story file: [Source: _bmad-output/implementation-artifacts/3-3-unknown-ingredient-and-caution-handling.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 3 acceptance criteria, the scanner result UI established in Stories 3.1-3.3, and current learn-content routes already present in the Gatsby app.
- Repo inspection confirmed existing learn pages already cover hidden ingredients, dining guidance, and scanner references, so Story 3.4 is framed around creating a connected scanner-to-education flow rather than inventing an entirely new content domain.

### Completion Notes List

- Marked Story 3.3 as `done` in sprint tracking per user confirmation.
- Promoted Story 3.4 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 3.4 implementation file anchored to the existing scanner result UI and current learn-content routes.
- Added a scanner follow-up guidance module that connects structured results to label-reading, cross-contamination, recipes, and dining guidance without changing the scanner contract.
- Added a new routed learn page for practical label-reading and cross-contamination follow-up, and linked it from the learn hub.
- Verified with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/3-3-unknown-ingredient-and-caution-handling.md
- _bmad-output/implementation-artifacts/3-4-label-reading-and-cross-contamination-guidance.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/scanner/ScannerEducationGuidance.tsx
- src/pages/learn/index.mdx
- src/pages/learn/label-reading-and-cross-contamination.mdx
- src/pages/scanner.tsx
