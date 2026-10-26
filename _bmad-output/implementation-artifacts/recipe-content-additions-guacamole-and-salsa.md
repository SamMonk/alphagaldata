# Recipe Content Update: Guacamole and Chili's Salsa

Status: draft

<!-- Standalone content story draft. Sprint tracking is already complete, so this file is not linked to sprint-status.yaml. -->

## Story

As an editor,
I want to add two new public recipe entries for guacamole and Chili's salsa,
so that visitors can discover them through the existing recipe pages without any new routing or template work.

## Acceptance Criteria

1. Given the existing recipe content pipeline is in place, when the new guacamole and salsa MDX files are added under `content/recipes/`, then they appear in the public recipe index and each has its own routed detail page through the current Gatsby recipe generation flow.
2. Given the guacamole recipe is rendered, when a visitor reads it, then the recipe preserves the "measure with your heart" tone, uses approximate quantities, and keeps the chunkier two-stage mixing approach described by the user.
3. Given the guacamole recipe is rendered, when a visitor reviews the storage instructions, then the recipe tells them to press plastic wrap directly against the guacamole before sealing it in a container so oxidation is slowed.
4. Given the salsa recipe is rendered, when a visitor reads it, then the recipe faithfully transcribes the attached image, keeps the Chili's copycat framing, and preserves the ingredient list, blending method, and chill-before-serving step.
5. Given both recipes are published, when they are viewed on desktop or mobile, then the pages remain readable and accessible using the existing recipe template and content structure, without requiring special-case UI work.
6. Given the recipes are public content, when the copy is reviewed for trust posture, then it stays in the same practical, ingredient-focused voice as the existing recipe catalog and does not introduce unsafe medical claims or unrelated health guidance.

## Recipe Content Requirements

### Guacamole

- Title: `Guacamole (Measure With Your Heart)`
- Suggested slug: `/recipes/guacamole`
- Tone: casual, approximate, and confidence-building
- Frontmatter should follow the existing recipe schema used by `content/recipes/*.mdx`
- Keep the "everything is approximate" framing intact
- Preserve the staged mixing tip so the avocados stay a little chunky
- Include storage guidance that says to press plastic wrap directly against the surface before sealing the container

Suggested ingredient list:

- 4-5 avocados
- 1 Roma or Italian tomato, chopped
- 1 head cilantro, chopped
- 1 onion, chopped
- 1-2 limes
- 1-2 tsp garlic salt
- 1 tsp cumin
- 1/2 tsp chili powder

Suggested step intent:

- Combine ingredients and mix according to taste.
- For a chunkier texture, mix two avocados with half the vegetables and spices, add lime juice, then repeat with the remaining avocados.
- Press plastic wrap directly against the guacamole and seal it in a container for storage.

### Chili's Salsa

- Title: `Chili's Salsa`
- Suggested slug: `/recipes/chilis-salsa`
- Source: the attached image at `/home/shawnmonk/Downloads/4D101CBD-2C01-4355-9442-CA483F1FFBC1.jpeg`
- Keep the copycat framing and the short, practical intro
- Preserve the no-puree blending instruction
- Preserve the chill-before-serving instruction

Suggested ingredient list:

- 4 tsp canned diced jalapeno chiles
- 1/4 cup diced yellow onion
- 1 (14.5-ounce) can diced tomatoes with green chiles
- 1 (14.5-ounce) can whole peeled tomatoes with juice
- 1/2 to 3/4 tsp garlic salt
- 1/2 tsp ground cumin
- 1/4 tsp sugar

Suggested step intent:

- Process the jalapenos and onion in a food processor for a few seconds.
- Add both cans of tomatoes plus the garlic salt, cumin, and sugar.
- Process until well blended, but do not puree.
- Transfer to a container, cover, and chill well before serving.

## Tasks / Subtasks

- [ ] Create the guacamole MDX recipe file under `content/recipes/` using the existing date-prefixed naming convention and current recipe frontmatter schema.
- [ ] Create the Chili's salsa MDX recipe file under `content/recipes/` using the existing date-prefixed naming convention and current recipe frontmatter schema.
- [ ] Add the guacamole recipe copy, ingredients, steps, and storage note without removing the intentionally approximate tone.
- [ ] Transcribe the salsa recipe from the attached image with the copycat title, ingredient list, and no-puree chill instructions.
- [ ] Review both recipes for spelling, measurement consistency, and readable step order before finalizing.
- [ ] Verify the new recipes show up on the public `/recipes` page and render at their routed slugs using the existing Gatsby content pipeline.

## Dev Notes

- This is a content-only recipe update story. The current Gatsby recipe routing and listing code already discover MDX files under `content/recipes/`, so no routing or template work should be needed unless the existing schema rejects a required field.
- Match the frontmatter shape used by the existing recipe files in `content/recipes/`, including any optional safety fields if they help the recipe read cleanly on the public page.
- Keep the copy practical and human. The guacamole recipe should intentionally keep its approximate, "measure with your heart" voice instead of being normalized into exact precision.
- The salsa transcription should be checked against the attachment carefully because the source image is rotated and slightly soft in places.
- No extra public image asset is required for either recipe unless an editor later provides one.

### File Structure Requirements

- Likely new files:
  - `content/recipes/YYYY-MM-DD-guacamole.mdx`
  - `content/recipes/YYYY-MM-DD-chilis-salsa.mdx`
- Avoid changes to Gatsby routes, recipe template code, or editorial/auth flows unless the content schema unexpectedly requires it.

### Testing Requirements

- Run `npm run build` after adding the content files to confirm MDX parsing and recipe page generation still succeed.
- Run `npm run typecheck` only if the content update requires a schema or component change.
- Manually verify:
  - both recipes appear on `/recipes`
  - each recipe resolves at its routed public slug
  - the guacamole page preserves the approximate mixing and storage guidance
  - the salsa page preserves the copycat transcription and chill instruction

### References

- Existing recipe content pattern: `content/recipes/2026-02-26-cinnamon-roll-hack.mdx`
- Existing recipe content pattern: `content/recipes/2026-02-26-colorado-green-chili.mdx`
- Current recipe discovery page: `src/pages/recipes.tsx`
- Source image for salsa transcription: `/home/shawnmonk/Downloads/4D101CBD-2C01-4355-9442-CA483F1FFBC1.jpeg`

## Project Context

AlphaGalData is a Gatsby 5 + React 18 + TypeScript + Tailwind public site. Public recipe pages are generated from content files and should remain crawlable, readable, and low-overhead.

