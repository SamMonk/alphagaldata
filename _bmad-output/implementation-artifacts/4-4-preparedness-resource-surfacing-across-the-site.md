# Story 4.4: Preparedness Resource Surfacing Across the Site

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want preparedness and dining resources to be easy to reach from relevant places across the site,
so that I can find them quickly without deep hunting when I need them.

## Acceptance Criteria

1. Given a visitor is on the homepage, a recipe page, scanner-related content, or other relevant public entry points, when preparedness or dining resources are contextually relevant, then the site surfaces clear links or modules to those resources, and the user does not need to navigate through deep menu paths to find them.
2. Given a visitor is exploring food-oriented content, when the product presents secondary next steps, then dining cards and preparedness tools are available as practical follow-on actions, and they are presented without displacing the primary content of the page.
3. Given a visitor is using the site in a high-anxiety or time-sensitive situation, when they scan the navigation or page-level utility areas, then preparedness-related entry points remain easy to spot, and the interface prioritizes clarity over decorative complexity.
4. Given preparedness resources are surfaced from multiple public contexts, when those links or modules are rendered, then they use consistent labeling and trust framing across the site, and they do not create conflicting navigation patterns.
5. Given a visitor follows a preparedness-related entry point from another public page, when they arrive at the destination resource, then the transition feels connected to the broader site journey, and the user can navigate back into recipes, scanner use, or educational content without losing orientation.
6. Given cross-site resource surfacing is evaluated for responsive and accessible behavior, when links or modules appear across desktop and mobile experiences, then they remain readable, keyboard accessible, and touch-friendly, and they do not depend on hover-only behavior or hidden affordances.

## Tasks / Subtasks

