# Story 4.3: Tattoo and Testing Guidance Pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to access tattoo-related caution guidance and testing guidance with clear educational boundaries,
so that I can understand these topics without mistaking the site for a diagnostic or treatment authority.

## Acceptance Criteria

1. Given a visitor navigates to tattoo-related guidance, when the page loads, then the page presents non-clinical caution guidance relevant to tattoos and alpha-gal awareness, and it clearly frames the content as educational rather than medical instruction.
2. Given a visitor navigates to testing guidance, when the page loads, then the page explains testing-related information in an educational context, and it includes external next-step direction where appropriate without acting as a diagnostic system.
3. Given a visitor reads tattoo or testing guidance, when the content discusses risk, uncertainty, or decision points, then the guidance distinguishes what is known, what is uncertain, and what safer next step may be appropriate, and it avoids false certainty, unsafe claims, or implied clinical authority.
4. Given a visitor needs to continue beyond AlphaGalData's educational scope, when the page references next steps, then it points clearly toward clinician discussion or external trusted resources where appropriate, and it does not position the site as the final authority for diagnosis or treatment decisions.
5. Given tattoo and testing guidance are part of the public site, when they are rendered on desktop or mobile, then the content remains readable, responsive, and accessible, and trust-critical framing remains visible without requiring hidden interactions.
6. Given these pages are reviewed for editorial and moderation standards, when public guidance is published, then it complies with the site's rules against unsafe medical claims, unverified treatment advice, and dangerous safety assertions, and the tone remains calm, practical, and consistent with the rest of the product.

## Tasks / Subtasks

- [ ] Refine tattoo guidance toward clear caution boundaries (AC: 1, 3, 4, 5, 6)
  - [ ] Review `src/pages/learn/medical-alert-tattoo.mdx` and identify where the page can better distinguish practical preparedness support from medical recommendation.
  - [ ] Strengthen caution language around permanence, visibility, personal choice, and the limits of tattoo-based alerts without weakening the current preparedness flow built in Story 4.2.
  - [ ] Keep the page non-clinical and avoid implying that AlphaGalData is recommending a tattoo as the default or only correct action.
- [ ] Tighten the testing page’s educational boundary and next-step guidance (AC: 2, 3, 4, 5, 6)
  - [ ] Review `src/pages/testing.tsx` for places where the page can better distinguish testing pathway information from diagnosis or result interpretation.
  - [ ] Make sure the page points clearly toward allergists, official lab resources, and clinician discussion where the site’s role ends.
  - [ ] Keep testing guidance practical without suggesting that ordering a lab test alone answers diagnosis or treatment questions.
- [ ] Distinguish what is known, uncertain, and next-step worthy (AC: 3, 4, 6)
  - [ ] Ensure both tattoo and testing pages clearly separate established facts, practical uncertainty, and the safest next move.
  - [ ] Reuse trust-first language patterns already present in scanner, preparedness, and learn-content flows.
  - [ ] Avoid false certainty and avoid vague caution that leaves the user without an actionable next step.
- [ ] Preserve coherent links to tools and outside authorities (AC: 2, 4, 5)
  - [ ] Keep strong links from testing guidance to official lab pages and allergist directories.
  - [ ] Keep tattoo guidance linked to downloads, wallet-card guidance, and printing support where useful.
  - [ ] Ensure users can move back into preparedness resources or broader learning without losing orientation.
- [ ] Preserve accessibility, readability, and calm trust posture (AC: 1, 2, 5, 6)
  - [ ] Keep trust-critical framing visible without hover-only or collapsed-only interactions.
  - [ ] Ensure mobile reading flow remains clear and that important warnings or next steps stay near the top of each page.
  - [ ] Keep tone practical, non-alarmist, and aligned with the rest of the site.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - tattoo guidance remains educational and cautious without sounding like a directive
    - testing guidance clearly points to clinician discussion and trusted external resources
    - known vs uncertain vs next-step messaging is understandable on both pages
    - mobile and keyboard-only reading remain clear
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 4.2 already strengthened the emergency-preparedness flow across wallet-card, tattoo, printing, and downloads pages. Story 4.3 should not redo that work; it should refine the tattoo-specific caution framing and the testing page’s educational boundaries.
- The main repo surfaces relevant to this story already exist:
  - `src/pages/learn/medical-alert-tattoo.mdx`
  - `src/pages/testing.tsx`
