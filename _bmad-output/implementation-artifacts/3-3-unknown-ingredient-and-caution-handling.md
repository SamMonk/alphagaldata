# Story 3.3: Unknown Ingredient and Caution Handling

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want clear explanation and safer next-step guidance when ingredients are ambiguous, cautionary, or not confidently classified,
so that I am not misled into treating uncertainty as safety.

## Acceptance Criteria

1. Given a submitted ingredient cannot be confidently classified, when the scanner returns the result, then the product explicitly marks it as `unknown` rather than leaving it unclassified or silently omitted, and it pairs that result with `research_before_buying`.
2. Given a submitted ingredient falls into a cautionary category rather than a confirmed higher-risk category, when the scanner displays the result, then the product marks it as `caution`, and it pairs that result with `verify_before_using`.
3. Given a visitor reviews an `unknown` or `caution` result, when they expand or inspect the explanation, then the product explains what is known, what remains uncertain, and why the classification is conservative, and it avoids language that implies universal safety or diagnosis.
4. Given a result is supported by editorial caution or mixed evidence rather than stronger public-health support, when the source explanation is shown, then the UI distinguishes source posture clearly, and it helps the visitor understand why the tool is being cautious.
5. Given a visitor encounters ambiguous or partially parsed ingredient output, when the result list is rendered, then the scanner preserves those ambiguous cases as visible decision points, and it does not flatten them into false "safe" interpretations.
6. Given the user needs a safer next step after an `unknown` or `caution` result, when the result is presented, then the scanner provides a practical next action such as reviewing source details, checking related education, or returning to safer alternatives, and the flow does not end in a dead stop.
7. Given unknown and caution handling are evaluated for trust and accessibility, when those states appear on desktop or mobile, then they remain readable, color-independent, and positioned clearly in the result flow, and they preserve confidence without minimizing uncertainty.
8. Given the scanner handles uncertain results in production, when backend and frontend behavior are reviewed, then `unknown` remains a normal designed outcome rather than a server error, and technical failures are kept distinct from trust-status outcomes.

## Tasks / Subtasks

- [ ] Strengthen the scanner contract for uncertainty/source posture if needed (AC: 1, 3, 4, 8)
  - [ ] Review `src/contracts/scanner.ts` and add only the smallest additive fields needed to represent uncertainty posture clearly, such as a source posture or evidence posture field if the UI truly needs it.
  - [ ] Keep `unknown` and `caution` as trust outcomes, not errors.
  - [ ] Avoid introducing parallel client-only meaning that drifts from the scanner contract.
- [ ] Improve `unknown` rendering as a first-class designed outcome (AC: 1, 3, 5, 6, 7, 8)
  - [ ] Ensure `unknown` items remain visible in the classification list and are never hidden simply because the system could not classify them confidently.
  - [ ] Pair every `unknown` result with `research_before_buying` and explanation text that clearly says what remains unclear.
  - [ ] Make `unknown` look intentional and supported, not like a broken or partial response.
- [ ] Deepen `caution` explanation and next-step guidance (AC: 2, 3, 4, 6, 7)
  - [ ] Ensure `caution` items explain why source verification still matters and avoid overstating certainty.
  - [ ] Pair every `caution` result with `verify_before_using` in summary and item-level UI.
  - [ ] Make it clear when the scanner is being conservative because sourcing varies, evidence is mixed, or ingredient naming is ambiguous.
- [ ] Add source-posture or evidence explanation to relevant results (AC: 3, 4, 6, 7)
  - [ ] Extend scanner result UI to distinguish stronger source-backed guidance from editorial caution or mixed-evidence caution where data supports it.
  - [ ] Reuse or introduce a small trust/source callout pattern under `src/components/scanner/` rather than burying nuance in generic paragraph text.
  - [ ] Keep source explanation concise, readable, and clearly subordinate to the main next action.
- [ ] Preserve ambiguous cases as visible decision points (AC: 5, 6, 8)
  - [ ] Do not collapse partially parsed or uncertain ingredients into “no issue” messaging.
  - [ ] Where the scanner has insufficient certainty, preserve that ambiguity in the result UI and route the user toward the safer next step.
  - [ ] Keep technical failure messaging distinct from `unknown` trust outcomes.
- [ ] Add practical next-step routes for uncertainty-heavy results (AC: 6, 7)
  - [ ] For `unknown` or `caution` results, provide useful follow-up cues such as reviewing the source note, checking ingredients again, or moving toward related education/scanner help.
  - [ ] Avoid dead-end messaging that tells the user only to “be careful” without any next move.
  - [ ] Keep those routes aligned with the product’s educational-only posture.
