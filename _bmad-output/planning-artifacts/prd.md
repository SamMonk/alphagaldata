---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-e-01-discovery
  - step-e-02-review
  - step-e-03-edit
inputDocuments:
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/project-context.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/index.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/project-overview.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/architecture.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/component-inventory.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/api-contracts.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/data-models.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/development-guide.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/deployment-guide.md
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/research/market-alpha-gal-content-monetization-community-research-2026-08-21.md
workflowType: 'prd'
workflow: 'edit'
lastEdited: '2026-08-21'
editHistory:
  - date: '2026-08-21'
    changes: 'Added AdSense readiness, content operations, community activation, monetization strategy, privacy safeguards, and measurable KPIs.'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 8
classification:
  projectType: web_app
  domain: healthcare
  complexity: high
  projectContext: brownfield
  classificationNotes:
    - Trusted patient-facing education and community resource hub
    - Editorially curated first, community-contributed second
    - Moderated user registration, stories, and recipe submissions
    - Health-adjacent content and audit requirements increase product risk
  visionInputs:
    - Feature family-created recipes as flagship content
    - Teach label reading and cross-contamination avoidance from lived experience
    - Help users emulate enjoyable safe food without triggering alpha-gal reactions
    - Improve education and curate trustworthy community resources
    - Provide user-only material and encourage registered submissions
    - Audit all submitted stories and recipes before publication
  visionSummary:
    - Help people get directly tested for alpha-gal sooner and track it over time
    - Use lived experience to teach safer food choices, label reading, and contamination avoidance
    - Extend guidance into EMS-informed medical safety, including bracelets and warning tattoos
    - Build a moderated community knowledge base of stories, recipes, and practical lessons
---

# Product Requirements Document - alphagaldata

**Author:** Monk
**Date:** 2026-04-16

## Executive Summary

AlphaGalData is a brownfield healthcare web application that will evolve from a static educational site into a trusted, moderated alpha-gal resource hub built around practical safety, lived experience, and community contribution. The product serves patients, caregivers, and supporters who need faster access to testing guidance, safer food and label-reading practices, better awareness of medical-treatment risks, and a trustworthy source of community knowledge that is reviewed before publication.

The core problem is not just lack of information. People with alpha-gal often spend too long figuring out how to get properly tested, how to monitor the condition over time, how to identify hidden ingredient and cross-contamination risks, and how to avoid preventable harm in medical settings. Generic allergy content and unmoderated community spaces do not reliably solve these problems. AlphaGalData will address this gap by combining curated education, featured family-created recipes, practical safety guidance, member-only resources, and audited user submissions into a single product experience.

The product vision is to help users move from confusion and repeated avoidable mistakes to informed, safer daily living. That includes helping people find direct testing pathways, track their testing history annually, learn how to recreate enjoyable food safely, understand hidden treatment and emergency risks, and contribute their own experiences in a moderated environment that protects community trust.

AlphaGalData will grow through a trust-first content and community flywheel: original recipes and practical education attract high-intent visitors, useful tools and resources create repeat usage, moderated contributions add lived experience, and owned audience channels support sustainable growth. Monetization is a later layer that may include AdSense, disclosed affiliates, digital convenience products, paid meal plans, aligned sponsorships, and membership. Public safety-critical education remains available without payment, and commercial relationships must not control safety classification or editorial decisions.

### What Makes This Special

AlphaGalData is differentiated by the combination of lived experience and operational safety guidance. It is not positioned as a generic medical content site. It brings together your family's real-world recipe and label-reading experience, practical guidance on avoiding cross-contamination, and EMS-informed awareness of medical risks such as unsafe treatments, alert bracelets, and warning tattoos.

The product's core insight is that alpha-gal users need more than diagnosis content. They need a trusted system for ongoing living: testing, tracking, eating, emergency preparation, and learning from others who have already discovered hidden risks the hard way. Community contribution is part of the value, but trust depends on editorial review and audit of all user-submitted stories and recipes before they become public resources.

Users should choose AlphaGalData because it offers practical, experience-tested, safety-oriented guidance that is both curated and community-informed. The intended differentiation moment is when a user realizes the product helps them avoid real harm, not just consume general information.

