# Story 4.2: Medical Alert and Preparedness Guidance

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to access bracelet, wallet-card, and emergency-preparedness guidance,
so that I can prepare for treatment or emergency situations with clearer practical support.

## Acceptance Criteria

1. Given a visitor navigates to medical-alert or preparedness guidance, when the page loads, then they can access public guidance about bracelet use, wallet/emergency cards, and preparedness considerations, and the content is clearly framed as educational support rather than medical instruction.
2. Given a visitor is considering a bracelet or emergency card, when they review the preparedness content, then the page explains the practical purpose of each resource, and it helps the visitor understand when each option may be useful.
3. Given a visitor needs emergency-preparedness support under stress, when they scan the page for next actions, then the most important actions and resources are easy to find quickly, and the experience does not bury them beneath low-priority content.
4. Given a visitor reviews medical-alert guidance, when the page discusses wording, usage, or preparedness considerations, then the content remains conservative and trust-sensitive, and it does not imply diagnosis, treatment authority, or guaranteed protection.
5. Given preparedness guidance includes downloadable or reusable resources, when those resources are presented, then they are linked clearly from the preparedness flow, and the visitor can move between explanatory content and practical tools without losing context.
6. Given the preparedness guidance is used on desktop or mobile, when the visitor reads or navigates the content, then the page remains readable, responsive, and accessible, and key preparedness actions remain touch-friendly and keyboard operable.
7. Given the preparedness experience is reviewed for consistency, when trust language and educational framing are evaluated, then it aligns with the same public-safety posture used across recipes, scanner results, and downloads, and it does not introduce conflicting guidance models or unsafe claims.

## Tasks / Subtasks

- [ ] Strengthen the medical-alert and preparedness guidance flow (AC: 1, 2, 3, 4, 5, 7)
  - [ ] Review existing public preparedness pages such as `src/pages/learn/wallet-card-guide.mdx`, `src/pages/learn/medical-alert-tattoo.mdx`, `src/pages/learn/printing-alpha-gal-cards.mdx`, and `src/pages/downloads.tsx`.
  - [ ] Decide whether to anchor Story 4.2 in one primary preparedness route or improve the linkage among existing pages so the experience reads as one connected preparedness flow.
  - [ ] Keep the distinction clear between medical-alert preparedness support and broader dining-card/download utility work already covered in Story 4.1.
- [ ] Clarify the purpose of bracelet, wallet-card, and emergency-preparedness tools (AC: 1, 2, 4, 5)
  - [ ] Ensure the guidance explains what each tool is for, when it is useful, and where it fits in real emergency planning.
  - [ ] Include practical explanation for bracelet use, wallet/emergency cards, and related backup measures such as phone lock screens or shared family access where the existing content supports it.
  - [ ] Keep language conservative and avoid implying that any one tool guarantees protection.
- [ ] Make high-priority preparedness actions easy to scan under stress (AC: 2, 3, 6, 7)
  - [ ] Present the most important next actions and downloadable resources near the top of the preparedness flow.
  - [ ] Avoid burying key emergency-use actions beneath secondary affiliate, printing, or long-form explanatory content.
  - [ ] Preserve mobile readability, keyboard access, and touch-friendly action targets.
- [ ] Connect explanatory guidance to practical downloads and tools (AC: 3, 5, 6)
  - [ ] Link clearly between the preparedness explanation and the relevant wallet-card, tattoo, printing, and download assets.
  - [ ] Preserve orientation so the user can move between guidance and practical tools without feeling dropped into unrelated pages.
  - [ ] Keep the flow routed and crawlable rather than relying on complex client-side interactions.
- [ ] Preserve trust posture and public-safety consistency (AC: 1, 4, 7)
  - [ ] Use educational-only framing consistent with the rest of the public site.
  - [ ] Avoid diagnostic, treatment-authority, or guaranteed-protection language.
  - [ ] Keep the preparedness tone calm, practical, and aligned with scanner, recipes, and download flows.
- [ ] Verify implementation quality (AC: 1, 2, 3, 4, 5, 6, 7)
  - [ ] Run `npm run typecheck`.
  - [ ] Run `npm run lint` and preserve the current brownfield warning baseline only.
  - [ ] Manually verify in the browser:
    - preparedness actions are easy to spot quickly
    - bracelet, wallet-card, and related guidance have clear practical explanation
    - the flow connects naturally to downloads and printable tools
    - trust-sensitive language stays conservative and educational
    - the guidance remains readable and touch-friendly on mobile
    - `npm run build` completes without SSR regressions

## Dev Notes

- Story 4.1 established a clearer primary route for dining-safe cards and related printable resources. Story 4.2 should now focus on the emergency-preparedness side of the same public support system.
- The repo already contains relevant preparedness pages:
  - `src/pages/learn/wallet-card-guide.mdx`
  - `src/pages/learn/medical-alert-tattoo.mdx`
  - `src/pages/learn/printing-alpha-gal-cards.mdx`
  - `src/pages/downloads.tsx`
  This story should improve coherence and action priority across them rather than creating unnecessary duplicate pages.
- The product risk here is high-anxiety fragmentation. A user preparing for emergency care should be able to see what to carry, what to download, and what to discuss quickly.
- Keep this story centered on bracelet/wallet-card/emergency-preparedness guidance. Tattoo-specific caution depth and testing-specific content belong more directly to Story 4.3.

