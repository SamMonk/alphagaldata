---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/prd.md
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/architecture.md
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/ux-design-specification.md
lastStep: 4
status: 'complete'
completedAt: '2026-04-17'
updatedAt: '2026-07-21'
updateNote: 'Appended Epic 7 (Content Library Growth: Family Recipes and Safe Finds) with FR49-FR52 to expand original recipe depth from personal/family sources and add a new Safe Finds content type for verified store-bought alpha-gal-safe products (e.g., gelatin-free gummies). Epics 1-6 unchanged.'
---

# alphagaldata - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for alphagaldata, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can browse featured recipes from public routed pages.
FR2: Visitors can discover educational content related to label reading, cross-contamination, testing, and safe eating.
FR3: Visitors can navigate between recipes, educational content, downloads, and safety resources through clear internal linking.
FR4: Visitors can access caregiver-relevant guidance from the public site.
FR5: Visitors can find public content through search-engine-indexable pages and structured topical navigation.
FR6: Visitors can view recipe detail pages with ingredients, instructions, and alpha-gal safety context.
FR7: Visitors can view recipe-specific safety notes and substitution guidance.
FR8: Visitors can save recipes for later use.
FR9: Visitors can return to previously saved recipes.
FR10: Editors can feature selected recipes more prominently than standard content.
FR11: Visitors can use an ingredient scanner to evaluate food or ingredient-list safety.
FR12: Visitors can manually enter or paste ingredient text for safety review.
FR13: Visitors can receive educational guidance about suspicious or unsafe ingredient patterns.
FR14: Visitors can access label-reading education outside the scanner workflow.
FR15: Visitors can access cross-contamination avoidance guidance tied to food and dining contexts.
FR16: Visitors can access dining-safe cards and related downloadable resources.
FR17: Visitors can download practical resources for dining and safety use.
FR18: Visitors can access bracelet guidance for medical-alert preparedness.
FR19: Visitors can access tattoo guidance that includes safety considerations and non-clinical risk awareness.
FR20: Visitors can access testing guidance and external next-step resources without AlphaGalData acting as a diagnostic tool.
FR21: Community contributors can submit stories or recipes for review.
FR22: Moderators can review submitted stories before publication.
FR23: Moderators can review submitted recipes before publication.
FR24: Moderators can approve, reject, or request revision on submitted content.
FR25: Moderators can record internal review notes about submitted content.
FR26: The product can prevent unreviewed submissions from being published publicly.
FR27: Editors can update public educational content, featured content, and downloadable resources.
FR28: The product can display educational-only disclaimers on trust-sensitive content areas.
FR29: The product can distinguish public educational guidance from medical advice or diagnosis.
FR30: The product can enforce moderation standards that prohibit unsafe medical claims.
FR31: The product can enforce moderation standards that prohibit unverified treatment advice.
FR32: The product can enforce moderation standards that prohibit dangerous ingredient or safety claims.
FR33: Editors can maintain public trust content without requiring user health-data collection.
FR34: Visitors can use the site from modern desktop and mobile browsers.
FR35: Visitors can access the public site through routed pages without requiring login for MVP content.
FR36: Visitors can use the core public experience without real-time features such as chat or live notifications.
FR37: Visitors can use a responsive experience for recipes, education, downloads, and safety resources.
FR38: Visitors can access a public site experience designed for strong accessibility and readable content structure.
FR39: The product can support future member accounts without changing the public MVP experience.
FR40: The product can support future user-only materials in a later phase.
FR41: The product can support future trusted-member contribution workflows in a later phase.
FR42: The product can preserve the no-health-tracking posture in MVP while allowing future product decisions to revisit private features separately.
FR43: The product can present a substantial library of original, alpha-gal-safe recipes with original imagery and unique narrative context.
FR44: The product can present educational content with visible authorship, review dates, and cited sources appropriate to health-sensitive topics.
FR45: The product can exclude thin, functional, and utility pages from search-engine indexing while keeping high-value content crawlable.
FR46: The product can present any retained tool or interactive page with substantial original explanatory content so it stands alone as valuable.
FR47: The product can provide advertising, privacy, ownership, and editorial disclosures that satisfy advertising-network publisher requirements.
FR48: The product can expose structured data and complete, accurate sitemap/internal-linking so high-value content is discoverable and machine-readable for re-review.
FR49: The site owner can convert personal and family recipe sources (handwritten notes, photos, dictated instructions) into published site recipes that match the established recipe content type and safety framing.
FR50: Visitors can browse a Safe Finds collection of verified store-bought products (such as gelatin-free gummies) that are alpha-gal-safe when the label is confirmed, distinct from cook-at-home recipes.
FR51: Visitors can view each Safe Find with its brand, where to buy it, why it may be alpha-gal-safe, and the label caveats to re-verify before purchase.
FR52: Visitors can discover Safe Finds and recipes through shared navigation and cross-linking so both content types reinforce a single trusted library.

### NonFunctional Requirements

NFR1: Public recipe, education, and safety-resource pages should become usable within 2 to 3 seconds under normal mobile and desktop conditions.
NFR2: The product should minimize unnecessary client-side overhead on high-value public pages, especially recipes, downloads, and educational content.
NFR3: Interactive features such as the ingredient scanner should not degrade the performance of the broader public content experience.
NFR4: The product must prevent accidental publication of unreviewed user submissions.
NFR5: Moderation and editorial access must be protected so that only authorized operators can approve, reject, revise, or publish trust-sensitive content.
NFR6: The MVP must avoid storing user health-tracking data.
NFR7: Trust-sensitive content areas must preserve editorial control and prevent unsafe claims from reaching public pages without review.
NFR8: Occasional downtime is tolerable, but the public site should normally remain available for browsing recipes, education, downloads, and safety guidance.
NFR9: Failures in non-core or interactive features should not make core public content unavailable.
NFR10: The product should favor a stable, low-complexity operating model over fragile feature breadth in the MVP.
NFR11: AlphaGalData should be a good accessible public site for broad public use.
NFR12: Core public pages should support readable content structure, usable keyboard navigation, understandable links, and clear page hierarchy.
NFR13: Important public information should remain usable without requiring complex interactions or advanced interface behavior.
NFR14: The product must maintain clean, stable, human-readable URLs for important public content.
NFR15: The product must provide proper titles and metadata for key public pages.
NFR16: The product must keep important public pages crawlable by search engines.
NFR17: The product must use internal linking to connect recipes, education, downloads, and safety resources into a coherent search-visible content structure.
NFR18: The product must provide a sitemap for search discovery.
NFR19: Important public content must not be hidden behind JavaScript-dependent rendering that prevents effective indexing.

### Additional Requirements

- Preserve the existing Gatsby brownfield architecture as the public frontend foundation rather than replatforming.
- Deploy the frontend through S3 and CloudFront and keep public content pre-rendered and crawlable.
- Implement interactive features through API Gateway HTTP APIs, Lambda, DynamoDB, and S3 rather than heavy frontend-only logic.
- Use multiple DynamoDB tables with explicit domain boundaries, including `ingredient_catalog`, `user_recipe_saves`, `submission_queue`, and `operational_metadata`.
- Keep the MVP public-first with no login for public content, scanner use, or downloads.
- Protect admin and moderation operations from day one through authenticated backend-only access.
- Enforce moderation and publication rules in backend services, not in frontend code.
- Standardize trust-sensitive API responses around backend-owned risk and next-action contracts.
- Use the canonical trust vocabulary: `known_risk`, `caution`, `unknown`, `avoid`, `verify_before_using`, and `research_before_buying`.
- Validate all API request bodies and query inputs at Lambda boundaries before domain logic runs.
- Use a standard API envelope with `data`, `meta`, and `error` fields for trust-sensitive JSON APIs.
- Keep Gatsby page components free of business logic and route trust-critical operations through shared frontend service wrappers.
- Centralize logging, metrics, and tracing patterns for Lambda using structured logs and AWS Lambda Powertools for TypeScript.
- Split infrastructure clearly across frontend delivery, API/runtime, data/storage, and observability concerns under Terraform.
- Isolate environments for at least development and production, including separate tables, buckets, and API stages.
- Use `snake_case` for API payload fields and DynamoDB attributes and treat deviations as architectural changes.
- Keep trust/risk interpretation centralized in shared backend/domain contracts, not duplicated in UI heuristics.
- Ensure backend repositories are the only layer aware of DynamoDB or S3 implementation details.
- Maintain independent deployability between frontend delivery and backend runtime.
- Carry two open implementation clarifiers into story planning: choose the exact admin authentication mechanism and define the authoritative source-of-truth rule for shared contracts.

### UX Design Requirements

