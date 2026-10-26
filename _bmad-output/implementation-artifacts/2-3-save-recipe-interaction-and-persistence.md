# Story 2.3: Save Recipe Interaction and Persistence

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to save and unsave recipes through a low-friction interaction,
so that I can keep track of recipes I trust and want to return to later.

## Acceptance Criteria

1. Given a visitor is viewing a recipe card or recipe detail page with sufficient visible safety context, when they activate the save action, then the recipe is stored in the recipe-save system, and the interface confirms the saved state clearly.
2. Given a visitor has already saved a recipe, when they view that recipe again, then the UI reflects that the recipe is already saved, and the save control uses a distinct saved state rather than appearing identical to unsaved items.
3. Given a visitor chooses to remove a saved recipe, when they activate the unsave action, then the recipe is removed from their saved-recipe state, and the interface updates to reflect that the item is no longer saved.
4. Given a save or unsave action is in progress, when the visitor triggers the action, then the UI communicates an in-progress state, and it prevents confusing duplicate submissions while the request is being handled.
5. Given a save or unsave request fails, when the action cannot be completed, then the UI presents a clear failure state with recovery guidance, and it does not falsely report success.
6. Given the save interaction is used across recipe cards and recipe detail pages, when save state is rendered in different contexts, then the product uses a consistent save-state model and messaging, and it does not require duplicated business logic in page components.
7. Given recipe save functionality stores operational user state, when the backend persists the action, then it avoids collecting or storing health-tracking data, and it stores only the minimum state required to support saved recipes.
8. Given save interactions are evaluated on desktop and mobile, when users access the save action from supported browsers, then the control remains accessible, touch-friendly, and keyboard operable, and saved, saving, unsaved, and failed states are understandable without color alone.

## Tasks / Subtasks

- [x] Define the shared save-state contract (AC: 6, 7)
  - [x] Create `src/contracts/recipes.ts` with `snake_case` payload types: `RecipeSaveRecord` (`recipe_slug`, `saved_at`), `RecipeSaveState` union (`'unsaved' | 'saving' | 'saved' | 'unsaving' | 'failed'`), and `RecipeSaveError` (`code`, `message`, `recovery_guidance`).
  - [x] Restrict stored data to the minimum needed for saved-recipe return (slug + ISO-8601 UTC `saved_at`); do not store titles, metadata snapshots, or anything health-related.
  - [x] Document the forward-compatibility intent in the contract file (MVP localStorage adapter today, backend `/recipes/save` + `/recipes/unsave` APIs later when accounts ship).
- [x] Implement the reusable save service wrapper with a localStorage-backed adapter (AC: 1, 3, 4, 5, 6, 7)
  - [x] Create `src/services/recipes/saves.ts` exposing async `listSaves()`, `saveRecipe(slug)`, `unsaveRecipe(slug)`, `isSaved(slug)`. All methods return Promises so future API adapters slot in without call-site changes.
  - [x] Back the adapter with a single localStorage key: `alphagaldata:saved-recipes` (JSON array of `RecipeSaveRecord`). Treat the parsed array as the source of truth; reject duplicates by `recipe_slug`.
  - [x] Gate all storage access through SSR-safe `typeof window !== 'undefined'` checks; return empty/noop shapes during SSR so static builds do not throw.
  - [x] Handle `QuotaExceededError` and JSON parse errors by returning a `RecipeSaveError` with `code: 'SAVE_FAILED'` and a calm recovery message; never silently swallow failures.
  - [x] Introduce a minimal same-tab broadcast (custom event or shared emitter) so cards and detail pages on the same page update together after save/unsave without a reload.
- [x] Build a shared `useRecipeSave` hook (AC: 2, 4, 6, 8)
  - [x] Create `src/services/recipes/useRecipeSave.ts` returning `{ state, save, unsave, toggle, error }` for a given `recipeSlug`.
  - [x] Hydrate state from the service on mount (guarded for SSR), then subscribe to same-tab updates so duplicate `RecipeSaveButton` instances on one page stay in sync.
  - [x] While an action is pending, set state to `saving` or `unsaving` and ignore additional calls until the promise resolves.
  - [x] On failure, set state to `failed`, retain the last known saved/unsaved value, and expose the error for the UI to render.