## Project Classification

- **Project Type:** Web application
- **Domain:** Healthcare / patient education / moderated community resource
- **Complexity:** High
- **Project Context:** Brownfield

## Success Criteria

### User Success

Users can reliably do three high-value things in the initial product:
- Save and use trusted recipes that help them eat enjoyable food without triggering alpha-gal risks.
- Learn practical label-reading habits that reduce mistakes around hidden ingredients and cross-contamination.
- Access clear guidance on medical alert bracelets and warning tattoos, including safety considerations before using either.

A successful user experience means a newly diagnosed or struggling user can quickly find practical guidance that reduces uncertainty and helps them act more safely in everyday life.

### Business Success

In the near term, success is demonstrated by repeat usage, original content depth, and evidence that users find the resources valuable enough to return.
- The site reaches at least 25 genuinely distinct, original published recipes before AdSense resubmission, with original imagery, narrative context, safety metadata, and internal links.
- The editorial operation publishes at least four original high-value content items per month while the recipe library is below 25 items, then maintains a sustainable cadence agreed by the operators.
- Repeat visits, recipe saves, downloads, and email subscriptions increase month over month from an instrumented baseline.
- The site establishes an owned audience channel for useful updates rather than relying only on search or social platforms.

At a 12-month horizon, success means AlphaGalData is a dependable resource hub with recurring engagement around recipes, safety education, curated community knowledge, and validated revenue experiments.
- AdSense readiness criteria are met and a resubmission is made only after content, policy, crawlability, and disclosure checks pass.
- At least one non-AdSense monetization experiment is validated or deliberately rejected using conversion, revenue, maintenance-cost, and trust-impact evidence.
- Community contributions operate through a documented moderation process with no unreviewed public publication.

### Technical Success

The initial product must meet a strict trust threshold:
- All community submissions are moderated before publication.
- No public user-generated story or recipe is published without audit/review.
- Core educational pages, recipes, downloads, and safety resources are stable and easy to access.
- The publishing workflow supports curated content without weakening trust or editorial control.

### Measurable Outcomes

For the MVP and first growth phase, the measurable outcomes are:
- At least 25 original recipes published before AdSense resubmission, with 100% carrying the established safety frontmatter and an original image or documented image fallback.
- At least 90% of indexable educational and recipe pages carry an author or reviewer, publication or review date, and appropriate source or editorial context.
- 100% of public routes have an intentional index/noindex decision, and noindex routes are absent from the production sitemap.
- 100% of user submissions are approved before public publication, with moderation decisions and internal notes retained.
- Monthly reporting includes organic impressions and clicks, high-value landing pages, recipe saves, downloads, email subscriptions, repeat visitors, submissions, moderation time, and revenue by channel.
- Monetization experiments do not gate essential safety education and include a recorded trust and disclosure review before launch.

## Product Scope

### MVP - Minimum Viable Product

The first meaningful release should include:
- Featured trusted recipes as flagship content.
- Strong education around label reading and cross-contamination avoidance.
- Bracelet and tattoo guidance, including safety and decision-making context.
- Product/resource downloads that support practical use.
- Moderation-only submission handling, with no direct public publishing by users.

### Growth Features (Post-MVP)

These can come after the core trusted experience is working:
- Member accounts
- User-only materials
- Expanded community contribution workflows
- More structured submission management for stories and recipes

### Vision (Future)

Longer term, the product can expand into a more complete moderated community platform:
- Registered users contributing stories and recipes
- Trusted user-only resource areas
- Stronger ongoing engagement loops around shared experience
- Potential tracking features for testing history and long-term condition management

### Growth, Content, Community, and Monetization Principles

- Content growth precedes monetization: build original, useful, maintained content before increasing paid promotion.
- Community activation begins with moderated submissions, email, structured prompts, and curated highlights before open comments or a full social network.
- Safe Finds and product recommendations must show why an item may be useful, what to re-check, who reviewed it, and when it was last reviewed.
- Paid products sell convenience, organization, or depth; basic safety-critical education and emergency resources remain publicly accessible.
- Affiliate, sponsor, and paid-placement relationships are disclosed near the relevant content and never determine safety classification.
- Health data is not collected for advertising personalization, and audience measurement excludes unnecessary health information.

