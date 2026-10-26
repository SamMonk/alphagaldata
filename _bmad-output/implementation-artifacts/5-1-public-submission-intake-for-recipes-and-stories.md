# Story 5.1: Public Submission Intake for Recipes and Stories

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a contributor,
I want to submit a recipe or story for review,
so that I can share useful experience without publishing directly to the public site.

## Acceptance Criteria

1. Given a contributor accesses a public submission flow, when they choose to submit a recipe or story, then the site provides a clear submission form for the selected content type, and the form explains that submissions are reviewed before any public release.
2. Given a contributor fills out a recipe or story submission, when they provide the required information and submit it, then the submission is stored in the moderation intake system, and it is not published publicly by default.
3. Given a contributor is completing a submission form, when they review the form guidance, then the form clearly communicates standards against unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions, and it sets accurate expectations for moderated review.
4. Given a contributor submits incomplete or invalid content, when validation runs, then the form presents clear corrective errors, and the user can fix issues without losing the rest of their submission context.
5. Given a contributor uses the submission flow on desktop or mobile, when they interact with fields, labels, and actions, then the submission experience remains readable, accessible, and responsive, and it supports visible labels and low-friction form completion.
6. Given a public submission is received, when backend processing occurs, then the content enters a protected moderation queue, and the public site remains unchanged until a moderator takes explicit action.

## Tasks / Subtasks

- [ ] Replace the current placeholder recipe submission page with a real moderated intake flow (AC: 1, 3, 4, 5, 6)
  - [ ] Review `src/pages/submit-recipe.tsx`, which currently acts as a placeholder rather than a working submission form.
  - [ ] Decide whether the MVP intake should use one page with a content-type selector or a recipe-first flow that clearly supports both recipe and story submission within the same public path.
  - [ ] Keep the public experience simple and explicit about moderation-first handling rather than implying instant publication.
- [ ] Build clear public submission form structure for recipes and stories (AC: 1, 3, 4, 5)
  - [ ] Support the fields needed to capture either a recipe or a story submission with enough context for later moderation.
  - [ ] Include visible guidance about review, moderation expectations, and disallowed unsafe claims before the user submits.
  - [ ] Preserve low-friction mobile and desktop use with clear labels, validation, and recoverable error handling.
- [ ] Route submissions into a protected moderation intake boundary (AC: 2, 6)
  - [ ] Implement the submission path so public users can create intake records without any direct public publishing path.
  - [ ] Keep backend ownership of moderation state explicit; frontend success should mean “queued for review,” not “published.”
  - [ ] Follow the project’s trust-sensitive API patterns if an API-backed submission flow is added.
- [ ] Keep moderation and trust messaging explicit in the UI (AC: 1, 3, 6)
  - [ ] Make it clear that submitted recipes and stories are reviewed before any public release.
  - [ ] Explain that unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions are not eligible for publication.
  - [ ] Keep tone welcoming but firm so contributors understand the trust boundary.
- [ ] Preserve accessibility and responsive behavior (AC: 4, 5)
  - [ ] Ensure visible labels, keyboard access, readable errors, and touch-friendly actions.
  - [ ] Make sure validation feedback is understandable without color alone and does not wipe already-entered content unnecessarily.
  - [ ] Keep the submission experience calm and low-friction across mobile and desktop.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - the page clearly supports moderated submission rather than direct publication
    - recipe and/or story submission fields are understandable and usable
    - validation errors are recoverable without losing the entire form
    - success state clearly indicates moderation queue entry
    - `npm run build` completes without SSR regressions

## Dev Notes