- [x] Build the reusable `<RecipeSaveButton>` component (AC: 1, 2, 3, 4, 5, 8)
  - [x] Create `src/components/RecipeSaveButton.tsx` with variants for the card context (compact) and the recipe detail context (prominent near the decision moment).
  - [x] Render distinct visual and textual treatments for every state: `Save recipe`, `Saving...`, `Saved`, `Removing...`, `Couldn't save — try again`.
  - [x] Always pair status with an icon/text label, never color alone; keep a minimum 44x44px touch target per UX-DR30.
  - [x] Add an `aria-live="polite"` status region that announces saved/removed/failure transitions for screen readers (UX-DR29).
  - [x] Ensure keyboard activation works with Enter and Space, with visible focus rings consistent with the rest of the public site.
  - [x] Surface the failure message inline with a retry affordance; do not fall back to a silent success (AC: 5).
- [x] Wire the save control into recipe surfaces (AC: 1, 2, 3, 6, 8)
  - [x] Update `src/pages/recipes.tsx` so each `RecipeCard` renders the shared `RecipeSaveButton` without duplicating business logic in the page component.
  - [x] Update `src/templates/recipe.tsx` to render the prominent `RecipeSaveButton` variant positioned after the `RecipeSafetyNoteBlock` so save appears only once the safety context is visible (UX-DR21).
  - [x] Do not place the save button in a position that competes visually with the recipe hero title or other primary actions (UX-DR20, UX-DR21).
  - [x] Confirm no other page component imports the localStorage key or raw service internals directly; all save-state reads and writes go through the hook/service.
- [x] Preserve SSR, SEO, and brownfield constraints (AC: 6, 7)
  - [x] Do not introduce any top-level imports of `window`, `localStorage`, or browser-only modules in `src/services/recipes/` or the contract file.
  - [x] Keep `gatsby build` output fully static for recipe pages; save state must hydrate client-side only, not block first paint.
  - [x] Do not modify `gatsby-node.js`, `gatsby-config.ts`, or introduce new plugins for this story.
  - [x] Do not add backend, Lambda, Terraform, or API handler code; the future `user_recipe_saves` table stays deferred (see Architecture Compliance below).
- [x] Verify implementation quality (AC: 4, 5, 6, 8)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and record any pre-existing warnings (the six brownfield warnings from Story 2.2 are the tolerated baseline — do not add new ones).
  - [ ] Manually verify in the browser:
    - saving from a recipe card updates both the card and the detail page after navigation
    - saving from a recipe detail page updates the matching card on `/recipes` after navigation
    - unsaving removes the recipe from the saved list and the button returns to the `Save recipe` state
    - the pending state blocks rapid duplicate clicks
    - the failure state renders clearly when localStorage is artificially disabled (e.g., quota exhausted in devtools)
    - the button is keyboard-activatable with visible focus
    - the saved/unsaved/pending/failed labels are understandable in grayscale

## Dev Notes

- This story is the first recipe-save story and must produce the durable save-state abstraction that Story 2.4 (Return to Saved Recipes) will consume. Keep the contract and service shape clean enough that Story 2.4 can render a saved-recipes list by calling `listSaves()` and resolving each slug against the existing MDX data without duplicated logic.
- The MVP is public-first with no login (Architecture → Authentication & Security). There is no authenticated user identity to key DynamoDB records against today. The correct MVP approach is **local, per-device persistence** behind a shared service wrapper that matches the backend contract shape. Do not invent an anonymous DynamoDB write path; that path is explicitly future work tied to Story 5.5 when accounts ship.
- The forward-compat intent is explicit: when Cognito-backed accounts land later, the service wrapper swaps its adapter from localStorage to `/recipes/save` + `/recipes/unsave` API Gateway routes. Call sites (`RecipeCard`, `recipe.tsx`) must not change.
- Do not drift into Story 2.4 surfaces. A `/saved-recipes` page, empty states, and saved-recipes list view all belong to Story 2.4. This story stops at save/unsave state for a single recipe.
- Reuse the patterns established in Story 2.2's `RecipeSafetyNoteBlock`: small, composable, SSR-safe, Tailwind-first components that live in `src/components/`.

