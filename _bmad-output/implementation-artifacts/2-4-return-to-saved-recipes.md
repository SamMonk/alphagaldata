# Story 2.4: Return to Saved Recipes

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to revisit recipes I have saved,
so that I can quickly return to food choices I already trust.

## Acceptance Criteria

1. Given a visitor has previously saved one or more recipes, when they access the saved-recipes experience or equivalent return path, then they can view a list of their saved recipes, and each saved item links back to its recipe detail page.
2. Given a visitor views their saved recipes, when the list is rendered, then each item provides enough identifying information to recognize the recipe, and the saved state remains consistent with the main recipe experience.
3. Given a visitor has no saved recipes yet, when they access the saved-recipes experience, then the product shows an empty state with a clear next step, and it routes the user back toward recipe discovery rather than presenting a dead end.
4. Given a visitor removes a recipe from saved state, when they return to the saved-recipes experience, then the removed recipe no longer appears in the list, and the saved-recipes view reflects current backend state accurately.
5. Given a visitor opens a saved recipe from the saved-recipes experience, when the recipe detail page loads, then the page preserves the saved-state indicator, and the user can continue from recipe review into action without losing context.
6. Given the saved-recipes experience is used on desktop or mobile, when it is rendered across supported breakpoints, then it remains readable, responsive, and accessible, and it does not depend on complex interactions to revisit saved items.
7. Given the saved-recipes experience is implemented, when it is evaluated for architecture and privacy posture, then it relies only on minimal recipe-save operational data, and it does not expand into personal health tracking or unrelated profile storage.

## Tasks / Subtasks

- [x] Define the saved-recipes route and retrieval path (AC: 1, 6, 7)
  - [x] Create a routed Gatsby page at `src/pages/saved-recipes.tsx` as the primary return surface for saved items.
  - [x] Use the existing `listSaves()` service from `src/services/recipes/saves.ts` as the sole source for saved slugs; do not read the localStorage key directly in page code.
  - [x] Keep the route public and client-hydrated; do not add auth requirements, backend APIs, or DynamoDB integration in this story.
- [x] Resolve saved slugs against existing recipe content (AC: 1, 2, 4, 5, 7)
  - [x] Query the recipe MDX collection already used by `src/pages/recipes.tsx` and `src/templates/recipe.tsx` so each saved item can render recognizable recipe metadata.
  - [x] Join saved records to recipe nodes by `frontmatter.slug`, preserving saved ordering in a deliberate way, preferably most recently saved first using `saved_at`.
  - [x] Gracefully handle stale saves whose slug no longer resolves to content by excluding them from the visible list or clearly marking them unavailable without breaking the page.
- [x] Build a reusable saved-recipes presentation (AC: 1, 2, 5, 6)
  - [x] Render each saved item as a recognizable card or list row with at minimum the recipe title, short description if available, and a clear link back to the recipe detail page.
  - [x] Reuse the existing `RecipeSaveButton` so the saved state, unsave behavior, labels, and announcements stay consistent with the recipe index and detail page.
  - [x] Ensure each saved item remains understandable without depending on color, truncation, or hover-only affordances.
- [x] Implement the empty state and return path cues (AC: 3, 6)
  - [x] Show a deliberate empty state when `listSaves()` returns no items.
  - [x] Include one clear next step back to discovery, such as linking to `/recipes`, and optionally a secondary route to another useful trust-building surface like `/scanner`.
  - [x] Make the empty state feel like guidance toward action, not failure, consistent with the UX empty-state rules.
- [x] Keep the saved list synchronized with current save state (AC: 2, 4, 5, 6)
  - [x] Subscribe to the existing save-state update mechanism so unsaving from the saved-recipes page immediately removes the item without a reload.
  - [x] Confirm that unsaving from other same-tab surfaces and returning to `/saved-recipes` reflects current state accurately.
  - [x] Preserve the existing recipe detail saved indicator by continuing to use the shared save hook and button rather than adding route-specific save logic.