UX-DR1: Implement the primary public journey around `find -> understand safety -> save`, with safety notes and substitutions visible before or alongside the save action.
UX-DR2: Make recipe saving the most effortless primary interaction on recipe cards and recipe detail pages, including clear saved, saving, unsaved, and failed states.
UX-DR3: Implement scanner result behavior as a conservative decision-support flow with explicit `Known risk`, `Caution`, and `Unknown` outcomes and paired next-step actions.
UX-DR4: Ensure unknown or ambiguous ingredients route users to explanation and safer next steps instead of vague reassurance or dead ends.
UX-DR5: Build the homepage and key landing pages around dual entry points: food discovery and ingredient checking.
UX-DR6: Use task-oriented navigation labels such as `What can I eat?`, `Check ingredients`, and `Get dining cards` instead of category-heavy navigation where appropriate.
UX-DR7: Keep emergency-preparedness and dining-card access persistently reachable through navigation or repeated utility surfaces rather than burying them in a footer-only treatment.
UX-DR8: Implement a restrained trust-first visual system with evergreen authority tones, warm neutral backgrounds, semantic caution colors, and no color-only status meaning.
UX-DR9: Implement typography that blends editorial warmth and tool clarity, including readable headline/body pairings and long-form content readability on desktop and mobile.
UX-DR10: Apply an `8px`-based spacing system with spacious reading layouts, strong content grouping, and mobile-first stacking that keeps trust-critical information above ornamental content.
UX-DR11: Implement the chosen design direction as `Decision Engine` first, softened with warmer editorial treatment and recipe-card micro-hierarchy.
UX-DR12: Build a highly polished `Recipe Card With Safety Hierarchy` component with title, comfort-oriented description, ingredient preview, safety note excerpt, substitutions preview, and save action.
UX-DR13: Build a reusable `Safety Note Block` component with heading, status tier, explanation, substitution or avoidance notes, next action, and optional source note.
UX-DR14: Build a reusable `Scanner Result State Card` component that presents ingredient name, risk tier, next-step action, explanation, and source/context link.
UX-DR15: Build a reusable `Ingredient Classification List` component that groups parsed ingredients, risk classification, expandable explanation, and ambiguous-result handling.
UX-DR16: Build a reusable `Preparedness / Download Module` component for dining cards, wallet cards, and emergency-prep resources with clear preview/download actions.
UX-DR17: Build a reusable `Trust / Source Callout` component that explains source strength, uncertainty, and recommended next step.
UX-DR18: Build a reusable `Risk Tier Label With Next Action` pattern that standardizes status communication across recipes, scanner results, and preparedness guidance.
UX-DR19: Reserve custom component work for trust-critical moments and lean on standard design-system primitives for generic layout, forms, buttons, navigation, panels, and dialogs.
UX-DR20: Standardize button hierarchy so primary actions are reserved for safest or highest-value next actions such as `Save recipe`, `Check ingredients`, and `Download dining card`.
UX-DR21: Ensure save actions only appear after enough safety context is visible and never compete visually with multiple equal primary actions in the same area.
UX-DR22: Standardize feedback patterns so success, caution, unknown, and error states always combine label, explanation, and next action.
UX-DR23: Make `Known risk` pair with `Avoid`, `Caution` pair with `Verify before using`, and `Unknown` pair with `Research before buying` consistently across the UI.
UX-DR24: Ensure form patterns support paste-first scanner input, visible labels, inline validation, and explicit moderation expectations on submission forms.
UX-DR25: Treat uncertainty as a first-class designed state with explanation of what is known, what is unclear, and the safest next step.
UX-DR26: Keep modals and overlays out of core safety reasoning where inline presentation is possible.
UX-DR27: Use mobile-first responsive behavior with controlled reading widths, stacked trust-critical content, and layouts that preserve clarity across mobile, tablet, and desktop.
UX-DR28: Ensure trust-critical meaning is never hidden behind hover-only interactions and remains understandable at all breakpoints.
UX-DR29: Meet strong public accessibility expectations including visible focus states, keyboard access, semantic headings, readable contrast, color-independent status meaning, and screen-reader-friendly saved/error/risk-state announcements.
UX-DR30: Support touch-friendly controls and `44x44px` minimum target intent for mobile trust-critical actions.

### FR Coverage Map

FR1: Epic 1 - browse featured recipes from public routed pages
FR2: Epic 1 - discover educational content related to label reading, cross-contamination, testing, and safe eating
FR3: Epic 1 - navigate between recipes, educational content, downloads, and safety resources
FR4: Epic 1 - access caregiver-relevant guidance from the public site
FR5: Epic 1 - find public content through search-engine-indexable pages and structured topical navigation
FR6: Epic 2 - view recipe detail pages with alpha-gal safety context
FR7: Epic 2 - view recipe-specific safety notes and substitution guidance
FR8: Epic 2 - save recipes for later use
FR9: Epic 2 - return to previously saved recipes
FR10: Epic 1 - feature selected recipes more prominently than standard content
FR11: Epic 3 - use an ingredient scanner to evaluate ingredient-list safety
FR12: Epic 3 - manually enter or paste ingredient text for safety review
FR13: Epic 3 - receive educational guidance about suspicious or unsafe ingredient patterns
FR14: Epic 3 - access label-reading education outside the scanner workflow
FR15: Epic 3 - access cross-contamination avoidance guidance tied to food and dining contexts
FR16: Epic 4 - access dining-safe cards and related downloadable resources
FR17: Epic 4 - download practical resources for dining and safety use
FR18: Epic 4 - access bracelet guidance for medical-alert preparedness
FR19: Epic 4 - access tattoo guidance with safety considerations and non-clinical risk awareness
FR20: Epic 4 - access testing guidance and external next-step resources without acting as a diagnostic tool
FR21: Epic 5 - submit stories or recipes for review
FR22: Epic 5 - moderators review submitted stories before publication
FR23: Epic 5 - moderators review submitted recipes before publication
FR24: Epic 5 - moderators approve, reject, or request revision on submitted content
FR25: Epic 5 - moderators record internal review notes about submitted content
FR26: Epic 5 - prevent unreviewed submissions from being published publicly
FR27: Epic 5 - editors update public educational content, featured content, and downloadable resources
FR28: Epic 1 - display educational-only disclaimers on trust-sensitive content areas
FR29: Epic 1 - distinguish public educational guidance from medical advice or diagnosis
FR30: Epic 5 - enforce moderation standards that prohibit unsafe medical claims
FR31: Epic 5 - enforce moderation standards that prohibit unverified treatment advice
FR32: Epic 5 - enforce moderation standards that prohibit dangerous ingredient or safety claims
FR33: Epic 1 - maintain public trust content without requiring user health-data collection
FR34: Epic 1 - support modern desktop and mobile browsers
FR35: Epic 1 - provide public routed pages without login for MVP content
FR36: Epic 1 - use the core public experience without realtime features
FR37: Epic 1 - provide a responsive experience for recipes, education, downloads, and safety resources
FR38: Epic 1 - provide a strong accessible public site with readable content structure
FR39: Epic 5 - support future member accounts without changing the public MVP experience
FR40: Epic 5 - support future user-only materials in a later phase
FR41: Epic 5 - support future trusted-member contribution workflows in a later phase
FR42: Epic 5 - preserve the no-health-tracking posture in MVP while allowing future private-feature decisions later
FR43: Epic 6 - present a substantial library of original recipes with original imagery and unique narrative
FR44: Epic 6 - present educational content with authorship, review dates, and cited sources
FR45: Epic 6 - exclude thin and utility pages from indexing while keeping high-value content crawlable
FR46: Epic 6 - present retained tool/interactive pages with substantial original explanatory content
FR47: Epic 6 - provide advertising, privacy, ownership, and editorial disclosures for publisher-network compliance
FR48: Epic 6 - expose structured data and complete sitemap/internal-linking for re-review discoverability

## Epic List

### Epic 1: Trusted Public Foundation and Discovery
Visitors can land on AlphaGalData, understand what the site offers, discover featured content, and navigate a fast, crawlable, accessible public experience that establishes trust from the first page.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR10, FR28, FR29, FR33, FR34, FR35, FR36, FR37, FR38

### Epic 2: Trusted Recipes and Save Flow
Visitors can open recipes, understand why they may be safe, review substitutions and warnings, save recipes confidently, and return to them later.
**FRs covered:** FR6, FR7, FR8, FR9

### Epic 3: Ingredient Checking and Label Guidance
Visitors can paste ingredients into a scanner, receive conservative risk guidance with clear next actions, and connect that guidance back to label-reading education and safer food decisions.
**FRs covered:** FR11, FR12, FR13, FR14, FR15

### Epic 4: Dining and Preparedness Resources
Visitors can quickly access dining-safe cards, downloadable resources, bracelet/tattoo guidance, testing guidance, and related preparedness content for real-world use.
**FRs covered:** FR16, FR17, FR18, FR19, FR20

### Epic 5: Safe Contributions, Moderation, and Future-Ready Trust Controls
Contributors can submit recipes or stories for review, moderators can safely manage publication decisions, and the platform preserves a trust-safe boundary for future member and community expansion.
**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR30, FR31, FR32, FR39, FR40, FR41, FR42

### Epic 6: AdSense Readiness and Content Value Uplift
Lift AlphaGalData above Google's minimum-content and webmaster-quality thresholds by deepening original recipe and educational content, removing thin utility pages from the search index, strengthening trust and authorship signals, and validating crawlability — so the site passes AdSense re-review and qualifies for the publisher network.
**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48

### Epic 7: Content Library Growth — Family Recipes and Safe Finds
Grow the trusted library from two directions: a repeatable pipeline that turns the owner's personal and family recipe sources into published, safety-framed site recipes, and a new "Safe Finds" content type for verified store-bought alpha-gal-safe products (starting with gelatin-free gummies from IKEA and Trader Joe's). Both feed the same discovery surfaces so recipes and safe products reinforce one library.
**FRs covered:** FR49, FR50, FR51, FR52