- The product risk here is trust drift. Tattoo guidance can easily slide into implied recommendation, and testing guidance can easily slide into implied diagnosis support if the copy is not precise.
- Keep this scoped to clearer caution language, educational boundaries, and stronger next-step framing. Cross-site surfacing work belongs mainly to Story 4.4.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind, with MDX for long-form content and TSX for the existing testing page.
- Public guidance pages should remain routed, crawlable, and lightweight.
- Reuse existing trust and layout components rather than introducing a new content system.
- Favor content and structure changes over new client-side behavior.

### Architecture Compliance

- Public guidance must preserve educational framing and avoid unsafe trust drift.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Public pages should remain lightweight, readable, and available without login or realtime dependencies.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- The product must avoid implying diagnosis, treatment authority, or unsupported medical claims.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Make the site’s scope obvious: explain what AlphaGalData can help with, and where the user should switch to a clinician or trusted external source.
- Keep the next action concrete when discussing uncertainty.
- Preserve calm, practical language rather than fear-heavy or overly reassuring copy.
- Ensure the pages still connect cleanly into preparedness tools and broader learning.

### File Structure Requirements

- Likely edits:
  - `src/pages/learn/medical-alert-tattoo.mdx`
  - `src/pages/testing.tsx`
  - possibly related trust/support links in `src/pages/downloads.tsx` only if consistency requires a light adjustment
- Do not touch unless implementation genuinely requires it:
  - scanner flows
  - dining-card flow from Story 4.1
  - broader preparedness-routing work planned for Story 4.4
  - unrelated recipe, moderation, auth, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - tattoo guidance remains clearly educational and non-clinical
  - testing guidance does not read like diagnosis or result interpretation
  - outside next steps are easy to find
  - trust-critical framing remains readable on mobile
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Story 4.1 clarified the primary downloads/resource flow for dining and printable support.
- Story 4.2 improved the emergency-preparedness path across wallet-card, tattoo, printing, and downloads content.
- The next gap is page-specific trust posture: tattoo guidance still needs explicit caution framing, and testing guidance needs stronger educational boundaries and next-step clarity.

### Current Implementation Baseline

- `src/pages/learn/medical-alert-tattoo.mdx` already contains preparedness framing, pairing guidance, and links to related tools.
- `src/pages/testing.tsx` already contains official lab test references, allergist directories, and an educational disclaimer.
- Story 4.3 should improve trust precision and decision-support language rather than introducing a new route family.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-4.3:-Tattoo-and-Testing-Guidance-Pages]
- Current implementation baseline: [Source: src/pages/learn/medical-alert-tattoo.mdx] [Source: src/pages/testing.tsx]
- Previous preparedness flow: [Source: _bmad-output/implementation-artifacts/4-2-medical-alert-and-preparedness-guidance.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 4 acceptance criteria and the current tattoo/testing pages already present in the Gatsby app.
- Repo inspection confirmed that the needed public routes already exist, so Story 4.3 is framed around trust-boundary refinement and clearer next-step guidance rather than creating new pages from scratch.

### Completion Notes List

- Marked Story 4.2 as `done` in sprint tracking per user confirmation.
- Promoted Story 4.3 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 4.3 implementation file anchored to the current tattoo and testing guidance pages.
- Tightened the tattoo page so it presents tattoo use as a personal preparedness choice with explicit limits, known/uncertain guidance, and clearer “where the site’s role ends” language.
- Tightened the testing page so it separates official pathway information from diagnosis/result interpretation and makes clinician discussion the clear next step.
- Verified with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/4-2-medical-alert-and-preparedness-guidance.md
- _bmad-output/implementation-artifacts/4-3-tattoo-and-testing-guidance-pages.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/pages/learn/medical-alert-tattoo.mdx
- src/pages/testing.tsx