## User Journeys

### Journey 1: Primary User - Success Path
**Persona:** Long-time alpha-gal patient struggling with food choices

We meet a user who is not new to alpha-gal, but still feels limited, frustrated, and unsafe around food. They already know the diagnosis, but daily life is still hard. They are tired of bland substitutions, uncertain label choices, and repeated mistakes with ingredients that seem safe until they are not.

They arrive at AlphaGalData looking for something better than generic allergy advice. They find featured recipes first, and that becomes the entry point into trust. The recipes do not just list ingredients. They explain why ingredients are safe, what substitutions actually work, and what label-reading habits help avoid hidden mammal-derived risks and cross-contamination.

As they move through the recipe and education experience, their emotional state shifts from discouraged and skeptical to relieved and hopeful. The climax of the journey is when they realize they can still make food that tastes good without gambling on ingredients or relying on vague online advice. The resolution is practical confidence: they save recipes, return for more guidance, and begin treating AlphaGalData as a dependable part of day-to-day life.

**Capabilities revealed by this journey:**
- Featured recipe discovery
- Recipe saving/bookmarking
- Recipe detail pages with safety notes and substitutions
- Label-reading education tied directly to food use cases
- Clear cross-contamination guidance embedded in content

### Journey 2: Primary User - Edge Case
**Persona:** Long-time patient who suddenly realizes they may still be missing major safety gaps

We meet a user who thought they understood alpha-gal well enough, but keeps encountering confusing setbacks. They may be reacting to ingredients they did not suspect, getting inconsistent guidance, or realizing they have not thought seriously about medical-treatment risks.

They do not start with recipes alone. Instead, they land on educational content about label reading, unsafe ingredients, or medical-alert planning. They begin connecting dots between food choices, hidden ingredient exposure, and broader safety habits they may have overlooked for years.

The emotional arc here is more serious. They move from false confidence or quiet anxiety into a clearer understanding of where risk still exists. The climax is the moment they realize AlphaGalData is not only about recipes, but about avoiding harm in both kitchen and medical contexts. The resolution is a stronger personal safety plan: they use the site to revisit their label-reading habits, download practical resources, and consider bracelet or tattoo guidance with more care.

**Capabilities revealed by this journey:**
- Educational hubs for label reading and contamination avoidance
- Downloadable safety resources
- Medical alert bracelet and tattoo guidance
- Cross-linking between recipes, safety education, and emergency-preparedness content

### Journey 3: Secondary User
**Persona:** Caregiver trying to support someone with alpha-gal safely

We meet a caregiver who is shopping, cooking, or helping manage daily routines for someone with alpha-gal. They are motivated, but afraid of getting it wrong. They may not have the patient's lived experience and do not fully trust their own decisions around ingredients, preparation, or emergency communication.

They come to AlphaGalData needing quick, usable guidance. Featured recipes help them understand what safe meal preparation looks like in practice. Label-reading education helps them make better store decisions. Medical-alert guidance helps them understand how to support safer care conversations and preparedness.

The emotional arc moves from fear of making a harmful mistake to feeling informed and capable. The climax is when the caregiver realizes the site explains not just what to avoid, but how to live safely and helpfully around the condition. The resolution is that the caregiver becomes more confident in supporting meals, purchases, and practical safety decisions.

**Capabilities revealed by this journey:**
- Caregiver-friendly educational language
- Clear recipe safety framing
- Downloadable and shareable safety materials
- Easy navigation from diagnosis/safety topics into everyday food guidance

### Journey 4: Admin / Moderator Journey
**Persona:** You and your wife acting as initial trusted moderators

We meet the moderators as protectors of community trust, not just content publishers. In the MVP, all submitted stories and recipes must be reviewed by the two of you until a small circle of trusted members exists. Your job is not only to approve content, but to prevent unsafe or misleading material from becoming part of the public knowledge base.

