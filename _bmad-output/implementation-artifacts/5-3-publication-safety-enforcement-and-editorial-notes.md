# Story 5.3: Publication Safety Enforcement and Editorial Notes

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a moderator,
I want the system to prevent unreviewed or unsafe content from becoming public and to support internal moderation notes,
so that trust decisions are recorded clearly and publication mistakes are avoided.

## Acceptance Criteria

1. Given a submission exists in the moderation system, when it has not been explicitly approved, then it cannot appear on public pages, featured content areas, or public resource listings, and publication eligibility is enforced by backend-controlled state.
2. Given a moderator is reviewing a submission, when they need to capture editorial reasoning or safety concerns, then they can record internal moderation notes on the submission, and those notes are not exposed on the public site.
3. Given a moderator records internal notes while reviewing content, when the notes are saved, then they remain associated with the submission's moderation record, and they support later follow-up, revision review, or auditability.
4. Given a submission contains unsafe medical claims, unverified treatment advice, or dangerous ingredient or safety assertions, when a moderator evaluates it, then the system supports rejecting or withholding publication for that content, and the trust rules remain enforceable as part of moderation state.
5. Given a submission is approved, when it becomes eligible for later public use, then approval status is clearly distinguishable from pending, rejected, or revision-needed states, and the approval does not bypass normal content placement or editorial surfacing rules automatically.
6. Given the moderation record is used in protected workflows, when moderators or editors access it, then they can see moderation status and internal notes together, and unauthorized public users cannot access that internal information.
7. Given publication safety enforcement is reviewed architecturally, when backend and frontend responsibilities are evaluated, then moderation status, notes, and publication rules are enforced server-side, and the implementation does not rely on hidden client-side checks to protect public trust.

## Tasks / Subtasks

- [ ] Extend moderation records with internal notes support (AC: 2, 3, 6, 7)
  - [ ] Add internal moderation note fields to the shared moderation contract rather than storing notes in page-local state only.
  - [ ] Preserve a distinction between public submission content and protected editorial reasoning.
  - [ ] Keep note storage attached to the moderation record so later workflow steps can read the same audit context.
- [ ] Add internal notes capture to the protected moderation workflow (AC: 2, 3, 6)
  - [ ] Extend the moderation UI created in Story 5.2 so moderators can write and save internal notes alongside moderation status.
  - [ ] Make it clear those notes are internal-only and are not public-facing explanation copy.
  - [ ] Ensure moderators and editors can view existing notes inside protected workflows without exposing them on public pages.
- [ ] Make publication eligibility explicit and separate from moderation review state (AC: 1, 4, 5, 7)
  - [ ] Add a backend-shaped publication eligibility concept or equivalent derived contract that prevents queued, rejected, and revision-requested submissions from being treated as public-ready.
  - [ ] Keep approval as eligibility for later editorial use only, not automatic publishing.
  - [ ] Ensure unsafe submissions can remain withheld even when review is complete.
- [ ] Prevent unapproved submissions from surfacing in public-facing paths (AC: 1, 4, 5, 7)
  - [ ] Review current public recipe, featured, and resource entry points for any path that could later consume submission records.
  - [ ] Make the trust boundary explicit in service wrappers or filtering helpers rather than relying on hidden UI conventions.
  - [ ] Avoid introducing any public path that reads internal moderation fields or unapproved records.
- [ ] Keep moderation/publication rules behind protected service boundaries (AC: 1, 4, 6, 7)
  - [ ] Extend shared moderation services to persist internal notes and publication-safe state together.
  - [ ] Keep public submission services and protected moderation/publication enforcement concerns separate.
  - [ ] Preserve standard `{ data, meta, error }` response envelopes and `snake_case` payload fields for trust-sensitive interactions.
- [ ] Preserve clarity in moderation outcomes (AC: 4, 5, 6)
  - [ ] Keep `approved`, `queued`, `rejected`, and `revision_requested` distinct in operator-facing UI and contracts.
  - [ ] Show that approval does not equal immediate placement on public pages.
  - [ ] Preserve visible cues for why unsafe content is being withheld or rejected.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - internal moderation notes can be saved and reloaded in protected workflows
    - public routes do not expose internal notes or unapproved submission data
    - approved state remains distinct from direct publication
    - unsafe submissions can remain withheld or rejected cleanly
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 5.3 deepens the moderation model created in Stories 5.1 and 5.2. It is about publication blocking and internal editorial reasoning, not broader editorial content management for trusted public pages.
- Story 5.2 already created the protected moderation route, shared moderation contracts, and moderation action service boundary. Story 5.3 should extend those primitives instead of creating a second moderation record model.
- The architecture is explicit that `submission_queue` owns moderation state, review notes, and audit transitions, and that publication safety must not rely on frontend-only checks.
- The main product risk here is accidental trust leakage: internal notes must stay protected, and approval must not be treated as equivalent to automatic public placement.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Build from the moderation primitives added in Story 5.2:
  - `src/contracts/submissions.ts`
  - `src/contracts/moderation.ts`
  - `src/services/moderation/review.ts`
  - `src/pages/moderation.tsx`