## Epic 1: Trusted Public Foundation and Discovery

Visitors can land on AlphaGalData, understand what the site offers, discover featured content, and navigate a fast, crawlable, accessible public experience that establishes trust from the first page.

### Story 1.1: Public Site Shell and Trust Navigation

As a visitor,
I want a clear public site shell with task-oriented navigation,
So that I can understand what AlphaGalData offers and move quickly to the right starting point.

**Acceptance Criteria:**

**Given** a visitor lands on any public AlphaGalData page
**When** the page loads
**Then** the visitor sees a consistent public site shell with global header, main content area, and footer
**And** the shell works without requiring login

**Given** a visitor views the global navigation
**When** they scan the available top-level actions
**Then** the primary navigation uses task-oriented labels aligned to the product UX
**And** it provides clear access to recipes, ingredient checking, learning content, and dining/preparedness resources

**Given** a visitor is on desktop or mobile
**When** they use the public navigation
**Then** the navigation remains usable and readable at supported breakpoints
**And** trust-critical destinations are reachable without deep or confusing menu paths

**Given** a visitor opens the site on a modern browser
**When** the public shell renders
**Then** the page structure is responsive, keyboard accessible, and built with semantic landmarks
**And** focus states and link labels are clear enough for public accessibility use

**Given** a visitor moves between public pages
**When** they navigate using header, footer, or internal links
**Then** the public shell preserves a consistent layout and orientation
**And** the user can understand where they are within the site

**Given** a visitor lands on a trust-sensitive public page
**When** the shell and surrounding UI are displayed
**Then** the product presents educational/public guidance framing consistently
**And** it does not imply diagnosis, treatment, or clinical authority

**Given** search engines or users access routed public pages
**When** the site shell is rendered in production
**Then** it supports crawlable routed pages with clean navigation links
**And** it does not depend on realtime features or login-gated rendering for core public access

**Given** the public shell is implemented
**When** performance is evaluated on high-value public pages
**Then** the shell adds minimal client-side overhead
**And** it does not materially compromise the MVP performance target for usable public pages

### Story 1.2: Homepage With Dual Entry Points

As a visitor,
I want a homepage that highlights trusted recipes and ingredient checking side by side,
So that I can immediately choose between finding food and checking safety.

**Acceptance Criteria:**

**Given** a visitor lands on the homepage
**When** the page loads
**Then** the homepage presents the product as a trusted safe-eating decision system rather than a generic recipe or blog landing page
**And** the primary message supports the `find -> understand safety -> save` journey

**Given** a visitor views the homepage hero area
**When** they scan the top section
**Then** they see two clear primary entry points: one for food or recipe discovery and one for ingredient checking
**And** neither path is visually buried or treated as secondary

**Given** a visitor chooses the recipe-discovery entry point
**When** they continue into the homepage content
**Then** they encounter featured recipe content that emphasizes comfort, safety context, and practical value
**And** the presentation supports quick movement into recipe detail pages

**Given** a visitor chooses the ingredient-checking entry point
**When** they continue from the homepage
**Then** they are routed toward the scanner experience through a clear, task-oriented call to action
**And** the language emphasizes conservative guidance rather than false certainty

**Given** a visitor scans the homepage navigation and supporting modules
**When** they look for other common starting points
**Then** they can also find learning content and dining/preparedness resources without confusion
**And** those paths remain clearly secondary to the two main homepage entry points

**Given** the homepage communicates trust-sensitive guidance
**When** the visitor reads supporting copy and section framing
**Then** the page uses calm, practical, educational language
**And** it avoids implying diagnosis, treatment, or guaranteed safety

**Given** the homepage is viewed on mobile or desktop
**When** the layout adapts across breakpoints
**Then** the dual-entry-point structure remains clear and usable
**And** trust-critical content is not pushed below ornamental or low-priority content

**Given** the homepage is implemented
**When** accessibility and performance are evaluated
**Then** the page remains keyboard accessible, readable, and crawlable
**And** it does not add avoidable client-side overhead that would compromise public-page performance targets

### Story 1.3: Discoverable Public Content and Topical Routing

As a visitor,
I want public routed pages for recipes, learning content, downloads, and caregiver guidance,
So that I can browse AlphaGalData through clear topical pathways and search-friendly URLs.

**Acceptance Criteria:**

**Given** a visitor navigates beyond the homepage
**When** they choose a primary content area
**Then** they can reach routed public pages for recipes, learning content, downloads/resources, and caregiver-relevant guidance
**And** each page type has a clear purpose within the overall site structure

**Given** a visitor browses public content categories
**When** they move between related public pages
**Then** the site provides clear internal linking between recipes, educational content, downloads, and safety resources
**And** those links support natural discovery without forcing the user back to the homepage

**Given** a visitor lands on a routed public page from search or a shared link
**When** the page loads
**Then** the page stands on its own with enough structure and context to be understandable as an entry point
**And** it provides clear paths to adjacent relevant content

**Given** recipe, education, download, and caregiver pages are implemented
**When** URLs are generated for those public routes
**Then** the URLs are clean, stable, and human-readable
**And** they support crawlability and long-term SEO use

**Given** a visitor uses the public site on modern desktop or mobile browsers
**When** they browse these routed pages
**Then** the layouts remain responsive and readable
**And** the content structure preserves trust-critical hierarchy across breakpoints

**Given** the routed public content is rendered for users and search engines
**When** metadata and page structure are evaluated
**Then** important pages support titles, metadata, and crawlable content output
**And** key public content is not hidden behind JavaScript-dependent rendering

**Given** caregiver-relevant guidance is part of the public experience
**When** a visitor looks for support-oriented content
**Then** they can find caregiver pathways without confusion
**And** those pathways remain integrated with the broader food, safety, and preparedness experience

**Given** this routed public content foundation is implemented
**When** accessibility is evaluated
**Then** pages use clear heading hierarchy, understandable links, and semantic structure
**And** they remain usable without requiring complex interactions

### Story 1.4: Trust and Safety Framing on Public Content

As a visitor,
I want the site to clearly explain its educational-only posture and trust-sensitive boundaries,
So that I understand how to use the guidance without mistaking it for medical advice.

**Acceptance Criteria:**

**Given** a visitor lands on a trust-sensitive public page
**When** they view recipe, scanner-adjacent, preparedness, testing, or medical-alert-related content
**Then** the page presents clear educational-only framing
**And** it does not imply diagnosis, treatment, or clinical authority

**Given** a visitor reads public safety guidance
**When** the product communicates food, ingredient, or preparedness recommendations
**Then** the language remains practical and conservative
**And** it avoids guaranteed safety claims or false certainty

**Given** a visitor encounters content about testing, bracelet guidance, tattoo guidance, or emergency-preparedness topics
**When** those sections are displayed
**Then** the page includes trust-sensitive explanatory framing appropriate to the topic
**And** it reinforces that AlphaGalData is a decision-support and education resource, not a diagnostic system

**Given** a visitor moves between public pages with different levels of sensitivity
**When** they encounter trust-critical content areas
**Then** educational-only disclaimers and trust framing appear consistently where needed
**And** they do not clutter low-risk content unnecessarily

**Given** a visitor encounters uncertain or cautionary safety guidance
**When** the page explains the recommendation
**Then** the content distinguishes clearly between what is known, what is uncertain, and what safer next step is recommended
**And** it preserves confidence without overstating evidence

**Given** public content is reviewed for moderation and editorial standards
**When** trust-sensitive content is published
**Then** it aligns with rules prohibiting unsafe medical claims, unverified treatment advice, and dangerous safety assertions
**And** those constraints are reflected in the published public framing

**Given** the trust-framing system is implemented
**When** users access the site from desktop or mobile
**Then** the educational-only posture remains readable, accessible, and appropriately placed in the content hierarchy
**And** it does not depend on modal-only or hidden interactions to be understood

**Given** search engines or first-time visitors encounter AlphaGalData as an entry point
**When** they land directly on a trust-sensitive public page
**Then** the page contains enough visible framing to prevent obvious misunderstanding of the site's role
**And** it still preserves the calm, non-alarmist tone defined by the UX direction

### Story 1.5: Featured Content Management for Public Discovery

As an editor,
I want to control which recipes and trust-critical resources are featured in public discovery surfaces,
So that the most useful and reliable content is easy for visitors to find.

**Acceptance Criteria:**

**Given** an authorized editor accesses the content management workflow for public discovery
**When** they review available recipes and eligible trust-critical resources
**Then** they can mark selected items for featured placement
**And** the workflow is protected from public or unauthorized access

**Given** an editor selects recipes or resources to feature
**When** those selections are saved
**Then** the chosen items are reflected on the appropriate public discovery surfaces
**And** non-featured items remain available through standard browsing paths

**Given** featured content appears on the homepage or other public entry surfaces
**When** a visitor loads those pages
**Then** featured recipes and resources are visually distinguishable from standard content
**And** they preserve the trust-first hierarchy defined in the UX direction

**Given** an editor updates the order or selection of featured items
**When** the changes are published
**Then** the public pages reflect the updated ordering without breaking routed content access
**And** the feature logic does not require manual code edits to change day-to-day priorities

