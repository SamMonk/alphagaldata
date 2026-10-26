# Story 4.1: Dining-Safe Cards and Resource Download Access

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to find, preview, and download dining-safe cards and related practical resources quickly,
so that I can use them in real-world eating situations without extra friction.

## Acceptance Criteria

1. Given a visitor navigates to dining or resource-related public pages, when those pages load, then dining-safe cards and related practical resources are clearly presented as downloadable tools, and the purpose of each resource is explained in plain language.
2. Given a visitor is deciding whether a resource is useful, when they review a dining-safe card or similar asset, then the page provides enough preview or description to understand when and how to use it, and the user does not need to download blindly to know its purpose.
3. Given a visitor wants to use a dining-safe card, when they activate the download or print path, then the resource is available through a clear public action, and the action is labeled in a way that identifies the asset and its intended use.
4. Given a visitor accesses resource downloads on desktop or mobile, when they interact with download controls and surrounding copy, then the experience remains readable, responsive, and accessible, and high-stress utility actions are not buried under decorative or low-priority content.
5. Given public dining resources are delivered through the site architecture, when assets are served in production, then they are available through stable public delivery paths, and the resource system does not require realtime features or user login for MVP use.
6. Given dining-card and resource pages are reviewed for trust posture, when public framing and explanatory copy are evaluated, then the content remains educational and practical, and it avoids implying clinical authority or guaranteed safety outcomes.
7. Given the resource experience is reviewed for performance and crawlability, when public pages and downloadable assets are evaluated, then the surrounding content remains crawlable and lightweight, and the availability of downloadable resources does not degrade high-value public page performance unnecessarily.

## Tasks / Subtasks

- [ ] Consolidate the public dining-card and printable-resource entry points (AC: 1, 2, 3, 4, 7)
  - [ ] Review current public resource surfaces such as `src/pages/learn/dining-card-guide.mdx`, `src/pages/downloads.tsx`, and `src/pages/cards/index.tsx`.
  - [ ] Decide whether Story 4.1 should strengthen one primary public route or tighten the relationship between those routes so visitors are not forced to guess where the “real” dining-card experience lives.
  - [ ] Avoid shipping multiple competing download flows with overlapping purpose and different trust framing.
- [ ] Improve dining-card preview and purpose explanation (AC: 1, 2, 3, 6)
  - [ ] Ensure the dining card is presented as a practical tool for restaurant communication, not just a raw file link.
  - [ ] Provide enough preview, description, and usage guidance that the visitor understands what the card is for before downloading.
  - [ ] Keep action labels explicit, for example `Open dining card PDF`, `Download dining card`, or `Print dining card`, rather than generic `Download`.
- [ ] Make related resources discoverable without burying the primary task (AC: 1, 3, 4, 6)
  - [ ] Present closely related resources such as wallet cards, print guidance, or dining-context support as secondary but clearly connected options.
  - [ ] Keep the dining card as the highest-priority utility when the visitor arrives from scanner or learning flows looking for real-world meal support.
  - [ ] Preserve obvious onward paths to preparedness guidance, recipes, or learn content without turning the page into a generic resource dump.
- [ ] Preserve trust posture and practical framing (AC: 2, 4, 6)
  - [ ] Maintain educational-only language and avoid claims that the card guarantees safety or replaces direct confirmation with staff.
  - [ ] Use practical, stress-friendly copy that explains when to use the card, what it helps with, and what the visitor should still verify.
  - [ ] Keep public trust framing consistent with scanner, learn pages, and preparedness resources.
- [ ] Ensure stable public delivery and lightweight implementation (AC: 4, 5, 7)
  - [ ] Keep downloadable assets on stable public paths under `static/downloads/` or the existing delivery structure.
  - [ ] Favor routed, crawlable page improvements over heavy client-side logic.
  - [ ] Avoid introducing login, realtime dependency, or unnecessary runtime complexity for the MVP resource flow.
- [ ] Preserve accessibility and mobile utility (AC: 2, 3, 4)
  - [ ] Ensure previews, descriptions, and download actions remain readable and touch-friendly on mobile.
  - [ ] Keep keyboard access and visible focus states intact for download/print actions.
  - [ ] Make the primary dining-card action easy to identify quickly under stress.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - the dining card is easy to find from the main resource flow
    - the page explains when and how to use the dining card before download
    - related resources are connected without competing with the primary action
    - download/print actions are clear on desktop and mobile
    - the resource flow remains educational in tone and does not overpromise safety
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 3.4 connected scanner results into broader label-reading and dining-related education. Story 4.1 should now give those users a clean practical destination when they need a dining card or related printable support.
- The repo already has multiple resource surfaces:
  - `src/pages/learn/dining-card-guide.mdx`
  - `src/pages/downloads.tsx`
  - `src/pages/cards/index.tsx`
  This story should reduce confusion between them or establish clearer priority, not add a fourth parallel path.