A submission comes in from a community member. You review it for clarity, safety, ingredient accuracy, medical-risk implications, and whether it matches the standards of the site. Some content may be useful but require edits. Some may be emotionally compelling but operationally unsafe. The core tension in the journey is balancing encouragement of community contribution with strict editorial responsibility.

The climax is the moderation decision: approve, revise, or reject. The resolution is a public site that stays trustworthy because published material reflects both lived experience and editorial scrutiny, rather than raw unreviewed user content.

**Capabilities revealed by this journey:**
- Submission intake workflow
- Review queue for recipes and stories
- Approve / reject / request-revision workflow
- Internal moderation notes
- Editorial standards and audit trail

### Journey 5: Support / Operations Journey
**Persona:** Site operator maintaining trust through fresh featured content and resources

We meet the operator responsible for keeping AlphaGalData useful over time. This includes updating featured recipes, refreshing downloads, improving education pages, and making sure safety guidance stays current and visible.

The pain point here is drift: content can become stale, buried, or inconsistent. The operator needs a simple way to update high-value pages and keep the most important safety and food content easy to find. The success moment is when the site continues to feel active, curated, and trustworthy rather than abandoned or static.

**Capabilities revealed by this journey:**
- Featured-content management
- Easy editorial updates for recipes and learning resources
- Resource/download maintenance
- Structured content prioritization on the homepage and key landing pages

### Journey 6: Newly Diagnosed / Search-First Navigator
**Persona:** Newly diagnosed person or caregiver arriving from a search engine

We meet a visitor who is overwhelmed and looking for a trustworthy starting point. They may be searching for what alpha-gal is, what foods to avoid, how to read labels, or what to ask a clinician. They need clear orientation before they can confidently use recipes or tools.

The visitor moves from a search result into a clearly labeled start-here path, then into educational pages, practical recipes, and downloadable safety resources. The success moment is finding an understandable next step without being pushed toward a product or an unsupported medical claim. They may subscribe to useful email updates so the site can remain a dependable guide during the first months after diagnosis.

**Capabilities revealed by this journey:**
- Search-intent landing pages with clear next steps
- Start-here navigation connecting education, recipes, tools, and resources
- Author, reviewer, date, and source context on trust-sensitive pages
- Optional email subscription with clear consent and unsubscribe controls

### Journey 7: Contributor and Owned-Audience Participant
**Persona:** Community member who wants to share a recipe, story, or Safe Find

We meet a visitor who has found a useful family recipe, product, or lived-experience lesson and wants to help others. They need to understand that contributions are reviewed before publication and should be able to see whether a submission is received, needs revision, approved, or declined.

The contributor gives consent for attribution and optional editorial highlighting. The site uses the contribution to strengthen the public library, a curated email, or a seasonal feature without turning unreviewed submissions into public advice. The success moment is participation that feels recognized and safe, while moderators retain responsibility for accuracy, disclosures, and risk-sensitive wording.

**Capabilities revealed by this journey:**
- Recipe, story, and Safe Find submission intake
- Submission status and revision feedback
- Consent and attribution preferences
- Curated community highlights in public content and email

### Journey Requirements Summary

These journeys reveal the need for:
- A strong featured-recipe experience as the primary trust-building path
- Tight integration between recipes, label-reading education, and cross-contamination guidance
- Medical-alert resource content that extends beyond food into safer treatment awareness
- Caregiver-friendly navigation and explanations
- Moderated submission workflows with strict review before publication
- Editorial tools for maintaining featured content, downloads, and high-trust resources over time
- Search-first start-here paths with source, reviewer, and freshness context
- Optional email updates and curated community highlights
- Safe Find review, disclosure, and re-check workflows

## Domain-Specific Requirements

### Compliance & Regulatory

- AlphaGalData must be positioned as educational content only and must not present itself as medical advice, diagnosis, or treatment guidance.
- The product must use clear disclaimers anywhere users could mistake content for clinical direction, especially around testing, food safety, emergency preparedness, bracelets, tattoos, and treatment-risk awareness.
- The product must avoid claims that imply clinical authority, guaranteed safety, or verified medical outcomes.
- Moderation standards must explicitly prohibit unsafe medical claims, unverified treatment advice, and dangerous ingredient or safety assertions.