- Epic 5 is the first part of the project where community contribution and moderation boundaries become product-critical. This story should establish the public intake boundary, not the moderator review tools themselves.
- The repo already contains a public placeholder submission route at `src/pages/submit-recipe.tsx`. Story 5.1 should build from that routed page instead of creating another disconnected public entry point.
- Architecture and planning artifacts emphasize moderation-first handling, backend-controlled publication boundaries, and a `submission_queue` domain boundary. This story should respect those constraints even if the initial implementation remains lightweight.
- The product risk here is trust leakage: the submission flow must never imply that contributor content goes live directly.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Public submission UI should remain a routed, crawlable page and should preserve the current public-first posture without requiring user login.
- If API-backed submission is implemented, follow the project’s standard trust-sensitive envelope and backend-owned moderation boundary instead of frontend-only storage assumptions.
- Keep the MVP flow asynchronous and moderation-first; do not add realtime workflows or public publishing shortcuts.

### Architecture Compliance

- Moderation/publication rules must not be enforced only in the frontend.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Interactive public flows should use API Gateway/Lambda style trust-sensitive patterns where applicable.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- The product must prevent accidental publication of unreviewed submissions.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Submission forms should feel simple, calm, and explicit about review expectations.
- Make moderation standards visible before submission so contributors understand the trust boundary up front.
- Keep error handling recoverable and non-punitive.
- Avoid any success language that sounds like immediate public publication.

### File Structure Requirements

- Likely edits:
  - `src/pages/submit-recipe.tsx`
  - submission-related shared components or service wrappers only if needed
  - `src/services/` if a public intake service boundary is introduced
  - possibly an additional routed page or selector only if implementation truly requires separate recipe/story entry paths
- Do not touch unless implementation genuinely requires it:
  - moderation review interfaces for Story 5.2
  - publication enforcement details for Story 5.3
  - unrelated recipes, scanner, downloads, auth, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - the public form communicates moderation-first review clearly
  - submission validation is readable and recoverable
  - the success path indicates queue/review rather than publication
  - mobile and keyboard-only use remain clear
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Epic 4 completed the public preparedness and utility flows, leaving Epic 5 to establish moderated community contribution without weakening trust.
- The current public submission route exists only as a placeholder and already signals intent to create a lightweight submission workflow.
- The next implementation gap is replacing that placeholder with a real intake flow that respects moderation boundaries from the start.

### Current Implementation Baseline

- `src/pages/submit-recipe.tsx` currently explains what contributors should gather, but it does not yet provide a functioning moderated submission form.
- Links to `/submit-recipe` already exist from public pages such as the homepage, recipe page, and recommended content, so the route is already part of the user journey.
- Story 5.1 should likely upgrade this existing route into the canonical public intake entry point.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-5.1:-Public-Submission-Intake-for-Recipes-and-Stories]
- Current submission baseline: [Source: src/pages/submit-recipe.tsx]
- Related public entry points: [Source: src/pages/index.tsx] [Source: src/pages/recipes.tsx]
- Architecture and moderation constraints: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 5 acceptance criteria and the current public submission placeholder route already present in the Gatsby app.
- Repo inspection confirmed the public route exists but the moderated intake flow does not, so Story 5.1 is framed around upgrading that route into a real submission boundary rather than creating a second public entry point.

### Completion Notes List

- Marked Story 4.4 as `done` in sprint tracking per user confirmation.
- Marked Epic 4 as `done` because all Epic 4 stories are now complete.
- Promoted Epic 5 to `in-progress`.
- Promoted Story 5.1 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 5.1 implementation file anchored to the current public submission placeholder route.
- Replaced the placeholder `/submit-recipe` page with a moderated public submission form that supports both recipe and story intake.
- Added a shared submission contract and service wrapper so the page queues submissions through a dedicated intake boundary instead of embedding request logic directly in the route.
- Preserved moderation-first messaging and success semantics by returning queued-for-review results only, with a local fallback intake path when public API endpoints are not configured.
- Verified the implementation with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/4-4-preparedness-resource-surfacing-across-the-site.md
- _bmad-output/implementation-artifacts/5-1-public-submission-intake-for-recipes-and-stories.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/submissions.ts
- src/services/submissions/intake.ts
- src/pages/submit-recipe.tsx