### Technical Requirements

- Framework stays Gatsby 5 + React 18 + TypeScript (strict) + TailwindCSS. Do not add state-management libraries (Redux, Zustand, Jotai, etc.); `useState` + a lightweight same-tab emitter is sufficient.
- Preserve TypeScript strict-mode compatibility and continue using relative imports (no path aliases per `src/_bmad-output/project-context.md#Critical Implementation Rules`).
- Browser-only access (`localStorage`, `window`, custom events) must be guarded behind `typeof window !== 'undefined'` or executed inside `useEffect` so SSR builds do not break.
- Save persistence for MVP is device-local via `localStorage`. No Cognito, no DynamoDB, no API Gateway, no Lambda, no Terraform changes in this story.
- Keep `react-oidc-context` usage untouched; save state is not tied to Cognito identity in MVP.
- All data structures use `snake_case` field names to stay consistent with the backend contract this adapter will later target (`recipe_slug`, `saved_at`).

### Architecture Compliance

- Recipe save flow frontend responsibilities belong in `src/components/`, `src/services/recipes/`, and `src/contracts/recipes.ts`; backend responsibilities (`backend/handlers/recipes/`, `backend/domain/recipes/`) remain deferred for this story.
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- Gatsby page and template components must stay free of business logic. Save state reads/writes must go through the shared service wrapper; do not inline localStorage access in `recipes.tsx` or `recipe.tsx`.
  [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns]
- When the backend `user_recipe_saves` table and `/recipes/save` + `/recipes/unsave` routes are introduced later, the shared service wrapper must swap implementations without changing callers. The contract in `src/contracts/recipes.ts` should mirror the eventual API envelope shape so that swap is mechanical.
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Payload field names use `snake_case` (`recipe_slug`, `saved_at`, `next_action`). Do not introduce camelCase synonyms that will need a later migration.
  [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]
- Preserve the no-health-tracking posture: store only the minimum state required to identify a saved recipe (slug + ISO-8601 UTC timestamp). Do not capture titles, images, categories, or anything that could later expand into private health context.
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Trust-status vocabulary (`known_risk`, `caution`, `unknown`, `avoid`, `verify_before_using`, `research_before_buying`) is not applicable to save-button states. Do not reuse those labels for saved/saving/unsaved/failed; they are separate vocabularies.
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]

### Library / Framework Requirements