### Advertising, Commercial Independence, and Privacy

- Advertising, affiliate relationships, sponsorships, and paid placements must be disclosed clearly near the relevant content or recommendation.
- Commercial relationships must not determine safety classifications, editorial conclusions, search visibility, or moderation decisions.
- AlphaGalData must not collect or use health data for personalized advertising or commercial audience targeting.
- Email subscriptions must use clear consent, preference controls, and a straightforward unsubscribe path.
- Essential safety education and emergency-preparedness resources must remain accessible without a purchase or membership.

### Editorial Operations and Content Freshness

- Public recipes, educational pages, and Safe Finds should identify an author or owner, reviewer where appropriate, publication or update date, and relevant sources or caveats.
- Editors must be able to mark content for review, update, correction, or retirement when guidance or product information changes.
- User submissions and Safe Finds must pass editorial review before public publication, including checks for safety wording, attribution, conflicts, and commercial disclosures.
- Product recommendations must communicate that labels and formulations can change and must not be presented as permanent guarantees.

### Technical Constraints

- The MVP must avoid collecting or storing user health-tracking data such as test results, reaction history, or other personal health records.
- Content architecture must support strong editorial control so that trust-critical pages, featured recipes, downloads, and safety resources remain curated and stable.
- Moderation controls must ensure no user submission is published publicly without review and approval.
- The platform should maintain a clear separation between public educational content and any future member-only or community contribution features to avoid accidental publication or policy drift.

### Integration Requirements

- Testing guidance may link users to external testing resources or clinician-oriented next steps, but AlphaGalData should not act as a diagnostic system.
- Any future submission workflows must route into a moderation queue before public release.
- Future expansion into accounts or private features must preserve the no-health-tracking posture unless privacy and trust requirements are deliberately revisited.

### Risk Mitigations

- **Risk: users treat content as medical advice**
  - Mitigation: clear disclaimers, careful wording, and links encouraging clinician involvement for diagnosis or treatment decisions.
- **Risk: unsafe community content erodes trust or causes harm**
  - Mitigation: mandatory moderation, approval workflow, rejection/revision path, and no direct publishing.
- **Risk: users infer product endorsement of unsafe claims**
  - Mitigation: editorial standards that prohibit unsafe claims and require conservative review for testing, ingredients, emergency care, and warning-tattoo guidance.
- **Risk: future features unintentionally create health-data liability**
  - Mitigation: explicitly avoid user health tracking in MVP and treat any future tracking as a separate scoped decision with higher privacy review.

## Web Application Specific Requirements

### Project-Type Overview

AlphaGalData should remain a traditional routed content site rather than shifting into an app-like logged-in experience in the MVP. The product should prioritize discoverable, structured pages that are easy to index, easy to navigate, and easy to maintain editorially. Interactive features should support the content experience, not replace it.

### Technical Architecture Considerations

The technical architecture should continue to favor static or pre-rendered page delivery with selective client-side interactivity where it adds clear value. This supports the current Gatsby-based structure and aligns with the product's trust, SEO, and maintainability goals.

The product should avoid introducing real-time infrastructure for MVP. No chat, live notifications, or live moderation workflows are required. Moderation and editorial workflows can remain asynchronous and review-driven.

Browser support should target modern desktop and mobile browsers. The MVP does not need to optimize for legacy browser behavior beyond graceful degradation for standard content access.

### Browser Matrix

The MVP should support modern versions of:
- Chrome
- Safari
- Firefox
- Edge
- modern mobile browsers on iPhone and Android

The experience should remain readable and navigable even if advanced interactive features have limited functionality in edge environments.

### Responsive Design

The product must work well on both desktop and mobile, with special care for:
- recipe reading and saving flows
- educational content readability
- downloads and printable-resource access
- bracelet and tattoo guidance pages
- navigation between safety, food, and caregiver-focused content

### Performance Targets

Because SEO is critical, page performance must support fast discovery and low-friction use:
- primary content pages should load quickly on mobile and desktop
- featured content, educational pages, and downloads pages should avoid unnecessary client-side overhead
- interactive features should be limited to places where they create clear user value