- The product risk here is fragmentation under stress. A visitor looking for a dining-safe card should not have to infer which page is canonical.
- Keep scope focused on dining-safe cards and closely related practical resources. Deeper emergency-preparedness guidance belongs mainly to Story 4.2.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind, with MDX used where content-first pages are appropriate.
- Public download and preview pages should remain crawlable routed pages with stable static asset links.
- Favor the existing layout and trust components rather than inventing a new presentation system just for downloads.
- Browser-only behavior should remain minimal; do not add heavy interactive preview logic unless absolutely necessary.

### Architecture Compliance

- Public resources should remain available without login and without realtime dependencies.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Public guidance must preserve educational framing and avoid unsafe trust drift.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Important public pages and assets should remain stable, crawlable, and lightweight.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Keep the dining card as a high-priority utility action when the visitor is trying to prepare for a meal or restaurant visit.
- Provide preview plus plain-language explanation so the user does not need to download blindly.
- Make secondary resource links helpful but clearly subordinate to the main dining-card action.
- Preserve clear paths back into learn content, recipes, or preparedness resources so the page feels connected to the rest of the site.

### File Structure Requirements

- Likely edits:
  - `src/pages/learn/dining-card-guide.mdx`
  - `src/pages/downloads.tsx`
  - `src/pages/cards/index.tsx`
  - shared layout or trust components only if needed for consistency
- Likely assets/reference paths:
  - `static/downloads/ags_dining_card_v1.pdf`
  - `static/downloads/ags_wallet_card_v1.pdf`
- Do not touch unless implementation genuinely requires it:
  - scanner service/contract files
  - unrelated recipe flows
  - moderation, auth, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - dining-card preview and download actions are clear and easy to find
  - related printable resources are connected without cluttering the primary use case
  - pages remain readable and touch-friendly on mobile
  - the flow remains educational and trust-consistent
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Story 3.4 already improved the bridge from scanner results into label-reading, cross-contamination, and dining guidance.
- Current public resource pages already expose dining cards, wallet cards, tattoo assets, and print guidance, but the flow may still feel split across separate landing pages.
- The next implementation gap is resource clarity and priority: users need a cleaner public route to dining-safe cards and nearby practical downloads.

### Current Implementation Baseline

- `src/pages/learn/dining-card-guide.mdx` already includes practical usage copy, an embedded PDF preview, and links to `/downloads`.
- `src/pages/downloads.tsx` already lists downloadable cards and broader preparedness assets, with partner-printing sections and related navigation.
- `src/pages/cards/index.tsx` is another public card/tattoo surface with overlapping goals.
- Story 4.1 should likely rationalize or strengthen these surfaces rather than creating a brand-new public route from scratch.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1:-Dining-Safe-Cards-and-Resource-Download-Access]
- Current dining/resource surfaces: [Source: src/pages/learn/dining-card-guide.mdx] [Source: src/pages/downloads.tsx] [Source: src/pages/cards/index.tsx]
- Previous connected education flow: [Source: _bmad-output/implementation-artifacts/3-4-label-reading-and-cross-contamination-guidance.md]
- UX direction for preparedness/download modules and utility-first access: [Source: _bmad-output/planning-artifacts/ux-design-specification.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 4 acceptance criteria and the existing dining/download surfaces already present in the Gatsby app.
- Repo inspection showed the dining-card experience is currently split across a guide page, a downloads page, and a cards landing page, so Story 4.1 is framed around clarifying and tightening that public resource flow.

### Completion Notes List

- Marked Story 3.4 as `done` in sprint tracking per user confirmation.
- Marked Epic 3 as `done` because all Epic 3 stories are now complete.
- Promoted Epic 4 to `in-progress`.
- Promoted Story 4.1 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 4.1 implementation file anchored to the current dining-card, downloads, and cards surfaces.
- Promoted `/downloads` as the primary dining-card resource flow by adding a featured dining-card preview, clearer purpose explanation, and explicit actions.
- Updated the dining-card guide so it remains the usage page while clearly pointing visitors to the full printable-resource library.
- Reframed `/cards` as a shortcut surface that points back to the canonical download library instead of acting like a separate source of truth.
- Verified with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/3-4-label-reading-and-cross-contamination-guidance.md
- _bmad-output/implementation-artifacts/4-1-dining-safe-cards-and-resource-download-access.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/pages/cards/index.tsx
- src/pages/downloads.tsx
- src/pages/learn/dining-card-guide.mdx