- [x] Add a visible entry point into the saved-recipes experience (AC: 1, 3, 5)
  - [x] Add at least one clear return cue from an existing recipe surface, likely `src/pages/recipes.tsx` and/or the detail-page save treatment in `src/components/RecipeSaveButton.tsx`.
  - [x] Phrase the cue as returning to saved recipes or viewing saved recipes, not as profile/account language.
  - [x] Do not bury the route behind editor-only or authenticated UI.
- [x] Preserve SSR, performance, and brownfield constraints (AC: 6, 7)
  - [x] Guard browser-only save retrieval behind hydration or `typeof window !== 'undefined'` patterns so Gatsby SSR and build output do not throw.
  - [x] Keep the page lightweight and crawl-safe; the route itself may be static while the saved list hydrates client-side.
  - [x] Do not modify `gatsby-node.js`, `gatsby-config.ts`, backend code, Terraform, or content frontmatter for this story.
- [x] Verify implementation quality (AC: 2, 3, 4, 5, 6, 7)
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - saved recipes appear on `/saved-recipes`
    - empty state routes users back to `/recipes`
    - unsaving removes the item from the saved list immediately
    - opening a saved recipe preserves the `Saved` state on the detail page
    - the page is keyboard-usable and understandable in grayscale on mobile and desktop
    - `npm run build` completes without `window is not defined` errors

## Dev Notes

- Story 2.3 already established the save contract, local adapter, same-tab update broadcast, and reusable `RecipeSaveButton`. Story 2.4 should consume those seams rather than re-implementing save storage or state handling.
- MVP save persistence is still public, anonymous, and device-local. Do not invent Cognito identity, DynamoDB writes, or `/recipes/save` API calls here. Those remain future architecture paths once accounts exist.
- The main product value in this story is a calm return path for recipes a visitor already decided they trust. The experience should feel like a continuation of recipe discovery, not a user account dashboard.
- Keep this story focused on the saved-recipes surface and the route into it. Broader collections, folders, sharing, or profile concepts are out of scope.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind. Keep new code in TypeScript and use relative imports only.
- Browser-only storage access must remain SSR-safe. Hydrate saves in `useEffect` or behind guarded service calls rather than during server render.
- Shared save behavior must continue flowing through `src/services/recipes/saves.ts`, `src/services/recipes/useRecipeSave.ts`, and `src/components/RecipeSaveButton.tsx`.
- Preserve the current local/component state approach; do not add Redux, Zustand, Jotai, or another global state library.
- Continue using `snake_case` contract fields where save payloads cross service boundaries.

### Architecture Compliance

- Recipe save flows are an interactive island in the Gatsby frontend and should not force a SPA shift or heavy global state.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Save-related client calls should go through shared service wrappers rather than scattered page logic.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- MVP remains public-first with no login for public content, and MVP must avoid storing health-tracking data.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- The future backend direction uses `/recipes/save` and the `user_recipe_saves` table, but this story should stay on the existing local adapter boundary.  
  [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]

### Library / Framework Requirements

