# Deferred Work

## Deferred from: code review of 1-5-featured-content-management-for-public-discovery (2026-04-18)

- Fallback recipe highlights on homepage both link to `/recipes` with different accessible names — src/pages/index.tsx `recipeHighlightsFallback`. A11y: duplicate links to the same destination with different labels. Pre-existing (inherited from original `recipeHighlights` block) and only renders when zero recipes are featured, which is not the steady state post-story. Revisit when touching homepage hero content.