### Technical Requirements

- Framework remains Gatsby 5 + React 18 + TypeScript + Tailwind, with MDX used for content-first guidance where appropriate.
- Public preparedness content should remain routed, crawlable, and lightweight.
- Reuse existing layout and trust components instead of introducing a separate preparedness UI system unless there is a clear need.
- Favor static page composition and strong linking over new client-side complexity.

### Architecture Compliance

- Public preparedness resources should remain available without login and without realtime dependencies.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Public trust posture must remain educational and conservative across preparedness content.  
  [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- Important public pages should remain readable, lightweight, and crawlable.  
  [Source: _bmad-output/planning-artifacts/prd.md]

### UX / Content Guidance

- Prioritize the most important preparedness actions so the page works in stressful situations, not just as long-form reading.
- Explain the practical role of each resource in plain language before asking the user to download or print anything.
- Keep related resources connected, but make the primary preparedness path obvious.
- Preserve clear onward paths into downloads, dining resources, and educational content so the experience feels unified.

### File Structure Requirements

- Likely edits:
  - `src/pages/learn/wallet-card-guide.mdx`
  - `src/pages/learn/medical-alert-tattoo.mdx`
  - `src/pages/learn/printing-alpha-gal-cards.mdx`
  - `src/pages/downloads.tsx`
  - possibly `src/pages/cards/index.tsx` if a preparedness link adjustment is needed for consistency
- Likely assets/reference paths:
  - `static/downloads/ags_wallet_card_v1.pdf`
  - `static/downloads/ags_medical_alert_tattoo.svg`
  - `static/downloads/ags_wrist_tattoo_simple.svg`
- Do not touch unless implementation genuinely requires it:
  - scanner contracts/services
  - recipe/save flows
  - unrelated moderation, auth, or Terraform files

### Testing Requirements

- Run `npm run typecheck`
- Run `npm run lint`
- Manually verify:
  - emergency-preparedness guidance is easy to scan and act on
  - wallet-card and related tool explanations are clear
  - practical downloads remain well-linked from the preparedness flow
  - mobile readability and keyboard access are preserved
  - `npm run build` succeeds without SSR issues

### Previous Story Intelligence

- Story 4.1 clarified the dining-card and download flow by making `/downloads` the primary public resource library for meal-support tools.
- Existing preparedness content already covers wallet cards, tattoo designs, and printing instructions, but it still needs stronger emergency-preparedness framing and priority.
- The next implementation gap is turning those pages into a clearer preparedness system for real emergency and treatment-related planning.

### Current Implementation Baseline

- `src/pages/learn/wallet-card-guide.mdx` already explains wallet card use and includes a PDF preview.
- `src/pages/learn/medical-alert-tattoo.mdx` already frames tattoo guidance as educational emergency preparedness content and links to related tools.
- `src/pages/learn/printing-alpha-gal-cards.mdx` already covers practical print workflows for cards and tattoos.
- `src/pages/downloads.tsx` already functions as the broader printable resource library and now emphasizes the dining card as the primary meal-support asset.
- Story 4.2 should likely strengthen the emergency-preparedness path and cross-linking rather than creating a brand-new public section from scratch.

### References

- Story definition and acceptance criteria: [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2:-Medical-Alert-and-Preparedness-Guidance]
- Current preparedness/resource surfaces: [Source: src/pages/learn/wallet-card-guide.mdx] [Source: src/pages/learn/medical-alert-tattoo.mdx] [Source: src/pages/learn/printing-alpha-gal-cards.mdx] [Source: src/pages/downloads.tsx]
- Previous story file: [Source: _bmad-output/implementation-artifacts/4-1-dining-safe-cards-and-resource-download-access.md]
- UX direction for preparedness/download modules and utility access: [Source: _bmad-output/planning-artifacts/ux-design-specification.md]

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- Story context synthesized from Epic 4 acceptance criteria and the existing preparedness/download pages already present in the Gatsby app.
- Repo inspection confirmed the wallet-card, tattoo, printing, and downloads pages already exist, so Story 4.2 is framed around coherent emergency-preparedness guidance and action priority rather than creating a duplicate content branch.

### Completion Notes List

- Marked Story 4.1 as `done` in sprint tracking per user confirmation.
- Promoted Story 4.2 from `backlog` to `ready-for-dev`.
- Created a dedicated Story 4.2 implementation file anchored to the current wallet-card, tattoo, printing, and downloads surfaces.
- Strengthened the wallet-card guide with clearer preparedness framing, layered backup guidance, and direct links into the preparedness resource flow.
- Expanded the medical-alert tattoo guide with a quicker preparedness path, bracelet-vs-tattoo-vs-wallet-card comparison, and clearer onward actions into downloads and printing.
- Updated the printing guide and downloads page so emergency-preparedness choices and practical next steps are easier to scan before diving into files or partner links.
- Verified with `npm run typecheck`, `npm run lint`, and `HOME=/tmp npm run build`.

### File List

- _bmad-output/implementation-artifacts/4-1-dining-safe-cards-and-resource-download-access.md
- _bmad-output/implementation-artifacts/4-2-medical-alert-and-preparedness-guidance.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/pages/downloads.tsx
- src/pages/learn/medical-alert-tattoo.mdx
- src/pages/learn/printing-alpha-gal-cards.mdx
- src/pages/learn/wallet-card-guide.mdx
