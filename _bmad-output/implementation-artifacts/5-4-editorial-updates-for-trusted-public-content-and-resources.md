# Story 5.4: Editorial Updates for Trusted Public Content and Resources

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an editor,
I want to update trusted public content, featured materials, and downloadable resources through controlled editorial paths,
so that AlphaGalData stays current and useful without compromising trust.

## Acceptance Criteria

1. Given an authorized editor accesses an editorial workflow, when they manage trusted public pages, featured content, or downloadable resources, then they can update those assets through a controlled path, and the workflow is protected from public or unauthorized access.
2. Given an editor updates public educational content or resource metadata, when the changes are saved and published, then the public site reflects the updated content, and the change does not bypass trust, moderation, or publication safety boundaries.
3. Given an editor manages downloadable resources or high-value public materials, when they replace, update, or reorder those assets, then the updated resources remain available through stable public paths, and the editorial workflow does not require direct code changes for normal content maintenance.
4. Given editorial updates affect trust-sensitive public information, when the content is reviewed or published, then the workflow preserves the site's educational-only posture, and it does not allow unsafe claims or conflicting trust language to be introduced casually.
5. Given featured content and resource maintenance are part of ongoing operations, when editors return to the workflow over time, then the system supports consistent day-to-day curation of trusted public surfaces, and it remains aligned with the moderation and publication model already established.
6. Given editorial workflows are evaluated for access control and architecture alignment, when permissions and system boundaries are reviewed, then editing capabilities remain restricted to authorized operators, and public-facing pages do not expose editorial controls or internal state.

## Tasks / Subtasks

- [ ] Add a protected editorial entry point for trusted public surfaces (AC: 1, 5, 6)
  - [ ] Build on the existing protected-auth posture rather than inventing a second access pattern for editorial tools.
  - [ ] Keep editorial controls separate from public routes and separate from the contributor/moderation workflow where possible.
  - [ ] Restrict editorial access to authorized operators only.
- [ ] Define a controlled editorial data/service boundary (AC: 1, 2, 3, 6)
  - [ ] Add shared contracts and service wrappers for featured content and downloadable resource metadata updates.
  - [ ] Keep editorial metadata changes behind protected service boundaries rather than direct page-level edits or hidden UI state.
  - [ ] Preserve the project's standard trust-sensitive `{ data, meta, error }` envelope and `snake_case` payload conventions if API-backed calls are added.
- [ ] Support featured content curation without breaking public trust posture (AC: 2, 4, 5)
  - [ ] Identify current featured content entry points on homepage and recipes surfaces.
  - [ ] Provide a controlled way to update featured ordering or featured selection that aligns with editorial control and does not expose internal controls publicly.
  - [ ] Keep featured updates distinct from moderation/publication approval semantics.
- [ ] Support downloadable resource and high-value public material management (AC: 2, 3, 4, 5)
  - [ ] Add a controlled path for updating public resource metadata, ordering, or replacement references.
  - [ ] Preserve stable public paths for downloads and avoid casual breakage of existing resource URLs.
  - [ ] Keep educational-only posture and trust language visible in any operator-facing workflow that updates public safety materials.
- [ ] Preserve trust boundaries between editorial and moderation systems (AC: 2, 4, 5, 6)
  - [ ] Ensure editorial updates do not bypass the moderation/publication safety rules established in Stories 5.2 and 5.3.
  - [ ] Avoid exposing moderation-only fields or internal notes inside public editorial surfaces.
  - [ ] Keep editorial tools focused on trusted public content and resource curation, not community-submission approval logic.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - unauthorized visitors cannot access editorial controls
    - authorized editors can manage featured/resource metadata through the protected workflow
    - public pages reflect intended editorial updates without exposing internal controls
    - resource paths remain stable after updates
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 5.4 is about protected editorial maintenance for trusted public content, not contributor moderation and not future account systems.
- The repo already contains protected-access primitives via Cognito/OIDC client wiring and now has a separate moderation workflow. Story 5.4 should reuse those patterns where practical while keeping editorial concerns distinct from moderation review state.
- Current featured recipe behavior is still file/content driven in the public Gatsby pages. Story 5.4 should introduce a controlled editorial path without destabilizing the existing public rendering model.
- The main product risk here is casual trust erosion through editorial tooling. Public content updates must remain curated, operator-only, and aligned with educational-only posture.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Build from current repo touchpoints where practical:
  - `src/pages/auth.tsx`
  - `src/components/auth-provider-wrapper.js`
  - `src/pages/index.tsx`
  - `src/pages/recipes.tsx`
  - `src/pages/downloads.tsx`
- If new protected editorial services are added, keep them in `src/services/` with shared contracts in `src/contracts/`.
- Keep public routed pages crawlable and pre-rendered; do not convert core public surfaces into auth-dependent pages.
- Avoid full CMS/platform rework unless the minimal brownfield path truly requires it.