- [ ] Identify the highest-value public entry points for preparedness surfacing (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Review the homepage, recipe landing flow, scanner page, and any other high-traffic public entry points already exposed in the site.
  - [ ] Decide where preparedness or dining-resource surfacing is genuinely context-relevant instead of spraying generic utility links everywhere.
  - [ ] Preserve each page’s primary job while adding stronger secondary paths into dining cards and preparedness tools.
- [ ] Add consistent preparedness/dining follow-on modules or links (AC: 1, 2, 4, 5, 6)
  - [ ] Surface clear links or compact utility modules on relevant pages such as `src/pages/index.tsx`, `src/pages/recipes.tsx`, and `src/pages/scanner.tsx`.
  - [ ] Keep the labels consistent with the flows established in Stories 4.1 through 4.3, for example `Get dining cards`, `Preparedness downloads`, `Wallet card guide`, or similar canonical language.
  - [ ] Avoid creating competing labels or fragmented routes that make users guess which preparedness page is the “real” one.
- [ ] Keep utility visible in high-anxiety contexts (AC: 1, 3, 4, 6)
  - [ ] Ensure resource surfacing is easy to spot on mobile and desktop without relying on footer-only placement or hover-only discovery.
  - [ ] Favor obvious action labels and compact supporting copy over decorative promotional treatments.
  - [ ] Make the most relevant preparedness action feel near at hand without overwhelming the surrounding page.
- [ ] Preserve journey continuity across content types (AC: 2, 4, 5)
  - [ ] Ensure that someone arriving from food-oriented content can move into preparedness resources and then back into recipes, scanner use, or learning without losing orientation.
  - [ ] Reuse the established destination pages from Epic 4 instead of introducing new parallel destinations.
  - [ ] Keep the transition language calm, practical, and tied to the current user context.
- [ ] Maintain trust framing and accessibility consistency (AC: 3, 4, 6)
  - [ ] Use the same educational-only posture and trust-sensitive language already used across scanner, recipes, downloads, and preparedness guides.
  - [ ] Ensure surfaced links/modules are keyboard accessible, readable on small screens, and understandable without color alone.
  - [ ] Avoid hidden, collapsed, or hover-only affordances for trust-critical utility entry points.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - homepage, recipe, and scanner entry points expose preparedness/dining follow-on actions where relevant
    - labels and routes are consistent across the surfaced modules
    - the added utility remains readable and touch-friendly on mobile
    - preparedness links do not displace the page’s main purpose
    - `npm run build` completes without SSR regressions

## Dev Notes

- Stories 4.1 through 4.3 already clarified the destination pages for dining cards, preparedness downloads, wallet cards, tattoo guidance, and testing boundaries. Story 4.4 should make those resources easier to reach from the rest of the public experience.
- Current likely surfacing points already exist:
  - `src/pages/index.tsx`
  - `src/pages/recipes.tsx`
  - `src/pages/scanner.tsx`
  - possibly selected learn pages if a small consistency adjustment is warranted
- The product risk here is navigational fragmentation. Visitors should not have to remember that useful preparedness tools live somewhere else after they have already started a recipe or scanner journey.
- Keep this story focused on resource surfacing and continuity. Do not create new destination pages when the existing Epic 4 routes already cover the needed utility.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind.
- Cross-site surfacing should remain lightweight and route-based, not dependent on complex runtime state.
- Reuse existing cards, trust notices, and page structures where practical instead of introducing a new sitewide utility system.
- Favor small, intentional additions in high-value contexts over broad refactors.

### Architecture Compliance

- Public utility resources must remain available without login and without realtime dependencies.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Trust framing should remain consistent across public entry points and destination pages.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Important public pages should remain readable, crawlable, and lightweight.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Preparedness links should feel like relevant next steps, not sitewide clutter.
- Keep the labels stable and task-based so users can recognize the same resource path wherever they encounter it.
- High-anxiety utility should be visually easy to find, but it should not displace the page’s primary content.
- Preserve clean transitions back into recipes, scanner use, or broader learning.

### File Structure Requirements

- Likely edits:
  - `src/pages/index.tsx`
  - `src/pages/recipes.tsx`
  - `src/pages/scanner.tsx`
  - possibly one or two related public pages if consistency requires it
- Do not touch unless implementation genuinely requires it:
  - the destination flows established in Stories 4.1, 4.2, and 4.3 beyond light link consistency
  - scanner service/contract logic
  - unrelated recipe persistence, moderation, auth, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - preparedness resource entry points appear in the most relevant public contexts
  - routes and labels stay consistent across the site
  - mobile and keyboard access remain clear
  - the pages still prioritize their primary job
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Story 4.1 clarified the primary dining-card/download route.
- Story 4.2 clarified the emergency-preparedness flow across wallet-card, tattoo, printing, and downloads guidance.
- Story 4.3 tightened trust boundaries on tattoo and testing pages.
- The remaining Epic 4 gap is surfacing: users still need clearer contextual entry points into those resources from the broader public site.

### Current Implementation Baseline

- `src/pages/index.tsx` already links to dining cards and scanner use, but preparedness surfacing is still selective rather than systematic.
- `src/pages/recipes.tsx` already includes a downloads/prep card, but it may need stronger consistency with the canonical preparedness/dining routes.
- `src/pages/scanner.tsx` already contains education follow-up, but broader preparedness tools may still be too buried relative to the current user context.
- Story 4.4 should strengthen those entry points rather than inventing new destinations.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-4.4:-Preparedness-Resource-Surfacing-Across-the-Site]
- Likely surfacing points: [Source: src/pages/index.tsx] [Source: src/pages/recipes.tsx] [Source: src/pages/scanner.tsx]
- Destination flow context: [Source: _bmad-output/implementation-artifacts/4-1-dining-safe-cards-and-resource-download-access.md] [Source: _bmad-output/implementation-artifacts/4-2-medical-alert-and-preparedness-guidance.md] [Source: _bmad-output/implementation-artifacts/4-3-tattoo-and-testing-guidance-pages.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 4 acceptance criteria and the current homepage, recipes, and scanner entry points already present in the Gatsby app.
- Repo inspection confirmed that destination pages for dining and preparedness resources already exist, so Story 4.4 is framed around consistent contextual surfacing rather than adding new endpoints.

### Completion Notes List

- Marked Story 4.3 as `done` in sprint tracking per user confirmation.
- Promoted Story 4.4 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 4.4 implementation file anchored to the homepage, recipes, and scanner entry points that already route into dining and preparedness resources.
- Added a reusable preparedness resource panel so public entry points can surface dining and preparedness tools with stable labels and trust framing instead of ad hoc links.
- Wired the shared surfacing pattern into the homepage, recipe landing page, and scanner page with context-appropriate copy and destination links.
- Verified with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/4-3-tattoo-and-testing-guidance-pages.md
- _bmad-output/implementation-artifacts/4-4-preparedness-resource-surfacing-across-the-site.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/PreparednessResourcePanel.tsx
- src/pages/index.tsx
- src/pages/recipes.tsx
- src/pages/scanner.tsx