- Default exports remain appropriate for Gatsby pages; utilities and shared helpers should continue using the repo's existing TypeScript patterns.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- No path aliases; use relative imports.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- `npm run typecheck` and `npm run lint` remain required verification steps for story completion.  
  [Source: _bmad-output/project-context.md#Critical Implementation Rules]

### File Structure Requirements

- New file:
  - `src/pages/saved-recipes.tsx` for the return-to-saved-recipes route.
- Likely edits:
  - `src/pages/recipes.tsx` to add a visible cue into `/saved-recipes`
  - `src/components/RecipeSaveButton.tsx` if a shared return cue belongs with the existing save treatment
  - `src/services/recipes/useRecipeSave.ts` only if a small extension is needed for page-level synchronization
- Do not touch:
  - `gatsby-node.js`, `gatsby-config.ts`, `gatsby-browser.js`, `gatsby-ssr.js`
  - `backend/`, `tf/`, or any Terraform files
  - recipe MDX frontmatter schema unless a concrete implementation blocker proves it is unavoidable

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - save a recipe on `/recipes` or a detail page, then open `/saved-recipes` and confirm the card renders recognizable metadata
  - use the saved-recipes link or cue without logging in
  - unsave from `/saved-recipes` and confirm the item disappears without a reload
  - open a saved recipe and confirm the detail page still shows `Saved`
  - verify the empty state includes a clear route back to recipe discovery
  - verify keyboard navigation, focus visibility, and color-independent state meaning
  - run `npm run build` successfully with no SSR storage errors

### Previous Story Intelligence

- Story 2.3 created `src/contracts/recipes.ts`, `src/services/recipes/saves.ts`, `src/services/recipes/useRecipeSave.ts`, and `src/components/RecipeSaveButton.tsx`; those files are the intended foundation for this story.
- Story 2.3 already uses a same-tab update event plus the native `storage` event, so the saved-recipes page should reuse that subscription model instead of introducing its own event channel.
- `src/pages/recipes.tsx` and `src/templates/recipe.tsx` now expose save actions on both card and detail surfaces; Story 2.4 should connect those surfaces to a return path rather than replacing them.

### Current Implementation Baseline

- `src/pages/recipes.tsx` renders recipe cards and already includes `RecipeSaveButton` for each card.
- `src/templates/recipe.tsx` renders the prominent detail-page `RecipeSaveButton` after `RecipeSafetyNoteBlock`, keeping save after visible safety context.
- `src/services/recipes/saves.ts` exposes `listSaves()`, `saveRecipe()`, `unsaveRecipe()`, `isSaved()`, and `subscribe()` on top of the `alphagaldata:saved-recipes` localStorage key.
- `src/pages/saved-recipes.tsx` now provides the return-to-saved-recipes route and resolves saved slugs against the existing recipe MDX collection.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-2.4:-Return-to-Saved-Recipes]
- Save-service and UI baseline: [Source: src/services/recipes/saves.ts] [Source: src/services/recipes/useRecipeSave.ts] [Source: src/components/RecipeSaveButton.tsx]
- Current recipe surfaces: [Source: src/pages/recipes.tsx] [Source: src/templates/recipe.tsx]
- Architecture boundaries and naming: [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security] [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- UX save and empty-state guidance: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Save Recipe State] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Additional Patterns] [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines]
- Project TypeScript and SSR rules: [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- Previous story file: [Source: _bmad-output/implementation-artifacts/2-3-save-recipe-interaction-and-persistence.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 2 acceptance criteria, the current save-state implementation added in Story 2.3, and architecture/UX guidance for public-first, SSR-safe saved-recipe behavior.
- Repo inspection confirmed the save service and shared button were already in place, so implementation could add `/saved-recipes` by reusing the existing save-state seams instead of introducing new storage logic.

### Completion Notes List

- Added `src/pages/saved-recipes.tsx` as a public Gatsby route that hydrates the device-local save list through the shared recipe save service rather than reading localStorage directly in page code.
- Ordered saved items by most recent `saved_at`, resolved them against existing recipe MDX content by slug, and hid stale saves behind a small explanatory notice instead of breaking the page.
- Reused `RecipeSaveButton` inside the saved-recipes list so save labels, announcements, and unsave behavior remain aligned with the recipe card and detail surfaces.
- Added visible return cues to `/saved-recipes` from the recipes index and from saved button states so the route is reachable from active recipe workflows without introducing account language.
- `npm run typecheck` passed on 2026-04-20.
- `npm run lint` exits with the same six pre-existing brownfield warnings (`gatsby-ssr.js`, `scripts/generate_pins.js`, `src/components/TimelineMap.tsx`, `src/pages/scanner.tsx`); zero new warnings were introduced.
- `npm run build` passed on 2026-04-20 when run with `HOME=/tmp` because Gatsby attempted to write under `/home/shawnmonk/.config` in the sandboxed environment.
- Manual browser verification remains pending.

### File List

- _bmad-output/implementation-artifacts/2-4-return-to-saved-recipes.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/RecipeSaveButton.tsx
- src/pages/recipes.tsx
- src/pages/saved-recipes.tsx