### Architecture Compliance

- Featured-content management and editorial updates are protected operations and must remain restricted to authorized operators.  
  [Source: _bmad-output/planning-artifacts/architecture.md]
- Editorial/featured state changes are trust-critical operations that should cross protected service boundaries, not live as scattered page logic.  
  [Source: _bmad-output/planning-artifacts/architecture.md]
- Public pages should remain fast, pre-rendered, and low-overhead even as editorial workflows are added.  
  [Source: _bmad-output/planning-artifacts/architecture.md] [Source: _bmad-output/planning-artifacts/prd.md]
- Editorial changes must not bypass moderation, publication safety, or educational trust boundaries.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Editorial tooling should feel operationally clear, restrained, and trust-aware rather than generic CMS-heavy.
- Operator-facing copy should reinforce educational-only posture and stable public trust language.
- Public routes must never show editorial controls or internal state.
- Resource management should minimize accidental URL churn or “where did this file go” regressions.

### File Structure Requirements

- Likely edits:
  - `src/pages/` for a protected editorial route or editorial admin surface
  - `src/services/` for editorial metadata/service wrappers
  - `src/contracts/` for editorial update contracts if a shared boundary is introduced
  - public pages only where they need to read newly controlled featured/resource metadata
- Review likely public touchpoints:
  - `src/pages/index.tsx`
  - `src/pages/recipes.tsx`
  - `src/pages/downloads.tsx`
- Do not touch unless implementation genuinely requires it:
  - moderation/publication enforcement from Story 5.3
  - future-ready account boundary work from Story 5.5
  - unrelated scanner, recipe-save, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - editorial access is protected
  - featured/resource updates are reflected correctly on public pages
  - public routes stay crawlable and free of internal controls
  - stable resource paths remain intact after updates
  - `npm run build` succeeds without SSR/auth regressions

### Previous Story Intelligence

- Story 5.2 established the protected operator workflow and shared auth posture for moderation.
- Story 5.3 separated moderation review state from public eligibility and added internal-only note handling.
- The next implementation gap is not publication blocking; it is day-to-day editorial control over trusted public content, featured material, and downloadable resources.

### Current Implementation Baseline

- `src/pages/index.tsx` and `src/pages/recipes.tsx` currently derive featured recipe behavior from frontmatter and Gatsby queries.
- `src/pages/downloads.tsx` currently presents curated public resources through static/public-page structures.
- `src/pages/auth.tsx` and `src/components/auth-provider-wrapper.js` show the current protected-access/auth baseline already present in the repo.
- There is not yet a dedicated editorial route, editorial contract, or editorial service wrapper for trusted public content/resource management.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-5.4:-Editorial-Updates-for-Trusted-Public-Content-and-Resources]
- Previous implementation context: [Source: _bmad-output/implementation-artifacts/5-3-publication-safety-enforcement-and-editorial-notes.md]
- Current public touchpoints: [Source: src/pages/index.tsx] [Source: src/pages/recipes.tsx] [Source: src/pages/downloads.tsx]
- Current auth baseline: [Source: src/pages/auth.tsx] [Source: src/components/auth-provider-wrapper.js]
- Architecture and PRD constraints: [Source: _bmad-output/planning-artifacts/architecture.md] [Source: _bmad-output/planning-artifacts/prd.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Sprint tracking showed Story 5.3 in `review`; user confirmation marked it complete and unlocked Story 5.4 as the next backlog item.
- Epic 5 planning and architecture artifacts were reviewed to keep Story 5.4 scoped to editorial control over trusted public content and resources rather than reopening moderation/publication enforcement.
- Local repo inspection confirmed featured and resource behavior is still public-page/file-driven and that no protected editorial workflow exists yet.

### Completion Notes List

- Marked Story 5.3 as `done` in sprint tracking per user confirmation.
- Promoted Story 5.4 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 5.4 implementation file anchored to the current featured-content/resource surfaces, the existing protected auth posture, and the architecture's editorial-control requirements.
- Added a protected `/editorial` workflow that reuses the Cognito/OIDC client posture and restricts access to editor-group operators.
- Added shared editorial contracts and a service wrapper for featured recipe ordering and public download/resource metadata overrides.
- Updated public homepage, recipes, and downloads surfaces to reflect editorial metadata overrides after hydration without exposing internal controls or changing stable public download paths.
- Verified the implementation with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/5-3-publication-safety-enforcement-and-editorial-notes.md
- _bmad-output/implementation-artifacts/5-4-editorial-updates-for-trusted-public-content-and-resources.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/editorial.ts
- src/services/editorial/config.ts
- src/pages/editorial.tsx
- src/pages/index.tsx
- src/pages/recipes.tsx
- src/pages/downloads.tsx