- [ ] Preserve accessibility and responsive clarity (AC: 3, 6, 7)
  - [ ] Ensure uncertainty-related explanations are readable on mobile, keyboard accessible, and understandable without color alone.
  - [ ] Keep caution/unknown meaning in the main reading flow rather than behind hover-only or visually hidden interactions.
  - [ ] Preserve confidence through honest structure and clear sequencing: what is known, what is unclear, what to do next.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7, 8)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - `unknown` results remain visible and clearly paired with `research_before_buying`
    - `caution` results remain visible and clearly paired with `verify_before_using`
    - source/evidence posture is understandable where shown
    - technical failures still look different from uncertainty outcomes
    - the uncertainty-heavy result flow remains readable on mobile and keyboard-only use
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 3.2 already established the structured result-state UI for scanner outcomes. Story 3.3 should deepen the meaning of `unknown` and `caution`, not redesign the entire result surface again.
- The key product risk here is false reassurance. Uncertainty has to remain visible and explicit. The scanner should help the user act under uncertainty, not hide it.
- Architecture already treats `unknown` as a normal designed outcome and distinguishes trust outcomes from technical failures. This story should make that distinction visible in the UI.
- Keep this scoped to explanation quality, source posture, and safer next steps. Story 3.4 will connect scanner outcomes to broader label-reading and cross-contamination guidance.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind. Keep new code in TypeScript and use relative imports only.
- Shared scanner types remain in `src/contracts/scanner.ts`; only add fields when the UI actually needs them.
- Reusable scanner UI should continue to live in `src/components/scanner/`.
- `src/pages/scanner.tsx` should compose contract-driven components and services, not invent new trust logic ad hoc.

### Architecture Compliance

- `unknown` must remain a designed outcome, not a server error.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns]
- Canonical trust vocabulary and next-action fields must remain standardized.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Source posture values should be standardized where used, for example editorial caution or mixed evidence.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Pattern Examples]

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
  - `src/components/scanner/`
  - `src/contracts/scanner.ts` if a small additive field is needed
  - `src/services/scanner/classify.ts` if source posture normalization belongs in the shared service
- Do not touch unless implementation genuinely requires it:
  - recipe/save files
  - unrelated auth, Terraform, or editorial files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - `unknown` is presented as a normal, explicit scanner outcome
  - `caution` preserves clear next-step guidance without overstating certainty
  - source posture is understandable where shown
  - technical failures remain distinct from uncertainty outcomes
  - mobile and keyboard-only use remain clear and operable
  - `npm run build` succeeds without SSR regressions

### Previous Story Intelligence

- Story 3.1 established scanner contracts/services and paste-first submission boundaries.
- Story 3.2 extracted the structured summary card and classification list for pasted ingredient results.
- The scanner page still contains a separate legacy barcode-product branch, so this story should stay focused on uncertainty handling in the structured result path unless a small targeted improvement is necessary.

### Current Implementation Baseline

- `src/pages/scanner.tsx` already renders pasted ingredient results through `ScannerResultSummaryCard` and `ScannerClassificationList`.
- `src/contracts/scanner.ts` already exposes `risk_tier`, `next_action`, explanation, and `source_note`.
- `src/services/scanner/classify.ts` already distinguishes `known_risk`, `caution`, and `unknown` in the shared result contract.
- The next gap is explanation depth and confidence framing: unknown/caution states still need richer reasoning and safer next-step guidance.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3:-Unknown-Ingredient-and-Caution-Handling]
- Current scanner implementation baseline: [Source: src/pages/scanner.tsx] [Source: src/contracts/scanner.ts] [Source: src/services/scanner/classify.ts] [Source: src/components/scanner/ScannerClassificationList.tsx] [Source: src/components/scanner/ScannerResultSummaryCard.tsx]
- Architecture rules for uncertainty and source posture: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- UX guidance for uncertainty and caution communication: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Trust / Source Callout] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines]
- Previous story file: [Source: _bmad-output/implementation-artifacts/3-2-ingredient-classification-and-risk-results.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 3 acceptance criteria, the structured result UI introduced in Story 3.2, and architecture/UX guidance that treats uncertainty as a designed trust state rather than a technical failure.
- Repo inspection confirmed the scanner already renders canonical trust tiers, so Story 3.3 is framed around explanation depth, source posture, and safer next-step guidance for `unknown` and `caution`.

### Completion Notes List

- Marked Story 3.2 as `done` in sprint tracking per user confirmation.
- Promoted Story 3.3 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 3.3 implementation file anchored to the existing scanner contract/service and structured result UI.

### File List

- _bmad-output/implementation-artifacts/3-3-unknown-ingredient-and-caution-handling.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