- Gatsby 5 + React 18 + TypeScript + Tailwind baseline. No alternate routing, rendering, or UI frameworks.
  [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- Do not bump React to 19 or Gatsby to 6; `react-leaflet` v4 remains paired with React 18.
  [Source: _bmad-output/project-context.md#Version compatibility constraints]
- `gatsby-plugin-offline` registers a service worker that caches assets. Do not assume localStorage reads will be hot after first paint — always hydrate save state inside `useEffect` to avoid flashing an incorrect unsaved state during hydration.
  [Source: _bmad-output/project-context.md#Version compatibility constraints]
- `npm run lint` is configured via `.eslintrc.cjs`; run it as part of verification. The six pre-existing warnings from Story 2.2 (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`, `src/pages/scanner.tsx`) are the tolerated baseline — do not add new warnings.
  [Source: package.json] [Source: .eslintrc.cjs]

### File Structure Requirements

- New files:
  - `src/contracts/recipes.ts` — shared `RecipeSaveRecord`, `RecipeSaveState`, and `RecipeSaveError` types (this creates the `contracts/` directory referenced in the architecture's frontend structure).
  - `src/services/recipes/saves.ts` — localStorage-backed save service with the full async surface.
  - `src/services/recipes/useRecipeSave.ts` — React hook wrapping the service for components.
  - `src/components/RecipeSaveButton.tsx` — reusable save/unsave control with card and detail variants.
- Edits:
  - `src/templates/recipe.tsx` — place the prominent `RecipeSaveButton` after `RecipeSafetyNoteBlock`; remove nothing from the existing trust hierarchy.
  - `src/pages/recipes.tsx` — render the compact `RecipeSaveButton` inside each `RecipeCard`; ensure the button does not break the existing card click target (the button is a separate interactive region, not nested inside the recipe link).
- Do not touch:
  - `gatsby-node.js`, `gatsby-config.ts`, `gatsby-browser.js`, `gatsby-ssr.js`
  - `backend/`, `tf/`, any Terraform files
  - `content/recipes/` frontmatter or MDX
  - `static/admin/config.yml`
  - existing auth wiring in `src/components/auth-provider-wrapper.js`

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint` (record pre-existing warnings only; do not introduce new ones)
- Manual verification in the local browser (`npm run dev`, typically on `http://localhost:8001`):
  - save from `/recipes` card → navigate to detail page → saved state is already reflected
  - save from detail page → navigate to `/recipes` → card reflects saved state
  - unsave from either surface → opposite surface updates after navigation
  - rapid duplicate clicks do not fire duplicate actions (pending state blocks them)
  - saved / saving / unsaved / failed states are understandable in grayscale and via keyboard only
  - failure state reachable by temporarily breaking `localStorage.setItem` in devtools (e.g., fill quota); button shows failure + retry affordance without a false success
  - screen reader announces state transitions through the `aria-live` region
  - SSR build (`npm run build`) completes with no `window is not defined` errors

### Previous Story Intelligence

- Story 2.1 established the recipe detail landing-page hierarchy with trust-first sections. Place the save button after the safety block so save only appears once the visitor has seen enough safety context (UX-DR21).
- Story 2.2 introduced `RecipeSafetyNoteBlock` in `src/components/RecipeSafetyNoteBlock.tsx` as a reusable trust pattern. Mirror its structure: small, composable, no business logic in page components.
- Story 1.6 established responsive/accessibility patterns: visible focus, semantic markup, 44px touch targets, color-independent meaning. The save button must honor all of those.
- Story 1.5 made cards on `/recipes` more likely to be direct landing surfaces through featured discovery. The card variant of the save button must stand on its own without relying on adjacent safety context — an already-featured card implies sufficient trust framing.
- Prior stories have kept lint warnings at six pre-existing brownfield items. Preserve that baseline.

### Current Implementation Baseline

- `src/templates/recipe.tsx` now renders: trust notice, decision hero, at-a-glance aside, optional image, `RecipeSafetyNoteBlock`, ingredients/instructions grid, onward paths, disclaimer. No save action exists yet.
- `src/pages/recipes.tsx` renders `RecipeCard` components built inline inside the page file. `RecipeCard` currently wraps the entire card content in a single `<a>` link — the save button will need to be a sibling interactive region so click targets do not conflict.
- `src/components/` already contains `RecipeSafetyNoteBlock.tsx`, `TrustNotice.tsx`, `Layout.tsx`, and related trust/presentational components. There is no `services/` or `contracts/` directory yet; this story creates both per the architecture's frontend structure.
- The project has no existing save/favorite pattern in the repo (grep for `save|Save` surfaces only unrelated matches in `index.tsx` and `learn/prevention.mdx`). This story establishes the first one.
- `react-oidc-context` is already wired for editor-role use (`EditorButton` in `recipe.tsx`). Do not attempt to key save state to the Cognito session — public visitors will not be authenticated.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-2.3:-Save-Recipe-Interaction-and-Persistence]
- Architecture frontend/backend boundaries: [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Architecture naming and payload rules: [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- UX save-interaction guidance: UX-DR2, UX-DR20, UX-DR21, UX-DR22, UX-DR29, UX-DR30 in [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- Project TypeScript/SSR rules: [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- Current recipe surfaces: [Source: src/templates/recipe.tsx] [Source: src/pages/recipes.tsx] [Source: src/components/RecipeSafetyNoteBlock.tsx]
- Previous story files: [Source: _bmad-output/implementation-artifacts/2-1-recipe-detail-pages-with-safety-context.md] [Source: _bmad-output/implementation-artifacts/2-2-recipe-safety-notes-and-trust-explanation.md] [Source: _bmad-output/implementation-artifacts/1-6-responsive-and-accessible-public-experience.md]

## Dev Agent Record

### Agent Model Used

claude-opus-4-7

### Debug Log References

- Story context synthesized from Epic 2 acceptance criteria, architecture authentication + save-flow boundaries, UX save-interaction patterns (UX-DR2/20/21/22/29/30), Story 2.1 and 2.2 implementation baselines, and the repo's current no-save state confirmed by grep
- Key architectural decision surfaced for this story: MVP is public-first with no login, so the save-state adapter is localStorage-backed behind a service wrapper whose shape matches the eventual `/recipes/save` + `/recipes/unsave` API contract. Backend `user_recipe_saves` work stays deferred until Story 5.5 / accounts ship.

### Completion Notes List

- Established the first `src/contracts/` and `src/services/` directories to carry the shared frontend contract and the swappable save adapter, matching the architecture's frontend/backend boundary plan.
- `src/contracts/recipes.ts` exposes `RecipeSaveRecord`, `RecipeSaveState`, `RecipeSaveErrorCode`, and `RecipeSaveError`. Field names use `snake_case` so the same shape can back the future API contract without a migration.
- `src/services/recipes/saves.ts` provides async `listSaves`, `saveRecipe`, `unsaveRecipe`, `isSaved`, plus a `subscribe()` helper that combines a custom `alphagaldata:saved-recipes:updated` event with the native `storage` event so multiple `<RecipeSaveButton>` instances (and other tabs) stay in sync. All storage access is gated behind `typeof window !== 'undefined'`, and `QuotaExceededError` surfaces as a typed `RecipeSaveError`.
- `src/services/recipes/useRecipeSave.ts` hydrates state inside `useEffect`, tracks `saving` / `unsaving` through a `pendingRef`, ignores duplicate clicks while a promise is in flight, and retains the last known saved/unsaved state when a call fails so the UI does not falsely report success.
- `src/components/RecipeSaveButton.tsx` ships `card` (compact) and `detail` (prominent) variants. Every state carries an icon + text label (no color-only meaning), maintains a 44×44 minimum touch target, exposes an `aria-live="polite"` status region, and surfaces failures inline with `recovery_guidance` and a retryable affordance.
- `src/templates/recipe.tsx` places the detail-variant button directly after `RecipeSafetyNoteBlock`, so save only appears once the visitor has seen the trust context (UX-DR21). The button sits in its own card treatment rather than competing with the recipe hero title (UX-DR20).
- `src/pages/recipes.tsx` restructures each `RecipeCard` from an `<a>`-wrapped card into an `<article>` with a focusable inner `<a>` for the recipe link and a sibling `RecipeSaveButton`. This removes the nested-interactive-element hazard and keeps the save button as its own click region without breaking existing `.card-link` styling.
- No changes to `gatsby-config.ts`, `gatsby-node.js`, `gatsby-ssr.js`, `gatsby-browser.js`, Terraform, backend, or content frontmatter. No new dependencies were added.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits with the same six pre-existing brownfield warnings from Story 2.2 (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`, `src/pages/scanner.tsx`); zero new warnings were introduced.
- Manual browser verification remains pending.

### File List

- _bmad-output/implementation-artifacts/2-3-save-recipe-interaction-and-persistence.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/contracts/recipes.ts
- src/services/recipes/saves.ts
- src/services/recipes/useRecipeSave.ts
- src/components/RecipeSaveButton.tsx
- src/templates/recipe.tsx
- src/pages/recipes.tsx
