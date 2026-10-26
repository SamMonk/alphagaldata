# Story 5.5: Future-Ready Community and Account Boundaries

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a product owner,
I want the MVP architecture and workflows to preserve clean boundaries for future accounts, private materials, and trusted-member contribution features,
so that AlphaGalData can expand later without undermining current trust and privacy constraints.

## Acceptance Criteria

1. Given the MVP is implemented without public member accounts, when public features such as recipes, scanner use, downloads, and preparedness resources are delivered, then they work without requiring user login, and the MVP public experience remains independent from future account systems.
2. Given the platform stores operational data for current features, when data boundaries are reviewed, then the implementation preserves the no-health-tracking posture in MVP, and it does not quietly expand into private health-record behavior.
3. Given future member accounts, user-only materials, or trusted-member contribution workflows are considered, when the current system boundaries are evaluated, then the architecture leaves room for those features later, and it does not require rewriting the public MVP content experience to support them.
4. Given future private or member-only features are introduced in later phases, when they are planned against the MVP baseline, then they can be added through explicit new protected flows and contracts, and they do not weaken moderation, publication safety, or trust-language consistency in the existing public site.
5. Given the current MVP includes contributor submission and moderation features, when the implementation is reviewed, then contributor workflows remain clearly distinct from any future trusted-member or account-based privileges, and the public MVP does not imply broader community publishing rights than actually exist.
6. Given future-readiness is evaluated in architecture and implementation planning, when epic and story coverage are reviewed, then forward-compatible boundaries for accounts and private materials are documented, and they remain explicitly deferred rather than partially implemented in ambiguous ways.

## Tasks / Subtasks

- [ ] Audit current public and protected flows for future-boundary clarity (AC: 1, 3, 4, 5, 6)
  - [ ] Review public pages, moderation workflow, and editorial workflow to identify where future account or member-only features could accidentally leak into the MVP.
  - [ ] Confirm that core public features remain usable without login.
  - [ ] Document where future protected flows could be added without rewriting the public site architecture.
- [ ] Make account and member-only boundaries explicit in shared contracts or service helpers where needed (AC: 1, 3, 4, 5, 6)
  - [ ] Add light-touch forward-compatible contracts, types, or guardrail comments only where they reduce ambiguity for later account/member work.
  - [ ] Avoid implementing partial account systems, fake member roles, or placeholder private-content UI that implies the feature already exists.
  - [ ] Keep contributor submission/moderation/editorial roles clearly separate from any hypothetical future trusted-member contribution privileges.
- [ ] Preserve no-health-tracking posture in implementation boundaries (AC: 2, 4, 6)
  - [ ] Review current local storage, service wrappers, and protected routes to ensure they do not drift into private health-record behavior.
  - [ ] Keep operational data shapes focused on workflow state, not personal health tracking or patient records.
  - [ ] Document any future-sensitive edge where privacy/trust requirements would need an explicit product decision later.
- [ ] Keep public MVP routes independent from future account systems (AC: 1, 3, 4)
  - [ ] Ensure recipes, scanner, downloads, learning content, and preparedness flows remain public-first and do not depend on auth to render correctly.
  - [ ] Avoid introducing hidden login hooks or user-state assumptions into core public pages.
  - [ ] Keep future account expansion as a new protected layer rather than a retrofit requirement for the current public experience.
- [ ] Document deferred future paths clearly without partially implementing them (AC: 3, 4, 5, 6)
  - [ ] Add concise developer-facing notes or guardrails where the current codebase most needs clarity about future accounts, private materials, and trusted-member workflows.
  - [ ] Make deferral explicit so later work starts from clean boundaries instead of reading accidental MVP behavior as product intent.
  - [ ] Keep trust, moderation, and publication rules consistent with the current MVP model while leaving room for future evolution.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - core public pages still work without login
    - protected moderation/editorial routes remain separate from public flows
    - no new UI implies member publishing rights or private account features that do not exist
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 5.5 is a boundary-hardening and documentation story. It should not become a stealth implementation of member accounts, private user dashboards, or trusted-member publishing features.
- Stories 5.1 through 5.4 already established public submission, protected moderation, publication safety, and protected editorial controls. Story 5.5 should clarify and preserve the seams between those systems and future account/member work.
- The architecture is explicit that public/member authentication is deferred until member-only functionality actually ships, and that future accounts should be possible without forcing a rewrite of the public content experience.
- The main product risk here is ambiguous partial implementation: code or UI that accidentally suggests broader account or publishing rights than the MVP actually supports.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Build from current repo touchpoints where future-boundary clarity matters most:
  - `src/pages/submit-recipe.tsx`
  - `src/pages/moderation.tsx`
  - `src/pages/editorial.tsx`
  - relevant contracts/services under `src/contracts/` and `src/services/`