### SEO Strategy

SEO is a core requirement for MVP, not a secondary optimization. The product should be structured to capture search traffic around:
- alpha-gal testing information
- safe recipes
- label-reading guidance
- cross-contamination avoidance
- medical alert bracelets and tattoo guidance
- caregiver and practical living resources

This requires:
- indexable routed pages
- strong metadata and page titles
- structured internal linking between recipes, educational content, and safety resources
- content organized into clear topical clusters
- technically clean crawlable output
- intentional route-level index/noindex controls, with noindex routes excluded from the sitemap
- accurate Recipe and Safe Find structured data where applicable
- crawl and coverage checks before any AdSense resubmission

### Accessibility Considerations

The MVP should be a good accessible public site. That means:
- readable typography and contrast
- keyboard-accessible navigation and core actions
- meaningful heading structure on educational and recipe pages
- understandable link labels and download actions
- content and page structure that remain usable without relying on complex interaction patterns

### Implementation Considerations

The implementation should continue to build on the current brownfield architecture instead of forcing a platform reset. The right posture for MVP is:
- content-first
- SEO-first
- moderation-first
- accessibility-conscious
- selectively interactive where justified
- instrumented for content discovery, saves, downloads, email subscriptions, submissions, and disclosed commercial conversions
- designed so analytics and advertising systems do not receive unnecessary health information

That keeps the product aligned with its real value proposition: trusted public education and practical guidance, not heavy application behavior.

## Project Scoping & Phased Development

### Phased Product Strategy

**Phase 1 — Foundation and AdSense Readiness:**
- Build the original recipe and education library, including at least 25 distinct recipes before AdSense resubmission.
- Establish author/reviewer/date/source context, trust pages, privacy and commercial disclosures, structured data, sitemap consistency, and analytics baselines.
- Keep the scanner and other retained utility pages useful, clearly scoped, and indexable only when they provide sufficient original explanatory context.

**Phase 2 — Content Growth and Owned Audience:**
- Maintain a repeatable editorial cadence with at least four original high-value content items per month while the library is below 25 recipes.
- Add family recipes, Safe Finds, seasonal content, caregiver guides, and optional email updates.
- Use search performance, saves, downloads, repeat visits, and email engagement to prioritize the next content.

**Phase 3 — Moderated Community Pilot:**
- Invite limited recipe, story, and Safe Find submissions through a review queue operated by you and your wife.
- Provide submission status, revision requests, consent and attribution controls, and curated community highlights.
- Do not launch open comments, real-time chat, or a full social network until moderation volume and safety quality are proven.

**Phase 4 — Trust-Gated Monetization:**
- Pursue AdSense only after content depth, crawlability, policy pages, disclosures, and editorial quality checks pass.
- Test disclosed affiliate links and aligned sponsorships only where they fit the editorial mission and do not influence safety decisions.
- Validate digital recipe bundles, meal-planning products, memberships, or other paid convenience products using conversion, revenue, maintenance, and trust evidence.

**Resource Requirements:** Small editorial/operator team led by you and your wife, with manual review and content operations at launch. Monetization and community scope must remain below the team’s ability to review, update, and disclose responsibly.

### Risk Mitigation Strategy

**Technical Risks:**  
The main technical challenge is keeping original content, utility tools, email, analytics, and staged monetization in a clean SEO-friendly architecture. Mitigation: build on the existing brownfield Gatsby structure, use explicit index/noindex controls, avoid real-time features, and keep moderation/manual workflows simple at first.

**Market Risks:**  
The riskiest assumptions are whether original content earns repeat use, whether a moderated community adds value, and whether visitors trust relevant commercial offers. Mitigation: establish baseline metrics, validate the recipe/content flywheel first, pilot contributions in a bounded queue, and reject monetization experiments that reduce trust or create insufficient value.

**Resource Risks:**  
If resources are tighter than planned, open community features and paid products should be cut before safety education, recipe quality, freshness, and disclosure work. Manual review must remain within capacity, and monetization must wait until the trust gate is satisfied.

## Functional Requirements

### Content Discovery & Navigation