**Given** a recipe or resource is not appropriate for featuring
**When** an editor removes it from featured placement
**Then** it no longer appears in featured surfaces
**And** the item remains accessible through its normal routed page unless explicitly unpublished elsewhere

**Given** editorial actions affect trust-sensitive public content discovery
**When** changes are made
**Then** the workflow preserves the product's publication safety rules
**And** it does not allow unreviewed or unsafe user-submitted content to become featured accidentally

**Given** featured discovery surfaces are evaluated for performance and accessibility
**When** featured content modules render on public pages
**Then** they remain crawlable, keyboard accessible, and readable across supported breakpoints
**And** they do not add unnecessary client-side overhead to high-value public pages

### Story 1.6: Responsive and Accessible Public Experience

As a visitor on desktop or mobile,
I want the public site to remain readable, navigable, and accessible,
So that I can use it reliably in everyday and high-stress situations.

**Acceptance Criteria:**

**Given** a visitor uses the site on mobile, tablet, or desktop
**When** they view public pages for discovery, recipes, learning content, downloads, or preparedness
**Then** layouts adapt responsively to the screen size
**And** trust-critical content remains visible and understandable without relying on desktop-only patterns

**Given** a visitor uses keyboard navigation
**When** they move through public navigation, links, buttons, forms, and downloads
**Then** all core public actions are reachable and operable without a mouse
**And** visible focus states clearly indicate current position

**Given** a visitor uses assistive technology or needs strong content structure
**When** public pages are rendered
**Then** pages use semantic landmarks, clear heading hierarchy, and understandable link and button labels
**And** trust-sensitive sections are announced in a meaningful reading order

**Given** a visitor encounters risk, caution, or informational states on public-facing components
**When** those states are displayed
**Then** meaning is not conveyed by color alone
**And** labels and explanatory text remain understandable for low-vision and color-blind users

**Given** a visitor uses the site on a mobile device under stress or time pressure
**When** they attempt to use primary public actions such as navigation, scanner entry, recipe viewing, or resource downloads
**Then** controls are touch-friendly and readable
**And** important actions maintain adequate target size and spacing

**Given** a visitor views long-form recipe or educational content
**When** they read across supported breakpoints
**Then** typography, spacing, and reading widths preserve readability
**And** the content does not collapse into dense or confusing layouts

**Given** a visitor arrives on a high-value public page
**When** the page loads under normal conditions
**Then** responsive and accessibility enhancements do not introduce avoidable client-side overhead
**And** the page still supports the public performance target for usable content

**Given** the public experience is tested before release
**When** responsive and accessibility checks are performed
**Then** the site is verified across modern desktop and mobile browsers
**And** core public flows remain usable without complex interactions or hidden hover-only meaning

## Epic 2: Trusted Recipes and Save Flow

Visitors can open recipes, understand why they may be safe, review substitutions and warnings, save recipes confidently, and return to them later.

### Story 2.1: Recipe Detail Pages With Safety Context

As a visitor,
I want to view a recipe page that combines ingredients, instructions, and alpha-gal safety context,
So that I can decide whether the recipe is worth considering before I save it.

**Acceptance Criteria:**

**Given** a visitor opens a recipe detail page
**When** the page loads
**Then** the page presents the recipe title, core description, ingredient list, and preparation instructions
**And** it includes visible alpha-gal safety context as part of the page rather than treating safety as a hidden secondary detail

**Given** a visitor scans the recipe detail page
**When** they review the content structure
**Then** ingredients, safety notes, substitutions, and instructions are organized in a clear reading hierarchy
**And** trust-critical information appears before or alongside save-oriented actions

**Given** a recipe has important substitutions or warnings
**When** the page is rendered
**Then** those substitutions or warnings are visible in context with the recipe
**And** they do not require the user to leave the page to understand the basic safety framing

**Given** a visitor reaches the recipe page from homepage discovery, internal links, or search
**When** the page is used as a landing page
**Then** it stands on its own with enough context to be understandable as an entry point
**And** it provides clear paths to related recipes, scanner help, or supporting education where relevant

**Given** the recipe detail page is displayed on desktop or mobile
**When** the layout adapts across breakpoints
**Then** the page remains readable and structured
**And** trust-critical content is not pushed below ornamental or low-priority content

**Given** the recipe page is rendered for public users and search engines
**When** SEO and crawlability are evaluated
**Then** the page supports clean routed URLs, crawlable output, and page metadata
**And** the core recipe and safety content is not hidden behind JavaScript-only rendering

**Given** the recipe detail experience is evaluated for accessibility
**When** users navigate headings, lists, links, and actions
**Then** the page uses semantic structure and understandable labels
**And** the reading flow remains usable with keyboard and assistive technologies

### Story 2.2: Recipe Safety Notes and Trust Explanation

As a visitor,
I want recipe safety notes that explain why a recipe may be safer, where caution applies, and what substitutions or warnings matter,
So that I can make an informed food decision without guessing.

**Acceptance Criteria:**

**Given** a visitor views a recipe with trust-sensitive guidance
**When** they review the recipe page
**Then** the page includes a dedicated safety-note treatment rather than burying safety details in generic body copy
**And** the treatment is visually and structurally distinct from standard recipe instructions

**Given** a recipe includes safety reasoning
**When** the visitor reads the safety-note section
**Then** the content explains why the recipe may be safer in alpha-gal terms
**And** it distinguishes ingredients, substitutions, caution points, or uncertainty in plain language

**Given** a recipe includes cautionary or uncertain guidance
**When** that guidance is displayed
**Then** the page clearly communicates what is known, what may vary by person, and what safer next step is recommended
**And** it avoids false certainty or oversimplified universal safety claims

**Given** a recipe contains relevant substitution guidance
**When** a visitor reviews safety notes
**Then** substitutions are connected directly to the safety explanation
**And** the user can understand how substitutions affect the trustworthiness of the recipe

**Given** a recipe has multiple levels of detail
**When** the visitor wants either a quick read or deeper understanding
**Then** the page supports an immediately visible safety summary with an option for expanded detail where appropriate
**And** the user does not need to leave the recipe flow to understand the core safety logic

**Given** risk or caution language appears within recipe safety notes
**When** status labels or cues are shown
**Then** they use the product's standardized trust vocabulary and next-action framing
**And** the meaning does not rely on color alone

**Given** a visitor uses the recipe page on desktop or mobile
**When** the safety-note treatment is rendered
**Then** it remains readable, accessible, and positioned near the decision moment
**And** it does not get pushed behind low-priority content or hover-only interactions

**Given** the recipe safety-note system is implemented
**When** content is reviewed for trust and moderation posture
**Then** the guidance aligns with the site's educational-only standards
**And** it does not introduce unsafe medical claims, unverified treatment advice, or dangerous ingredient assertions

### Story 2.3: Save Recipe Interaction and Persistence

As a visitor,
I want to save and unsave recipes through a low-friction interaction,
So that I can keep track of recipes I trust and want to return to later.

**Acceptance Criteria:**

**Given** a visitor is viewing a recipe card or recipe detail page with sufficient visible safety context
**When** they activate the save action
**Then** the recipe is stored in the recipe-save system
**And** the interface confirms the saved state clearly

**Given** a visitor has already saved a recipe
**When** they view that recipe again
**Then** the UI reflects that the recipe is already saved
**And** the save control uses a distinct saved state rather than appearing identical to unsaved items

**Given** a visitor chooses to remove a saved recipe
**When** they activate the unsave action
**Then** the recipe is removed from their saved-recipe state
**And** the interface updates to reflect that the item is no longer saved

**Given** a save or unsave action is in progress
**When** the visitor triggers the action
**Then** the UI communicates an in-progress state
**And** it prevents confusing duplicate submissions while the request is being handled

**Given** a save or unsave request fails
**When** the action cannot be completed
**Then** the UI presents a clear failure state with recovery guidance
**And** it does not falsely report success

**Given** the save interaction is used across recipe cards and recipe detail pages
**When** save state is rendered in different contexts
**Then** the product uses a consistent save-state model and messaging
**And** it does not require duplicated business logic in page components

**Given** recipe save functionality stores operational user state
**When** the backend persists the action
**Then** it avoids collecting or storing health-tracking data
**And** it stores only the minimum state required to support saved recipes

**Given** save interactions are evaluated on desktop and mobile
**When** users access the save action from supported browsers
**Then** the control remains accessible, touch-friendly, and keyboard operable
**And** saved, saving, unsaved, and failed states are understandable without color alone

### Story 2.4: Return to Saved Recipes

As a visitor,
I want to revisit recipes I have saved,
So that I can quickly return to food choices I already trust.

**Acceptance Criteria:**

**Given** a visitor has previously saved one or more recipes
**When** they access the saved-recipes experience or equivalent return path
**Then** they can view a list of their saved recipes
**And** each saved item links back to its recipe detail page

**Given** a visitor views their saved recipes
**When** the list is rendered
**Then** each item provides enough identifying information to recognize the recipe
**And** the saved state remains consistent with the main recipe experience

**Given** a visitor has no saved recipes yet
**When** they access the saved-recipes experience
**Then** the product shows an empty state with a clear next step
**And** it routes the user back toward recipe discovery rather than presenting a dead end