- Prefer small, explicit guardrails over broad refactors.
- Do not add real member login requirements to current public content.
- Do not introduce health-tracking storage, profile capture, or patient-record concepts.

### Architecture Compliance

- Future accounts and trusted-member workflows should remain possible later without forcing a rewrite of the public content experience.  
  [Source: _bmad-output/planning-artifacts/architecture.md]
- Public/member authentication is deferred until member-only functionality actually ships.  
  [Source: _bmad-output/planning-artifacts/architecture.md]
- The platform should maintain a clear separation between public educational content and future member-only or community contribution features.  
  [Source: _bmad-output/planning-artifacts/prd.md]
- Future expansion into accounts or private features must preserve the no-health-tracking posture unless privacy and trust requirements are deliberately revisited.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Public routes should continue to feel fully usable without login.
- Protected operator routes should remain clearly operator-only and should not imply a coming consumer account experience unless that feature is actually built.
- Any future-facing language added in code or UI should emphasize deferral and explicit later planning, not vague “coming soon” account promises.

### File Structure Requirements

- Likely edits:
  - protected/public route files where boundary comments or helper usage meaningfully reduce ambiguity
  - shared contracts/services where future role/account boundaries need explicit documentation or type clarity
  - implementation artifacts or developer-facing notes only if they materially improve future-ready clarity
- Do not touch unless implementation genuinely requires it:
  - unrelated recipe, scanner, or download content behavior
  - new login-gated public features
  - backend/account systems that do not yet exist

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - public routes remain login-free and render normally
  - protected operator routes remain protected
  - no new codepath implies private health tracking or member publishing rights
  - `npm run build` succeeds without SSR/auth regressions

### Previous Story Intelligence

- Story 5.1 established moderated public submission without public publishing.
- Story 5.2 and 5.3 established protected moderation, publication safety, and internal-only review data.
- Story 5.4 established a protected editorial path for featured and resource metadata updates.
- The remaining implementation gap is not another operator feature; it is preserving clean seams so future accounts or trusted-member workflows can be added later without contaminating the MVP.

### Current Implementation Baseline

- Core public flows remain public-first: recipes, scanner, downloads, and learning content do not require login.
- Protected routes now exist for moderation and editorial workflows using the current Cognito/OIDC client posture.
- Contributor submission remains distinct from operator-only moderation and editorial workflows.
- There is not yet a real member-account experience, private-content zone, or trusted-member contribution privilege model in the repo.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-5.5:-Future-Ready-Community-and-Account-Boundaries]
- Previous implementation context: [Source: _bmad-output/implementation-artifacts/5-4-editorial-updates-for-trusted-public-content-and-resources.md]
- Architecture and PRD constraints: [Source: _bmad-output/planning-artifacts/architecture.md] [Source: _bmad-output/planning-artifacts/prd.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Sprint tracking showed Story 5.4 in `review`; user confirmation marked it complete and unlocked Story 5.5 as the next backlog item.
- Architecture and PRD artifacts were reviewed to isolate future-account and trusted-member boundary requirements from current MVP behavior.
- Local repo inspection confirmed public routes remain login-free while moderation/editorial routes are protected, leaving Story 5.5 focused on preserving and documenting those seams rather than implementing accounts.

### Completion Notes List

- Marked Story 5.4 as `done` in sprint tracking per user confirmation.
- Promoted Story 5.5 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 5.5 implementation file anchored to the current public/protected route split, no-health-tracking posture, and future-ready account/member boundaries.
- Added a shared operator-access helper so moderation/editorial routes now use one explicit operator-group boundary instead of duplicating auth logic ad hoc.
- Added future-boundary guardrail comments around browser-local recipe save, submission, moderation, and editorial storage so those flows do not get mistaken for future account/profile systems.
- Updated public-facing trust copy on privacy and submission surfaces to state that the MVP remains login-free for public use, does not create member accounts through contributor submission, and does not currently implement consumer account/profile behavior.
- Verified the implementation with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/5-4-editorial-updates-for-trusted-public-content-and-resources.md
- _bmad-output/implementation-artifacts/5-5-future-ready-community-and-account-boundaries.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/services/auth/access.ts
- src/services/recipes/saves.ts
- src/services/submissions/intake.ts
- src/services/moderation/review.ts
- src/services/editorial/config.ts
- src/pages/moderation.tsx
- src/pages/editorial.tsx
- src/pages/submit-recipe.tsx
- src/pages/privacy.tsx
