# Story 5.2: Protected Moderation Review Workflow

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a moderator,
I want to review, approve, reject, or request revision on submitted content through a protected workflow,
so that only trustworthy content becomes eligible for public visibility.

## Acceptance Criteria

1. Given an authorized moderator accesses the moderation workflow, when they view the moderation interface, then they can see submitted recipes and stories awaiting review, and the workflow is protected from public or unauthorized access.
2. Given a moderator opens a submission for review, when they inspect the submitted content, then they can review the submission details in a form that supports safety, clarity, and editorial judgment, and the content is presented without implying that approval is automatic.
3. Given a moderator completes review of a submission, when they choose an action, then they can approve, reject, or request revision, and the chosen action is recorded as the current moderation status.
4. Given a moderator requests revision, when that decision is recorded, then the submission remains out of public view, and its status clearly distinguishes revision-needed content from approved content.
5. Given a moderator reviews trust-sensitive content, when they evaluate the submission, then the workflow supports enforcement against unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions, and those checks are part of the moderation decision path.
6. Given moderation actions affect publication safety, when a moderator saves a decision, then the result is enforced through backend-controlled moderation state, and the public site does not rely on frontend-only enforcement for publication boundaries.
7. Given a moderator uses the review workflow on supported devices, when they access or navigate the moderation interface, then the experience remains usable and clear, and key moderation actions are accessible only to authorized operators.

## Tasks / Subtasks

- [ ] Add a protected moderation entry point and review surface (AC: 1, 2, 7)
  - [ ] Introduce a dedicated moderation/admin route instead of extending the public submission page with hidden operator controls.
  - [ ] Use the repo's existing client-side auth posture as the starting point for access gating rather than inventing a second authentication pattern.
  - [ ] Keep the moderation UI clearly distinct from the public contribution flow so public users are never shown operator-only actions.
- [ ] Build a moderation queue view for pending submissions (AC: 1, 2, 7)
  - [ ] Show recipe and story submissions that are awaiting review with enough summary metadata for triage.
  - [ ] Make it clear which items are queued versus already actioned without implying that any submission is publishable by default.
  - [ ] Preserve responsive and keyboard-usable review navigation across supported breakpoints.
- [ ] Build a detailed moderation review form for a selected submission (AC: 2, 5, 7)
  - [ ] Present the submitted recipe or story content in a review-oriented layout that supports editorial judgment and safety review.
  - [ ] Surface moderation guidance around unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions as explicit review criteria.
  - [ ] Keep wording and hierarchy focused on review and trust enforcement rather than content editing or direct publication.
- [ ] Route moderation actions through a protected service boundary (AC: 3, 4, 6)
  - [ ] Add a shared moderation contract and service wrapper for reading queued submissions and recording moderation actions.
  - [ ] Ensure moderation actions use backend-owned `moderation_status` values rather than frontend-only flags.
  - [ ] Keep protected routes and service calls separate from the public submission intake endpoints introduced in Story 5.1.
- [ ] Support approve, reject, and request-revision actions explicitly (AC: 3, 4, 5, 6)
  - [ ] Give moderators clear actions for approve, reject, and request revision.
  - [ ] Make revision-needed status visibly distinct from approved and rejected outcomes.
  - [ ] Ensure success messaging describes recorded moderation state rather than automatic publication.
- [ ] Preserve trust and authorization boundaries in the UI (AC: 1, 5, 6, 7)
  - [ ] Show unauthorized or unauthenticated users a blocked state that does not expose moderation data.
  - [ ] Avoid leaking queued submission details into public pages, public routes, or client-only hidden sections.
  - [ ] Keep moderation/publication responsibility framed as backend-controlled even if the MVP uses lightweight local fallbacks during development.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - unauthorized visitors cannot access moderation content
    - authenticated moderators can see queued submissions and open details
    - approve, reject, and request-revision actions are recorded clearly
    - the review UI remains usable on desktop and mobile
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 5.2 is the first operator-only workflow in the project. It should establish the protected moderation surface and action path, not the deeper publication rules and internal notes that follow in Story 5.3.
- Story 5.1 already created the public intake boundary and submission contract/service wrapper. Story 5.2 should build on that work instead of creating a disconnected moderation model.
- The architecture is explicit that moderation and publication state must be enforced in backend service boundaries and that public and protected APIs remain separate.
- The current product risk is trust leakage through operator tooling. The moderation experience must not expose review data publicly, and it must not imply that approval equals immediate publication.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Protected moderation access should follow the repo's existing `react-oidc-context` / Cognito-oriented client pattern unless implementation discovers a stronger local repo constraint.
- Moderation client logic should live behind shared service wrappers and shared contracts rather than direct `fetch` calls inside page components.
- Protected moderation actions should follow the project's standard trust-sensitive `{ data, meta, error }` envelope and `snake_case` payload conventions.
- Keep the moderation workflow asynchronous and review-driven; do not add realtime notifications, collaborative editing, or direct public publishing shortcuts.

### Architecture Compliance