**Given** a visitor removes a recipe from saved state
**When** they return to the saved-recipes experience
**Then** the removed recipe no longer appears in the list
**And** the saved-recipes view reflects current backend state accurately

**Given** a visitor opens a saved recipe from the saved-recipes experience
**When** the recipe detail page loads
**Then** the page preserves the saved-state indicator
**And** the user can continue from recipe review into action without losing context

**Given** the saved-recipes experience is used on desktop or mobile
**When** it is rendered across supported breakpoints
**Then** it remains readable, responsive, and accessible
**And** it does not depend on complex interactions to revisit saved items

**Given** the saved-recipes experience is implemented
**When** it is evaluated for architecture and privacy posture
**Then** it relies only on minimal recipe-save operational data
**And** it does not expand into personal health tracking or unrelated profile storage

## Epic 3: Ingredient Checking and Label Guidance

Visitors can paste ingredients into a scanner, receive conservative risk guidance with clear next actions, and connect that guidance back to label-reading education and safer food decisions.

### Story 3.1: Ingredient Scanner Input and Submission

As a visitor,
I want to paste or enter an ingredient list into a scanner,
So that I can get conservative guidance about whether the ingredients may be risky for alpha-gal.

**Acceptance Criteria:**

**Given** a visitor navigates to the scanner experience
**When** the scanner page loads
**Then** they can access a clearly labeled input area for ingredient-list entry
**And** the page explains that the tool provides conservative educational guidance rather than diagnosis

**Given** a visitor has an ingredient list from packaging or another source
**When** they paste or type the list into the scanner input
**Then** the input accepts freeform ingredient text in a practical paste-first format
**And** the user can review or edit the text before submission

**Given** a visitor is ready to check ingredients
**When** they submit the scanner input
**Then** the request is sent through the backend classification flow
**And** the interface shows a clear in-progress state while evaluation is happening

**Given** a visitor submits empty, malformed, or unusable scanner input
**When** validation runs
**Then** the page presents a clear, corrective error message
**And** the user can recover without losing the rest of the scanner context

**Given** a visitor uses the scanner on desktop or mobile
**When** they interact with the input and submit controls
**Then** the scanner remains touch-friendly, keyboard accessible, and readable
**And** the core interaction does not depend on complex or hidden UI behavior

**Given** the scanner page is part of the public MVP
**When** it is accessed without login
**Then** the experience works as a public tool within the routed site structure
**And** it does not require realtime infrastructure or account setup

**Given** the scanner input experience is evaluated for performance and architecture alignment
**When** the page is rendered and submitted
**Then** it uses shared frontend service wrappers and backend validation boundaries
**And** it does not embed trust-critical classification logic directly in Gatsby page components

### Story 3.2: Ingredient Classification and Risk Results

As a visitor,
I want structured ingredient classification results with clear risk labels and next actions,
So that I can understand what the scanner thinks and what I should do next.

**Acceptance Criteria:**

**Given** a visitor submits a valid ingredient list
**When** the backend classification flow completes successfully
**Then** the scanner returns structured results for the submitted ingredients
**And** the results are rendered through a consistent result-state UI rather than raw text output

**Given** classified results are displayed
**When** the visitor reviews the outcome
**Then** each ingredient or grouped result uses the product's canonical trust vocabulary: `known_risk`, `caution`, or `unknown`
**And** each result is paired with the appropriate next action

**Given** a result is classified as `known_risk`
**When** the result is shown to the visitor
**Then** it is paired with the next action `avoid`
**And** the UI explains why the ingredient was flagged

**Given** a result is classified as `caution`
**When** the result is shown to the visitor
**Then** it is paired with the next action `verify_before_using`
**And** the UI explains why caution applies without overstating certainty

**Given** a result is classified as `unknown`
**When** the result is shown to the visitor
**Then** it is paired with the next action `research_before_buying`
**And** the UI makes clear that uncertainty is a designed outcome rather than a silent failure

**Given** a visitor reviews scanner results
**When** they need more than the status label alone
**Then** the result UI provides explanation and context for the classification
**And** the meaning does not rely on color alone

**Given** scanner results are shown on desktop or mobile
**When** the result list and status cards render
**Then** they remain readable, accessible, and logically grouped
**And** they preserve the same trust meaning across breakpoints

**Given** the scanner result contract is implemented
**When** frontend and backend integration are reviewed
**Then** the frontend renders backend-provided risk tiers and next actions directly
**And** it does not invent separate client-side classification rules

### Story 3.3: Unknown Ingredient and Caution Handling

As a visitor,
I want clear explanation and safer next-step guidance when ingredients are ambiguous, cautionary, or not confidently classified,
So that I am not misled into treating uncertainty as safety.

**Acceptance Criteria:**

**Given** a submitted ingredient cannot be confidently classified
**When** the scanner returns the result
**Then** the product explicitly marks it as `unknown` rather than leaving it unclassified or silently omitted
**And** it pairs that result with `research_before_buying`

**Given** a submitted ingredient falls into a cautionary category rather than a confirmed higher-risk category
**When** the scanner displays the result
**Then** the product marks it as `caution`
**And** it pairs that result with `verify_before_using`

**Given** a visitor reviews an `unknown` or `caution` result
**When** they expand or inspect the explanation
**Then** the product explains what is known, what remains uncertain, and why the classification is conservative
**And** it avoids language that implies universal safety or diagnosis

**Given** a result is supported by editorial caution or mixed evidence rather than stronger public-health support
**When** the source explanation is shown
**Then** the UI distinguishes source posture clearly
**And** it helps the visitor understand why the tool is being cautious

**Given** a visitor encounters ambiguous or partially parsed ingredient output
**When** the result list is rendered
**Then** the scanner preserves those ambiguous cases as visible decision points
**And** it does not flatten them into false "safe" interpretations

**Given** the user needs a safer next step after an `unknown` or `caution` result
**When** the result is presented
**Then** the scanner provides a practical next action such as reviewing source details, checking related education, or returning to safer alternatives
**And** the flow does not end in a dead stop

**Given** unknown and caution handling are evaluated for trust and accessibility
**When** those states appear on desktop or mobile
**Then** they remain readable, color-independent, and positioned clearly in the result flow
**And** they preserve confidence without minimizing uncertainty

**Given** the scanner handles uncertain results in production
**When** backend and frontend behavior are reviewed
**Then** `unknown` remains a normal designed outcome rather than a server error
**And** technical failures are kept distinct from trust-status outcomes

### Story 3.4: Label-Reading and Cross-Contamination Guidance

As a visitor,
I want scanner outcomes to connect me to label-reading and cross-contamination guidance,
So that I can make better real-world food decisions beyond a single ingredient check.

**Acceptance Criteria:**

**Given** a visitor receives scanner results
**When** they need more context than the classification alone
**Then** the scanner provides clear paths to supporting guidance about label reading, suspicious ingredients, and cross-contamination
**And** those paths remain connected to the result the visitor is currently reviewing

**Given** a visitor encounters an ingredient pattern that suggests caution or hidden risk
**When** related guidance is shown
**Then** the product explains relevant label-reading concepts in practical language
**And** it helps the user understand what to watch for in real packaging or dining contexts

**Given** a visitor needs guidance beyond ingredient names alone
**When** they review supporting education
**Then** the product includes cross-contamination and dining-context considerations where relevant
**And** it keeps that guidance aligned with the site's educational-only posture

**Given** a visitor moves from scanner output into educational content
**When** they follow related links or next actions
**Then** the experience feels like one connected decision-support system
**And** the visitor can move back to recipes, scanner use, or preparedness resources without losing orientation

**Given** supporting label-reading and contamination guidance is rendered on desktop or mobile
**When** the visitor reads or navigates it
**Then** the content remains readable, accessible, and internally linked
**And** it does not require complex interactions to understand the next step

**Given** scanner-linked education is reviewed for consistency
**When** trust language and navigation are evaluated
**Then** the guidance uses the same risk vocabulary and next-action framing as the rest of the product
**And** it does not introduce conflicting terminology or separate trust models

## Epic 4: Dining and Preparedness Resources

Visitors can quickly access dining-safe cards, downloadable resources, bracelet/tattoo guidance, testing guidance, and related preparedness content for real-world use.

### Story 4.1: Dining-Safe Cards and Resource Download Access

As a visitor,
I want to find, preview, and download dining-safe cards and related practical resources quickly,
So that I can use them in real-world eating situations without extra friction.

**Acceptance Criteria:**

**Given** a visitor navigates to dining or resource-related public pages
**When** those pages load
**Then** dining-safe cards and related practical resources are clearly presented as downloadable tools
**And** the purpose of each resource is explained in plain language

**Given** a visitor is deciding whether a resource is useful
**When** they review a dining-safe card or similar asset
**Then** the page provides enough preview or description to understand when and how to use it
**And** the user does not need to download blindly to know its purpose

**Given** a visitor wants to use a dining-safe card
**When** they activate the download or print path
**Then** the resource is available through a clear public action
**And** the action is labeled in a way that identifies the asset and its intended use

**Given** a visitor accesses resource downloads on desktop or mobile
**When** they interact with download controls and surrounding copy
**Then** the experience remains readable, responsive, and accessible
**And** high-stress utility actions are not buried under decorative or low-priority content