- FR1: Visitors can browse featured recipes from public routed pages.
- FR2: Visitors can discover educational content related to label reading, cross-contamination, testing, and safe eating.
- FR3: Visitors can navigate between recipes, educational content, downloads, and safety resources through clear internal linking.
- FR4: Visitors can access caregiver-relevant guidance from the public site.
- FR5: Visitors can find public content through search-engine-indexable pages and structured topical navigation.

### Recipe Experience

- FR6: Visitors can view recipe detail pages with ingredients, instructions, and alpha-gal safety context.
- FR7: Visitors can view recipe-specific safety notes and substitution guidance.
- FR8: Visitors can save recipes for later use.
- FR9: Visitors can return to previously saved recipes.
- FR10: Editors can feature selected recipes more prominently than standard content.

### Ingredient Safety & Label Reading

- FR11: Visitors can use an ingredient scanner to evaluate food or ingredient-list safety.
- FR12: Visitors can manually enter or paste ingredient text for safety review.
- FR13: Visitors can receive educational guidance about suspicious or unsafe ingredient patterns.
- FR14: Visitors can access label-reading education outside the scanner workflow.
- FR15: Visitors can access cross-contamination avoidance guidance tied to food and dining contexts.

### Safe Eating Resources

- FR16: Visitors can access dining-safe cards and related downloadable resources.
- FR17: Visitors can download practical resources for dining and safety use.
- FR18: Visitors can access bracelet guidance for medical-alert preparedness.
- FR19: Visitors can access tattoo guidance that includes safety considerations and non-clinical risk awareness.
- FR20: Visitors can access testing guidance and external next-step resources without AlphaGalData acting as a diagnostic tool.

### Moderation & Editorial Control

- FR21: Community contributors can submit stories or recipes for review.
- FR22: Moderators can review submitted stories before publication.
- FR23: Moderators can review submitted recipes before publication.
- FR24: Moderators can approve, reject, or request revision on submitted content.
- FR25: Moderators can record internal review notes about submitted content.
- FR26: The product can prevent unreviewed submissions from being published publicly.
- FR27: Editors can update public educational content, featured content, and downloadable resources.

### Trust, Safety, and Content Governance

- FR28: The product can display educational-only disclaimers on trust-sensitive content areas.
- FR29: The product can distinguish public educational guidance from medical advice or diagnosis.
- FR30: The product can enforce moderation standards that prohibit unsafe medical claims.
- FR31: The product can enforce moderation standards that prohibit unverified treatment advice.
- FR32: The product can enforce moderation standards that prohibit dangerous ingredient or safety claims.
- FR33: Editors can maintain public trust content without requiring user health-data collection.

### Public Web Experience

- FR34: Visitors can use the site from modern desktop and mobile browsers.
- FR35: Visitors can access the public site through routed pages without requiring login for MVP content.
- FR36: Visitors can use the core public experience without real-time features such as chat or live notifications.
- FR37: Visitors can use a responsive experience for recipes, education, downloads, and safety resources.
- FR38: Visitors can access a public site experience designed for strong accessibility and readable content structure.

### Future-Ready Account & Community Expansion

- FR39: The product can support future member accounts without changing the public MVP experience.
- FR40: The product can support future user-only materials in a later phase.
- FR41: The product can support future trusted-member contribution workflows in a later phase.
- FR42: The product can preserve the no-health-tracking posture in MVP while allowing future product decisions to revisit private features separately.

### AdSense Readiness and Original Content

- FR43: The product can present at least 25 distinct original recipes with meaningful instructions, safety context, and appropriate imagery before an AdSense resubmission is initiated.
- FR44: Indexable educational and recipe pages can expose an author or owner, reviewer where appropriate, publication or review date, and relevant source context.
- FR45: Editors can assign an intentional index or noindex state to every public route, and noindex routes are omitted from the sitemap.
- FR46: Retained utility pages can include original explanatory content and internal links, or be marked noindex when they do not provide sufficient standalone value.
- FR47: Visitors can access trust and compliance pages covering about/contact information, privacy, educational disclaimers, editorial standards, advertising or affiliate disclosures, and cookie practices where applicable.
- FR48: Indexable recipe and Safe Find pages expose accurate structured data and remain crawlable without requiring search engines to execute essential client-side behavior.