- Admin/moderation operations must be protected from the first release, and public APIs must remain separate from protected editorial/moderation APIs.  
  [Source: _bmad-output/planning-artifacts/architecture.md#MVP Authentication Model]
- Moderation-related client calls should go through shared service wrappers, not scattered page-level request logic.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API Naming Conventions]
- Moderation actions are trust-critical operations that must cross backend APIs, and moderation/publication rules must not be enforced only in the frontend.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API Boundaries]
- The product must prevent accidental publication of unreviewed user submissions.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Moderation UI should feel operationally clear, calm, and explicit rather than CMS-heavy or publication-happy.
- Unsafe medical claims, unverified treatment advice, and dangerous ingredient assertions should be visible moderation criteria, not implicit reviewer knowledge.
- Review actions should be worded as moderation state changes, not publication events.
- Unauthorized states should be unambiguous and should not expose queued submission details.

### File Structure Requirements

- Likely edits:
  - `src/pages/` for a protected moderation route and possibly a submission detail route
  - `src/services/` for moderation queue/review service wrappers
  - `src/contracts/` for moderation queue and action contracts
  - auth-related helpers only if needed to reuse the current protected-access pattern cleanly
- Build from existing work where practical:
  - `src/pages/auth.tsx`
  - `src/components/auth-provider-wrapper.js`
  - `src/contracts/submissions.ts`
  - `src/services/submissions/intake.ts`
- Do not touch unless implementation genuinely requires it:
  - public publication eligibility rules and internal moderation notes for Story 5.3
  - editorial content/resource management for Story 5.4
  - unrelated scanner, recipe, download, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - unauthorized access does not reveal moderation data
  - authenticated access can load moderation queue content
  - review detail pages or panels render recipe/story content clearly
  - approve, reject, and request-revision actions persist the intended moderation state
  - `npm run build` succeeds without SSR/auth regressions

### Previous Story Intelligence

- Story 5.1 replaced the public placeholder form with a real moderated submission intake flow and introduced shared submission contracts and services.
- The public flow now returns queued-for-review semantics only and keeps moderation/publication responsibility explicit.
- The next implementation gap is not more public submission UX; it is the protected operator workflow that can safely inspect and action queued submissions.

### Current Implementation Baseline

- `src/pages/submit-recipe.tsx` now supports moderated public recipe/story intake and should remain the public contribution path rather than doubling as the moderation UI.
- `src/contracts/submissions.ts` currently defines submission intake request/response shapes, including `submission_type` and `moderation_status`.
- `src/services/submissions/intake.ts` already establishes a shared submission service boundary with API-backed endpoints and a local fallback intake queue.
- `src/pages/auth.tsx` and `src/components/auth-provider-wrapper.js` show the current Cognito/OIDC client pattern already present in the repo and should inform how a protected moderation route is gated.
- There is not yet a moderation queue page, moderation detail route, or moderation action service wrapper in `src/services/`.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-5.2:-Protected-Moderation-Review-Workflow]
- Previous implementation context: [Source: _bmad-output/implementation-artifacts/5-1-public-submission-intake-for-recipes-and-stories.md]
- Current public submission baseline: [Source: src/pages/submit-recipe.tsx] [Source: src/services/submissions/intake.ts]
- Current auth baseline: [Source: src/pages/auth.tsx] [Source: src/components/auth-provider-wrapper.js]
- Architecture and moderation constraints: [Source: _bmad-output/planning-artifacts/architecture.md#MVP Authentication Model] [Source: _bmad-output/planning-artifacts/architecture.md#API Boundaries]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Sprint tracking showed Story 5.1 in `review`; user confirmation marked it complete and unlocked Story 5.2 as the next backlog item.
- Epic 5 planning and architecture documents were reviewed for moderation-specific constraints around protected admin access, backend-owned moderation state, and separate public versus protected APIs.
- Local repo inspection confirmed submission intake is now implemented, while moderation queue pages, moderation contracts, and moderation action services do not yet exist.

### Completion Notes List

- Marked Story 5.1 as `done` in sprint tracking per user confirmation.
- Promoted Story 5.2 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 5.2 implementation file anchored to the new public submission intake flow, the existing Cognito/OIDC auth baseline, and the architecture's protected moderation requirements.
- Added a protected `/moderation` route that uses the existing Cognito/OIDC client posture to block unauthenticated and unauthorized access before any moderation data is shown.
- Added moderation contracts and a shared moderation service wrapper for queue reads, submission detail reads, and approve/reject/request-revision actions.
- Extended the local fallback submission queue so moderation decisions update backend-shaped `moderation_status` records and preserve review metadata without implying automatic publication.
- Verified the implementation with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/5-1-public-submission-intake-for-recipes-and-stories.md
- _bmad-output/implementation-artifacts/5-2-protected-moderation-review-workflow.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/submissions.ts
- src/contracts/moderation.ts
- src/services/submissions/intake.ts
- src/services/moderation/review.ts
- src/pages/moderation.tsx