**Given** public dining resources are delivered through the site architecture
**When** assets are served in production
**Then** they are available through stable public delivery paths
**And** the resource system does not require realtime features or user login for MVP use

**Given** dining-card and resource pages are reviewed for trust posture
**When** public framing and explanatory copy are evaluated
**Then** the content remains educational and practical
**And** it avoids implying clinical authority or guaranteed safety outcomes

**Given** the resource experience is reviewed for performance and crawlability
**When** public pages and downloadable assets are evaluated
**Then** the surrounding content remains crawlable and lightweight
**And** the availability of downloadable resources does not degrade high-value public page performance unnecessarily

### Story 4.2: Medical Alert and Preparedness Guidance

As a visitor,
I want to access bracelet, wallet-card, and emergency-preparedness guidance,
So that I can prepare for treatment or emergency situations with clearer practical support.

**Acceptance Criteria:**

**Given** a visitor navigates to medical-alert or preparedness guidance
**When** the page loads
**Then** they can access public guidance about bracelet use, wallet/emergency cards, and preparedness considerations
**And** the content is clearly framed as educational support rather than medical instruction

**Given** a visitor is considering a bracelet or emergency card
**When** they review the preparedness content
**Then** the page explains the practical purpose of each resource
**And** it helps the visitor understand when each option may be useful

**Given** a visitor needs emergency-preparedness support under stress
**When** they scan the page for next actions
**Then** the most important actions and resources are easy to find quickly
**And** the experience does not bury them beneath low-priority content

**Given** a visitor reviews medical-alert guidance
**When** the page discusses wording, usage, or preparedness considerations
**Then** the content remains conservative and trust-sensitive
**And** it does not imply diagnosis, treatment authority, or guaranteed protection

**Given** preparedness guidance includes downloadable or reusable resources
**When** those resources are presented
**Then** they are linked clearly from the preparedness flow
**And** the visitor can move between explanatory content and practical tools without losing context

**Given** the preparedness guidance is used on desktop or mobile
**When** the visitor reads or navigates the content
**Then** the page remains readable, responsive, and accessible
**And** key preparedness actions remain touch-friendly and keyboard operable

**Given** the preparedness experience is reviewed for consistency
**When** trust language and educational framing are evaluated
**Then** it aligns with the same public-safety posture used across recipes, scanner results, and downloads
**And** it does not introduce conflicting guidance models or unsafe claims

### Story 4.3: Tattoo and Testing Guidance Pages

As a visitor,
I want to access tattoo-related caution guidance and testing guidance with clear educational boundaries,
So that I can understand these topics without mistaking the site for a diagnostic or treatment authority.

**Acceptance Criteria:**

**Given** a visitor navigates to tattoo-related guidance
**When** the page loads
**Then** the page presents non-clinical caution guidance relevant to tattoos and alpha-gal awareness
**And** it clearly frames the content as educational rather than medical instruction

**Given** a visitor navigates to testing guidance
**When** the page loads
**Then** the page explains testing-related information in an educational context
**And** it includes external next-step direction where appropriate without acting as a diagnostic system

**Given** a visitor reads tattoo or testing guidance
**When** the content discusses risk, uncertainty, or decision points
**Then** the guidance distinguishes what is known, what is uncertain, and what safer next step may be appropriate
**And** it avoids false certainty, unsafe claims, or implied clinical authority

**Given** a visitor needs to continue beyond AlphaGalData's educational scope
**When** the page references next steps
**Then** it points clearly toward clinician discussion or external trusted resources where appropriate
**And** it does not position the site as the final authority for diagnosis or treatment decisions

**Given** tattoo and testing guidance are part of the public site
**When** they are rendered on desktop or mobile
**Then** the content remains readable, responsive, and accessible
**And** trust-critical framing remains visible without requiring hidden interactions

**Given** these pages are reviewed for editorial and moderation standards
**When** public guidance is published
**Then** it complies with the site's rules against unsafe medical claims, unverified treatment advice, and dangerous safety assertions
**And** the tone remains calm, practical, and consistent with the rest of the product

### Story 4.4: Preparedness Resource Surfacing Across the Site

As a visitor,
I want preparedness and dining resources to be easy to reach from relevant places across the site,
So that I can find them quickly without deep hunting when I need them.

**Acceptance Criteria:**

**Given** a visitor is on the homepage, a recipe page, scanner-related content, or other relevant public entry points
**When** preparedness or dining resources are contextually relevant
**Then** the site surfaces clear links or modules to those resources
**And** the user does not need to navigate through deep menu paths to find them

**Given** a visitor is exploring food-oriented content
**When** the product presents secondary next steps
**Then** dining cards and preparedness tools are available as practical follow-on actions
**And** they are presented without displacing the primary content of the page

**Given** a visitor is using the site in a high-anxiety or time-sensitive situation
**When** they scan the navigation or page-level utility areas
**Then** preparedness-related entry points remain easy to spot
**And** the interface prioritizes clarity over decorative complexity

**Given** preparedness resources are surfaced from multiple public contexts
**When** those links or modules are rendered
**Then** they use consistent labeling and trust framing across the site
**And** they do not create conflicting navigation patterns

**Given** a visitor follows a preparedness-related entry point from another public page
**When** they arrive at the destination resource
**Then** the transition feels connected to the broader site journey
**And** the user can navigate back into recipes, scanner use, or educational content without losing orientation

**Given** cross-site resource surfacing is evaluated for responsive and accessible behavior
**When** links or modules appear across desktop and mobile experiences
**Then** they remain readable, keyboard accessible, and touch-friendly
**And** they do not depend on hover-only behavior or hidden affordances

## Epic 5: Safe Contributions, Moderation, and Future-Ready Trust Controls

Contributors can submit recipes or stories for review, moderators can safely manage publication decisions, and the platform preserves a trust-safe boundary for future member and community expansion.

### Story 5.1: Public Submission Intake for Recipes and Stories

As a contributor,
I want to submit a recipe or story for review,
So that I can share useful experience without publishing directly to the public site.

**Acceptance Criteria:**

**Given** a contributor accesses a public submission flow
**When** they choose to submit a recipe or story
**Then** the site provides a clear submission form for the selected content type
**And** the form explains that submissions are reviewed before any public release

**Given** a contributor fills out a recipe or story submission
**When** they provide the required information and submit it
**Then** the submission is stored in the moderation intake system
**And** it is not published publicly by default

**Given** a contributor is completing a submission form
**When** they review the form guidance
**Then** the form clearly communicates standards against unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions
**And** it sets accurate expectations for moderated review

**Given** a contributor submits incomplete or invalid content
**When** validation runs
**Then** the form presents clear corrective errors
**And** the user can fix issues without losing the rest of their submission context

**Given** a contributor uses the submission flow on desktop or mobile
**When** they interact with fields, labels, and actions
**Then** the submission experience remains readable, accessible, and responsive
**And** it supports visible labels and low-friction form completion

**Given** a public submission is received
**When** backend processing occurs
**Then** the content enters a protected moderation queue
**And** the public site remains unchanged until a moderator takes explicit action

### Story 5.2: Protected Moderation Review Workflow

As a moderator,
I want to review, approve, reject, or request revision on submitted content through a protected workflow,
So that only trustworthy content becomes eligible for public visibility.

**Acceptance Criteria:**

**Given** an authorized moderator accesses the moderation workflow
**When** they view the moderation interface
**Then** they can see submitted recipes and stories awaiting review
**And** the workflow is protected from public or unauthorized access

**Given** a moderator opens a submission for review
**When** they inspect the submitted content
**Then** they can review the submission details in a form that supports safety, clarity, and editorial judgment
**And** the content is presented without implying that approval is automatic

**Given** a moderator completes review of a submission
**When** they choose an action
**Then** they can approve, reject, or request revision
**And** the chosen action is recorded as the current moderation status

**Given** a moderator requests revision
**When** that decision is recorded
**Then** the submission remains out of public view
**And** its status clearly distinguishes revision-needed content from approved content

**Given** a moderator reviews trust-sensitive content
**When** they evaluate the submission
**Then** the workflow supports enforcement against unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions
**And** those checks are part of the moderation decision path

**Given** moderation actions affect publication safety
**When** a moderator saves a decision
**Then** the result is enforced through backend-controlled moderation state
**And** the public site does not rely on frontend-only enforcement for publication boundaries

**Given** a moderator uses the review workflow on supported devices
**When** they access or navigate the moderation interface
**Then** the experience remains usable and clear
**And** key moderation actions are accessible only to authorized operators

### Story 5.3: Publication Safety Enforcement and Editorial Notes

As a moderator,
I want the system to prevent unreviewed or unsafe content from becoming public and to support internal moderation notes,
So that trust decisions are recorded clearly and publication mistakes are avoided.

**Acceptance Criteria:**

**Given** a submission exists in the moderation system
**When** it has not been explicitly approved
**Then** it cannot appear on public pages, featured content areas, or public resource listings
**And** publication eligibility is enforced by backend-controlled state

**Given** a moderator is reviewing a submission
**When** they need to capture editorial reasoning or safety concerns
**Then** they can record internal moderation notes on the submission
**And** those notes are not exposed on the public site