### Content Library and Safe Finds

- FR49: Site operators can intake family recipes from notes, photos, or dictation into the standard reviewed recipe format.
- FR50: Editors can create Safe Find entries with product, brand, store or category, why the item may be useful, caveats, reviewer, and review date.
- FR51: Visitors can browse Safe Finds and see current-label, formulation-change, and non-guarantee caveats.
- FR52: Visitors can discover recipes and Safe Finds through shared navigation, topical hubs, search landing pages, and contextual internal links.

### Audience, Community, and Monetization Operations

- FR53: Editors can maintain an editorial backlog with content type, owner, status, publish date, review date, and cadence target.
- FR54: Visitors can opt into email updates with explicit consent, preference controls, and a working unsubscribe mechanism.
- FR55: The site can show affiliate, sponsor, advertising, and paid-placement disclosures near relevant content or recommendations.
- FR56: The site can offer optional paid convenience products without gating safety-critical education, emergency resources, or core public guidance.
- FR57: Editors can record review, update, correction, and expiry status for product recommendations and Safe Finds.
- FR58: The site can measure content, community, email, and monetization events without using health data for advertising targeting.
- FR59: Contributors can view submission status and choose whether approved content may use their attribution or be included in a curated highlight.

## Non-Functional Requirements

### Performance

- At least 95% of public recipe, education, and safety-resource page navigations should expose usable primary content within 2.5 seconds under normal mobile and desktop conditions, as measured by production performance monitoring.
- The product should minimize unnecessary client-side overhead on high-value public pages, especially recipes, downloads, and educational content.
- Interactive features such as the ingredient scanner should not degrade the performance of the broader public content experience.

### Security

- The product must prevent accidental publication of unreviewed user submissions.
- Moderation and editorial access must be protected so that only authorized operators can approve, reject, revise, or publish trust-sensitive content.
- The MVP must avoid storing user health-tracking data.
- Trust-sensitive content areas must preserve editorial control and prevent unsafe claims from reaching public pages without review.
- Analytics, advertising, email, affiliate, and sponsorship integrations must not use health data for personalized advertising or commercial targeting.
- Commercial relationships, disclosures, and paid placements must be reviewable by authorized editors without changing safety classifications.

### Reliability

- Occasional downtime is tolerable, but the public site should normally remain available for browsing recipes, education, downloads, and safety guidance.
- Failures in non-core or interactive features should not make core public content unavailable.
- The product should favor a stable, low-complexity operating model over fragile feature breadth in the MVP.
- Editorial owners should be able to identify content due for review and report monthly content, audience, community, and monetization metrics.

### Accessibility

- AlphaGalData should be a good accessible public site for broad public use.
- Core public pages should support readable content structure, usable keyboard navigation, understandable links, and clear page hierarchy.
- Important public information should remain usable without requiring complex interactions or advanced interface behavior.

### SEO & Crawlability

- The product must maintain clean, stable, human-readable URLs for important public content.
- The product must provide proper titles and metadata for key public pages.
- The product must keep important public pages crawlable by search engines.
- The product must use internal linking to connect recipes, education, downloads, and safety resources into a coherent search-visible content structure.
- The product must provide a sitemap for search discovery.
- Important public content must not be hidden behind JavaScript-dependent rendering that prevents effective indexing.
- Every public route must have an intentional index/noindex state, and noindex routes must not appear in the sitemap.
- Indexable recipe and Safe Find pages must provide accurate applicable structured data.

### Content Governance and Monetization

- 100% of user-submitted recipes, stories, and Safe Finds must remain unpublished until an authorized moderator records an approval decision.
- Public trust-sensitive pages must provide author or owner, reviewer where appropriate, date, source or caveat context, and a visible educational disclaimer where relevant.
- Commercial content must include a clear nearby disclosure, and paid relationships must not determine safety guidance or editorial approval.
- Paid products and promotions must not displace the substantial original content needed for a useful public page.
- Content changes, moderation decisions, corrections, and Safe Find review dates must have an auditable record.