- Preserve the repo's existing Cognito/OIDC client posture for protected moderation/editorial surfaces.
- Keep trust-sensitive persistence and filtering behind shared service wrappers and backend-shaped contracts, not page-local heuristics.
- Do not turn approved submissions into automatically rendered public content as part of this story.

### Architecture Compliance

- The `submission_queue` domain owns story/recipe submissions, moderation state, review notes, and audit transitions.  
  [Source: _bmad-output/planning-artifacts/architecture.md]
- Moderation/publication rules must not be enforced only in the frontend, and accidental publication of unreviewed submissions must be prevented.  
  [Source: _bmad-output/planning-artifacts/architecture.md] [Source: _bmad-output/planning-artifacts/prd.md]
- Protected admin/moderation routes and services must remain distinct from public-facing routes and APIs.  
  [Source: _bmad-output/planning-artifacts/architecture.md#MVP Authentication Model]
- `moderation_status` remains part of the canonical trust-sensitive contract vocabulary and should not be replaced with ad hoc UI-only labels.  
  [Source: _bmad-output/planning-artifacts/architecture.md]

### UX / Content Guidance

- Internal notes should read like operator reasoning, not public explanation copy.
- Moderator-facing language should continue to distinguish `approval` from `publication`.
- Withholding unsafe content should feel deliberate and operationally clear, not like a missing-feature fallback.
- No public route should reveal internal note text, moderation rationale, or protected state metadata.

### File Structure Requirements

- Likely edits:
  - `src/contracts/submissions.ts`
  - `src/contracts/moderation.ts`
  - `src/services/moderation/review.ts`
  - `src/pages/moderation.tsx`
  - any shared helper introduced only if it centralizes publication-eligibility filtering cleanly
- Review for possible trust-boundary touchpoints:
  - public routes or helpers that could later consume moderated submission data
  - operator-facing status rendering in the moderation page
- Do not touch unless implementation genuinely requires it:
  - broader editorial management workflows for public pages/resources in Story 5.4
  - future account or trusted-member boundary work in Story 5.5
  - unrelated scanner, recipe, download, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - internal notes persist and reload in the moderation workflow
  - public pages do not expose notes or unpublished submissions
  - rejection and revision-requested states remain withheld from public eligibility
  - approval does not automatically create public placement
  - `npm run build` succeeds without SSR/auth regressions

### Previous Story Intelligence

- Story 5.1 established the public intake boundary and queued-for-review semantics.
- Story 5.2 established the protected moderation route, queue/detail UI, and moderation decision recording through shared service wrappers.
- The next implementation gap is publication safety enforcement tied to moderation records and protected internal notes that survive later follow-up.

### Current Implementation Baseline

- `src/pages/moderation.tsx` already blocks unauthorized access, lists queued submissions, loads detail records, and records moderation decisions.
- `src/contracts/moderation.ts` currently defines queue/detail/decision contracts but does not yet include explicit internal moderation note fields or publication eligibility metadata.
- `src/services/moderation/review.ts` persists moderation decisions through `/admin/submissions` when configured and falls back to local queue storage otherwise.
- `src/contracts/submissions.ts` already distinguishes `queued`, `approved`, `rejected`, and `revision_requested` moderation states.
- Public submission and moderation are now separated cleanly, but publication blocking and internal editorial note support are not yet modeled explicitly.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-5.3:-Publication-Safety-Enforcement-and-Editorial-Notes]
- Previous implementation context: [Source: _bmad-output/implementation-artifacts/5-2-protected-moderation-review-workflow.md]
- Current moderation baseline: [Source: src/pages/moderation.tsx] [Source: src/services/moderation/review.ts] [Source: src/contracts/moderation.ts]
- Architecture and PRD constraints: [Source: _bmad-output/planning-artifacts/architecture.md] [Source: _bmad-output/planning-artifacts/prd.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Sprint tracking showed Story 5.2 in `review`; user confirmation marked it complete and unlocked Story 5.3 as the next backlog item.
- Epic 5 planning artifacts and architecture notes were reviewed to isolate Story 5.3 from Story 5.4, keeping the focus on moderation records, internal notes, and publication blocking rather than broader editorial management.
- Local repo inspection confirmed moderation queue and decision flows now exist, while internal moderation notes and explicit publication-eligibility enforcement are not yet modeled.

### Completion Notes List

- Marked Story 5.2 as `done` in sprint tracking per user confirmation.
- Promoted Story 5.3 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 5.3 implementation file anchored to the current moderation route, moderation service boundary, and architecture requirements around internal notes and publication safety enforcement.
- Extended moderation contracts with explicit `publication_eligibility` and internal-only moderation notes so review state and public eligibility are no longer conflated.
- Updated the moderation service fallback path to persist publication blocking, withholding, and internal note data alongside moderation decisions.
- Extended the protected moderation UI to show publication safety status, save internal moderation notes, and keep approval distinct from public placement.
- Verified the implementation with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/5-2-protected-moderation-review-workflow.md
- _bmad-output/implementation-artifacts/5-3-publication-safety-enforcement-and-editorial-notes.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/moderation.ts
- src/services/moderation/review.ts
- src/pages/moderation.tsx