**Given** a moderator records internal notes while reviewing content
**When** the notes are saved
**Then** they remain associated with the submission's moderation record
**And** they support later follow-up, revision review, or auditability

**Given** a submission contains unsafe medical claims, unverified treatment advice, or dangerous ingredient or safety assertions
**When** a moderator evaluates it
**Then** the system supports rejecting or withholding publication for that content
**And** the trust rules remain enforceable as part of moderation state

**Given** a submission is approved
**When** it becomes eligible for later public use
**Then** approval status is clearly distinguishable from pending, rejected, or revision-needed states
**And** the approval does not bypass normal content placement or editorial surfacing rules automatically

**Given** the moderation record is used in protected workflows
**When** moderators or editors access it
**Then** they can see moderation status and internal notes together
**And** unauthorized public users cannot access that internal information

**Given** publication safety enforcement is reviewed architecturally
**When** backend and frontend responsibilities are evaluated
**Then** moderation status, notes, and publication rules are enforced server-side
**And** the implementation does not rely on hidden client-side checks to protect public trust

### Story 5.4: Editorial Updates for Trusted Public Content and Resources

As an editor,
I want to update trusted public content, featured materials, and downloadable resources through controlled editorial paths,
So that AlphaGalData stays current and useful without compromising trust.

**Acceptance Criteria:**

**Given** an authorized editor accesses an editorial workflow
**When** they manage trusted public pages, featured content, or downloadable resources
**Then** they can update those assets through a controlled path
**And** the workflow is protected from public or unauthorized access

**Given** an editor updates public educational content or resource metadata
**When** the changes are saved and published
**Then** the public site reflects the updated content
**And** the change does not bypass trust, moderation, or publication safety boundaries

**Given** an editor manages downloadable resources or high-value public materials
**When** they replace, update, or reorder those assets
**Then** the updated resources remain available through stable public paths
**And** the editorial workflow does not require direct code changes for normal content maintenance

**Given** editorial updates affect trust-sensitive public information
**When** the content is reviewed or published
**Then** the workflow preserves the site's educational-only posture
**And** it does not allow unsafe claims or conflicting trust language to be introduced casually

**Given** featured content and resource maintenance are part of ongoing operations
**When** editors return to the workflow over time
**Then** the system supports consistent day-to-day curation of trusted public surfaces
**And** it remains aligned with the moderation and publication model already established

**Given** editorial workflows are evaluated for access control and architecture alignment
**When** permissions and system boundaries are reviewed
**Then** editing capabilities remain restricted to authorized operators
**And** public-facing pages do not expose editorial controls or internal state

### Story 5.5: Future-Ready Community and Account Boundaries

As a product owner,
I want the MVP architecture and workflows to preserve clean boundaries for future accounts, private materials, and trusted-member contribution features,
So that AlphaGalData can expand later without undermining current trust and privacy constraints.

**Acceptance Criteria:**

**Given** the MVP is implemented without public member accounts
**When** public features such as recipes, scanner use, downloads, and preparedness resources are delivered
**Then** they work without requiring user login
**And** the MVP public experience remains independent from future account systems

**Given** the platform stores operational data for current features
**When** data boundaries are reviewed
**Then** the implementation preserves the no-health-tracking posture in MVP
**And** it does not quietly expand into private health-record behavior

**Given** future member accounts, user-only materials, or trusted-member contribution workflows are considered
**When** the current system boundaries are evaluated
**Then** the architecture leaves room for those features later
**And** it does not require rewriting the public MVP content experience to support them

**Given** future private or member-only features are introduced in later phases
**When** they are planned against the MVP baseline
**Then** they can be added through explicit new protected flows and contracts
**And** they do not weaken moderation, publication safety, or trust-language consistency in the existing public site

**Given** the current MVP includes contributor submission and moderation features
**When** the implementation is reviewed
**Then** contributor workflows remain clearly distinct from any future trusted-member or account-based privileges
**And** the public MVP does not imply broader community publishing rights than actually exist

**Given** future-readiness is evaluated in architecture and implementation planning
**When** epic and story coverage are reviewed
**Then** forward-compatible boundaries for accounts and private materials are documented
**And** they remain explicitly deferred rather than partially implemented in ambiguous ways

<!-- End story repeat -->

## Epic 6: AdSense Readiness and Content Value Uplift

AlphaGalData was rejected from the Google publisher network for "Low value content" against the minimum content requirements and webmaster thin-content guidelines. The site is trustworthy but small: only a handful of recipes, a modest set of educational articles, and several functional/utility pages that are indexed despite carrying little readable content. This epic lifts the site above the minimum-content and quality thresholds by deepening original recipe and educational content, removing thin and utility pages from the search index, strengthening authorship and trust signals on health-sensitive content, ensuring advertising and privacy disclosures are compliant, and validating crawlability and structured data — culminating in a clean re-review submission to AdSense.

### Story 6.1: Original Recipe Library Depth

As the site owner,
I want a substantial library of original, alpha-gal-safe recipes with original imagery and unique narrative,
So that the site clearly exceeds the minimum-content threshold and demonstrates added value rather than thin or templated pages.

**Acceptance Criteria:**

**Given** the public recipe collection is reviewed for AdSense readiness
**When** the published recipes are counted
**Then** the collection contains a substantial set of original recipes (target of at least 25 published recipes)
**And** each recipe is a genuinely distinct dish rather than a near-duplicate variation of another entry

**Given** a visitor opens any published recipe detail page
**When** the page renders
**Then** the recipe includes an original narrative introduction with practical, personal, or alpha-gal-specific context beyond a bare ingredient/instruction list
**And** it includes at least one original image of the prepared dish rather than stock or placeholder imagery

**Given** a search engine or quality reviewer evaluates recipe pages as a group
**When** content originality is assessed
**Then** the recipe titles, descriptions, narrative, and safety context are unique per recipe and not produced from an identical filled-in template
**And** each recipe carries the structured safety frontmatter (safety summary, safety notes, substitutions, caution points) already established for the recipe content type

**Given** the expanded recipe set is published
**When** internal navigation and discovery are checked
**Then** every recipe is reachable from the recipes index and topical navigation with no orphaned pages
**And** the additional recipes do not regress public-page performance targets

### Story 6.2: Educational E-E-A-T and Sourcing

As the site owner,
I want every educational article to show authorship, review dates, and cited sources,
So that health-sensitive content demonstrates experience, expertise, authoritativeness, and trust to both readers and the publisher-network reviewer.

**Acceptance Criteria:**

**Given** a visitor opens any Learn/educational article
**When** the page renders
**Then** the article displays a visible author or reviewer byline and a "published" and/or "last reviewed/updated" date
**And** the framing remains educational and non-diagnostic consistent with existing trust-sensitive content rules

**Given** an article makes a medical, testing, or safety claim
**When** the supporting content is reviewed
**Then** the claim is supported by at least one cited, reputable external source that is linked or clearly referenced
**And** sources are presented consistently across educational articles

**Given** the thinnest educational articles are reviewed against the minimum-content guideline
**When** their depth is assessed
**Then** previously thin articles are expanded with substantive original explanation rather than padded filler
**And** each educational page provides clear added value over generic search results on the same topic

**Given** the educational content set is published
**When** trust framing is evaluated sitewide
**Then** the medical/educational disclaimer remains present and appropriately placed on health-sensitive pages
**And** authorship and review metadata are applied uniformly across the educational section

### Story 6.3: Index Hygiene for Thin and Utility Pages

As the site owner,
I want thin, functional, and utility pages excluded from search indexing,
So that the site's indexed footprint reflects only high-value content and is not dragged down by pages with little readable text.

**Acceptance Criteria:**

**Given** the set of functional and utility pages (such as the scanner, heat map, testing, saved recipes, recommended, cards, and downloads pages) and legal/utility pages
**When** their indexing status is configured
**Then** pages that carry little original readable content emit a `noindex` directive
**And** genuinely high-value content pages (recipes, educational articles, key landing pages) remain indexable

**Given** the robots and sitemap configuration is reviewed
**When** crawler directives are generated for production
**Then** the robots policy and generated sitemap are consistent with the per-page indexing decisions
**And** `noindex` pages are excluded from the sitemap rather than listed as canonical indexable URLs

**Given** a crawler fetches the site after the change
**When** indexable pages are enumerated
**Then** the indexable set is dominated by substantial original content rather than thin or functional pages
**And** no high-value page is unintentionally excluded from indexing

**Given** the indexing decisions are implemented
**When** a per-page audit is run
**Then** each public route has an explicit, intentional index/noindex decision recorded
**And** the decision can be verified from the rendered page metadata

### Story 6.4: Original Editorial Value on Retained Tool Pages

As the site owner,
I want any tool or interactive page that remains indexable to be surrounded by substantial original content,
So that retained functional pages stand on their own as valuable rather than reading as thin utilities.

**Acceptance Criteria:**

**Given** a decision is made to keep a tool or interactive page (such as the heat map or scanner) indexable
**When** that page is reviewed for content value
**Then** the page includes substantial original explanatory content describing what it shows, how to use it, and its alpha-gal relevance
**And** the original content is sufficient for the page to be judged valuable independent of the interactive feature

**Given** a retained tool page is published
**When** internal linking is reviewed
**Then** the page links to and from related high-value content (recipes, educational articles, resources)
**And** it is not an indexed dead-end with no surrounding context

**Given** a tool page cannot be given enough original value to justify indexing
**When** the indexing decision is revisited
**Then** the page is instead marked `noindex` under Story 6.3 rather than left thin and indexable
**And** the rationale is consistent with the overall index-hygiene approach

### Story 6.5: AdSense Trust and Compliance Pages

As the site owner,
I want compliant advertising, privacy, ownership, and editorial disclosure pages,
So that the site satisfies advertising-network publisher policy requirements for transparency and contactability.

**Acceptance Criteria:**

**Given** the privacy policy is reviewed against advertising-network requirements
**When** its content is assessed
**Then** it discloses the use of advertising and cookies, including third-party/personalized advertising and how users are affected
**And** the disclosure language is accurate to how the site actually serves ads

**Given** a visitor or reviewer looks for site ownership and accountability
**When** they view the About and disclosure/editorial pages
**Then** the site presents clear ownership/identity information and a working contact path
**And** an editorial or content-standards statement explains how content is produced and reviewed

**Given** the compliance pages are published
**When** they are checked for reachability
**Then** privacy, about/contact, and editorial/disclosure pages are linked from a consistent sitewide location such as the footer
**And** they are reachable without login on modern desktop and mobile browsers

**Given** advertising disclosures are present
**When** trust framing is evaluated
**Then** the advertising and cookie disclosures do not contradict the site's no-health-tracking posture
**And** the disclosures remain consistent with the educational, non-diagnostic positioning

### Story 6.6: Crawlability, Structured Data, and Resubmission

As the site owner,
I want valid structured data, complete crawlability, and a verified ownership state before resubmitting,
So that the AdSense re-review evaluates a discoverable, machine-readable, high-value site and approves it.

**Acceptance Criteria:**

**Given** recipe pages are published
**When** structured data is generated
**Then** recipe pages expose valid `schema.org` Recipe JSON-LD reflecting their actual content
**And** the structured data passes structured-data validation without blocking errors

**Given** the site is prepared for re-review
**When** crawlability is audited
**Then** the sitemap is complete and accurate for all indexable high-value pages with no orphaned high-value content
**And** internal linking connects recipes, educational content, and resources into clear topical pathways

**Given** AdSense requires verified site ownership
**When** the resubmission is prepared
**Then** site ownership is verified through the required mechanism (such as the ads.txt entry and/or account verification)
**And** the verification state is confirmed before requesting review

**Given** all prior Epic 6 stories are complete
**When** the site is submitted for AdSense re-review
**Then** the indexed footprint, content depth, authorship, disclosures, and structured data collectively satisfy the minimum-content and webmaster quality guidelines
**And** the review request is submitted from a state where the previously cited "Low value content" violation has been demonstrably addressed

<!-- End story repeat -->

## Epic 7: Content Library Growth — Family Recipes and Safe Finds

The site's recipe collection is still small and grows only when the owner hand-builds each entry. At the same time, some of the most useful day-to-day wins for an alpha-gal household are not recipes at all — they are specific store-bought products that happen to be safe when the label checks out, like the gelatin-free gummies found at IKEA and Trader Joe's. This epic grows the trusted library from both directions: a repeatable intake pipeline that turns the owner's and his wife's personal recipe sources (handwritten cards, photos, dictated steps) into published, safety-framed site recipes, and a new lightweight "Safe Finds" content type that lets visitors browse verified safe store-bought treats and products with the brand, where to buy, why-it-may-be-safe reasoning, and label caveats. Both content types share the same discovery and cross-linking so the library reads as one trusted resource rather than two silos. This directly reinforces Epic 6's original-content depth goal without depending on the AdSense timeline.

### Story 7.1: Family Recipe Extraction Pipeline

As the site owner,
I want a repeatable way to turn my and my wife's personal recipe sources into published site recipes,
So that the collection grows steadily from trusted family cooking without re-inventing the format each time.

**Acceptance Criteria:**

**Given** a raw recipe source exists (handwritten notes, a photo, or dictated instructions) placed in a staging folder such as `content/recipes/<name>/`
**When** the recipe is prepared for publication
**Then** it is converted into a single MDX file under `content/recipes/` following the established naming (`YYYY-MM-DD-slug.mdx`) and slug convention (`/recipes/<slug>`)
**And** it carries the full recipe frontmatter contract already in use (title, slug, date, description, servings, prep_time, cook_time, image, cms_id, safety_summary, safety_notes, substitutions, caution_points, ingredients, steps)

**Given** a family recipe includes original photos of the finished dish
**When** the recipe is published
**Then** the images are placed in `static/uploads/` with descriptive slugged filenames and referenced from the recipe's `image` field
**And** the published recipe renders on the recipe detail template without layout or missing-image errors

**Given** a family recipe is drafted from a personal source
**When** its alpha-gal safety framing is written
**Then** every packaged or ambiguous ingredient has an explicit safety note or caution point (for example, plant butter verified as dairy-free), and any naturally-safe primary ingredient (such as fish or poultry) is briefly explained
**And** the narrative and safety context are original to that dish rather than a filled-in generic template

**Given** a backlog of pending family recipe sources
**When** intake is tracked
**Then** there is a lightweight, visible backlog (a checklist or notes file) listing candidate recipes and their extraction status
**And** completed recipes are reachable from the recipes index with no orphaned pages

### Story 7.2: Safe Finds Content Type and Listing

As a visitor with alpha-gal,
I want to browse verified store-bought products that are safe when the label checks out,
So that I can find ready-made safe treats without needing to cook, starting with things like gelatin-free gummies.

**Acceptance Criteria:**

**Given** the site needs to represent store-bought products distinctly from cook-at-home recipes
**When** the Safe Finds content type is defined
**Then** a content model exists with fields for product name, brand, store/where-to-buy, category (such as "gummies & candy"), a why-it-may-be-safe summary, label caveats to re-verify, an optional image, and the standard date/slug/cms_id metadata
**And** the model reuses the existing trust/safety framing patterns (summary + caution points) rather than inventing a new visual language

**Given** Safe Finds content exists
**When** a visitor navigates to the Safe Finds listing page (such as `/safe-finds`)
**Then** the page lists all published Safe Finds as cards showing name, brand, store, and category, and links to each detail view
**And** the page carries the same educational, non-diagnostic trust framing used on recipes ("verify the exact package in hand; formulas change")

**Given** a visitor opens a single Safe Find
**When** the detail view renders
**Then** it shows the brand, where to buy, the why-it-may-be-safe reasoning, and the specific label caveats to re-check before purchase
**And** it makes clear the product is a personal find that must be re-verified, not a guarantee or medical/dietary endorsement

**Given** the Safe Finds pages are published
**When** their indexing and value are assessed against Epic 6's rules
**Then** each Safe Find and the listing carry enough original content to be genuinely valuable (consistent with FR46), with an intentional index/noindex decision recorded
**And** the listing does not regress public-page performance targets

### Story 7.3: Seed Safe Finds With Gelatin-Free Gummies

As the site owner,
I want the Safe Finds collection to launch with real, verified entries,
So that the feature is immediately useful instead of an empty shell.

**Acceptance Criteria:**

**Given** the Safe Finds content type from Story 7.2 exists
**When** the collection is seeded
**Then** it includes at least the known gelatin-free gummy finds from IKEA and Trader Joe's as distinct entries with accurate brand, store, and category values
**And** each entry states why it may be alpha-gal-safe (gelatin-free, no mammal-derived ingredients when the label is confirmed) and the specific caveats to re-verify (gelatin, carmine/other animal-derived additives, formula changes by region or date)

**Given** a seeded Safe Find has a product photo available
**When** the entry is published
**Then** the image is placed in `static/uploads/` and referenced, and the entry renders cleanly on the listing and detail views
**And** entries without a photo still render correctly with a sensible fallback

**Given** the seeded entries make safety claims about specific products
**When** their framing is reviewed against the site's moderation and trust standards
**Then** no entry asserts a guaranteed-safe or medical claim, and each defers final judgment to the reader verifying the current label
**And** the language is consistent with the disclaimers used across recipes and educational content

### Story 7.4: Unified Discovery Across Recipes and Safe Finds

As a visitor,
I want recipes and Safe Finds to be discoverable together,
So that the site reads as one trusted library rather than two disconnected sections.

**Acceptance Criteria:**

**Given** both recipes and Safe Finds are published
**When** the site's primary navigation and relevant landing pages are reviewed
**Then** Safe Finds is reachable from sitewide navigation and/or the recipes and homepage discovery surfaces
**And** the entry points use language that distinguishes "make it" (recipes) from "buy it" (Safe Finds)

**Given** a visitor is on a recipe or a Safe Find detail page
**When** related-content and next-step links are shown
**Then** the cross-linking can surface the other content type where relevant (for example, a dessert recipe linking to safe store-bought treats)
**And** no discovery path leads to an orphaned or dead-end page

**Given** the combined library is published
**When** crawlability and internal linking are audited (consistent with FR48/FR52)
**Then** recipes and Safe Finds are both represented in the sitemap and internal-linking graph according to their index decisions
**And** the two content types reinforce the same topical pathways rather than competing silos

<!-- End story repeat -->
