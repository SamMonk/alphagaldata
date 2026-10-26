---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/prd.md
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/planning-artifacts/ux-design-specification.md
  - /home/shawnmonk/monk/collection/alphagaldata/_bmad-output/project-context.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/index.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/project-overview.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/architecture.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/component-inventory.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/api-contracts.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/data-models.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/development-guide.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/deployment-guide.md
  - /home/shawnmonk/monk/collection/alphagaldata/docs/source-tree-analysis.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-17'
project_name: 'alphagaldata'
user_name: 'Monk'
date: '2026-04-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product has 42 functional requirements, which cluster into six architectural domains:

- **Public content and discovery**
  - featured recipes
  - routed educational content
  - caregiver-relevant guidance
  - internal linking and search-engine-indexable structure

- **Recipe and save experience**
  - recipe detail pages
  - safety notes and substitutions
  - save and return flows
  - editorial featuring of content

- **Ingredient scanner and label-reading support**
  - ingredient text input
  - ingredient classification
  - explanatory result states
  - cross-links into education and safer alternatives

- **Preparedness and downloads**
  - dining cards
  - downloadable safety resources
  - bracelet/tattoo guidance
  - testing guidance with external next steps

- **Moderation and editorial governance**
  - story/recipe submissions
  - approve / reject / request revision flows
  - internal review notes
  - publication blocking for unreviewed content
  - editorial updates to trusted public pages

- **Trust and future extensibility**
  - educational-only disclaimers
  - unsafe-claim controls
  - no health-data tracking in MVP
  - future support for accounts and private/member features

Architecturally, this means the system is not a simple CMS-backed brochure site. It needs a content model, scanner logic layer, editorial workflow boundaries, and a reusable trust-status system.

**Non-Functional Requirements:**
The strongest NFRs driving architecture are:

- public pages should become usable within `2 to 3 seconds`
- high-value public pages must minimize client-side overhead
- no accidental publication of unreviewed content
- no user health-data storage in MVP
- responsive public UX across modern desktop and mobile browsers
- good accessible public-site behavior, effectively aligning with WCAG 2.1 AA expectations in the UX spec
- clean URLs, strong metadata, sitemap support, crawlable content, and no important content hidden behind JS-only rendering
- low-complexity, stable operation preferred over feature breadth

These NFRs strongly favor pre-rendered public content, selective client-side interactivity, and conservative backend complexity.

**Scale & Complexity:**
This is a `high` complexity brownfield web platform, but not because of scale in the enterprise sense. Complexity comes from trust, moderation, and explainable decision-support.

- Primary domain: `public content web platform with selective decision-support tooling`
- Complexity level: `high`
- Estimated architectural components: `8 to 12` meaningful components/services across content, scanner logic, moderation, delivery, and supporting infrastructure

### Technical Constraints & Dependencies

Known constraints and dependencies include:

- Existing Gatsby brownfield architecture should be preserved unless a strong reason emerges to replace it.
- Public content must remain SEO-first and crawlable.
- No real-time infrastructure is required for MVP.
- No health-data tracking is allowed in MVP.
- Moderation may be manual operationally, but the architecture must still enforce public publication boundaries.
- Trust-sensitive UX patterns from the UX spec require consistent implementation across recipes, scanner results, and downloads.
- The scanner requires a maintainable ingredient/risk data source and conservative classification rules, not just front-end parsing.
- Future accounts and trusted-member workflows should be possible later without forcing a rewrite of the public content experience.

### Cross-Cutting Concerns Identified

Several concerns will affect multiple architectural components:

- **Trust and safety governance**
  - educational-only positioning
  - safe wording
  - moderation enforcement
  - publication controls

- **Content-to-tool cohesion**
  - recipes, scanner, education, and downloads must share structured risk language and cross-linking patterns

- **Data quality and explainability**
  - ingredient classifications need source-aware reasoning, caution handling, and maintainable update pathways

- **SEO and rendering**
  - content pages must remain indexable while interactive features stay lightweight and progressive

- **Accessibility and mobile use**
  - trust-critical interactions must remain usable under stress, on small screens, and without color-dependent meaning

- **Brownfield maintainability**
  - the solution should fit the current Gatsby/Tailwind structure and avoid introducing disproportionate operational burden

## Starter Template Evaluation

### Primary Technology Domain

`Brownfield public web application with selective serverless backend services`

This is not a greenfield "pick a modern starter" situation. The project already has a viable Gatsby 5 + React 18 + TypeScript + Tailwind foundation, and the architecture goal is to extend it with serverless AWS services rather than replace it prematurely.

### Starter Options Considered

I considered three realistic paths:

- **Preserve current Gatsby foundation and add serverless AWS services**
  - lowest migration risk
  - best alignment with current brownfield repo
  - strongest continuity for SEO-first public content
  - lets scanner, save flows, downloads, and moderation APIs be added incrementally

- **Replatform to Next.js on Amplify Hosting**
  - strongest long-term AWS-native SSR/ISR path
  - valid future destination
  - higher migration cost now
  - unnecessary for MVP because the public site can already be served statically and the interactive requirements are selective, not universal

- **Adopt a new full-stack starter**
  - worst fit for current stage
  - adds migration complexity without solving the actual immediate problem
  - would delay core product work behind platform replacement

### Selected Starter: Preserve Existing Gatsby Foundation

**Rationale for Selection:**
The best serverless AWS move forward is to keep the current Gatsby frontend and introduce a serverless backend around it.

This choice is best because:
- the product is still primarily a routed public content site
- public pages need strong SEO and low client-side overhead
- no real-time features are required
- moderation can remain operationally simple while still being technically enforced
- the scanner and save flows can be implemented as focused APIs instead of forcing a frontend rewrite

This is not a starter-template choice in the greenfield sense. It is a brownfield architecture decision to preserve the current frontend foundation and build the serverless service layer beside it.

**Initialization Command:**
```bash
# No greenfield starter command recommended.
# Preserve the existing Gatsby application as the frontend foundation.
```

**Architectural Decisions Provided by Selected Foundation:**

**Language & Runtime:**
- TypeScript across frontend and backend
- React 18 on the frontend
- Node.js Lambda runtime for serverless functions

**Frontend Delivery:**
- Gatsby static build output deployed to S3
- CloudFront as CDN and edge distribution layer
- crawlable, pre-rendered public pages retained

**Backend Service Layer:**
- API Gateway as public API front door
- Lambda functions for scanner classification, recipe save flows, submission intake, moderation actions, and lightweight admin operations
- DynamoDB for serverless operational data and metadata
- S3 for downloads, attachments, generated assets, and larger static artifacts

**Data/State Direction:**
- DynamoDB on-demand capacity as default MVP posture
- S3 for large or file-oriented resources
- avoid relational infrastructure unless later workflow complexity proves it necessary

**Operational Tooling:**
- AWS Lambda Powertools for TypeScript for logging, tracing, and metrics
- existing AWS/Terraform direction retained rather than replaced

**Code Organization:**
- Gatsby frontend remains the presentation tier
- backend logic separated into Lambda-oriented service boundaries
- trust-sensitive classification, moderation, and publication logic moved out of purely client-side code
- content and scanner decision language standardized across frontend and API responses

**Development Experience:**
- lowest disruption to current repo
- incremental rollout possible
- infrastructure remains serverless and AWS-native
- future migration to Next.js remains possible later if Gatsby becomes the bottleneck

**Important refinement:**
Within API Gateway, the default recommendation is **HTTP API** unless you discover a concrete need for classic REST API features. That keeps cost and operational overhead lower.

**Note:** The first implementation stories should focus on standing up the serverless service layer beside the existing Gatsby frontend, not replacing the frontend foundation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Preserve Gatsby as the public frontend foundation
- Use S3 + CloudFront for frontend delivery
- Use API Gateway HTTP APIs + Lambda for serverless backend behavior
- Use DynamoDB as the primary operational data store
- Keep public MVP unauthenticated while securing admin/moderation operations
- Standardize scanner and trust-status response contracts across backend and frontend

**Important Decisions (Shape Architecture):**
- Use multiple DynamoDB tables instead of single-table design
- Separate trust-critical classification logic from purely client-side code
- Keep moderation and publication enforcement in backend service boundaries
- Use S3 for downloadable assets, attachments, and generated artifacts
- Adopt structured logging/metrics/tracing conventions for Lambda from the start

**Deferred Decisions (Post-MVP):**
- public/member authentication for non-admin users
- private member-only content zones
- trusted-member submission workflows
- migration from Gatsby to Next.js or another frontend foundation
- more advanced search/indexing infrastructure if content volume demands it

### Data Architecture

**Primary Data Store:** `Amazon DynamoDB`

**Decision:** Use multiple DynamoDB tables with explicit domain boundaries.

**Rationale:**
This product has several distinct operational data domains with different access patterns, validation concerns, and lifecycle rules:
- scanner ingredient/risk data
- saved recipe state
- submission/moderation workflow
- editorial metadata and operational support records

A single-table design would optimize for theoretical DynamoDB purity but would increase implementation ambiguity for agents, make moderation and scanner concerns harder to reason about, and raise the chance of accidental coupling in a trust-sensitive system.

**Recommended table domains:**
- `ingredient_catalog`
  - ingredient names, aliases, risk tiers, source strength, notes, update metadata
- `user_recipe_saves`
  - saved recipe references and lightweight save-state metadata
- `submission_queue`
  - story/recipe submissions, moderation state, review notes, audit transitions
- `operational_metadata`
  - editorial flags, featured ordering, resource metadata, limited support records

**Validation approach:**
- validate all API input at Lambda boundaries
- store normalized internal records in DynamoDB
- never let frontend assumptions define persistent truth
- treat trust/risk classifications as structured data, not freeform strings

**Caching approach:**
- avoid premature infrastructure-heavy caching
- rely first on CloudFront for public asset/content delivery
- allow Lambda-side in-memory hot-path caching for frequently referenced scanner data where safe
- revisit DynamoDB Accelerator or dedicated cache only if scanner demand proves it necessary

### Authentication & Security

**MVP Authentication Model:** `public-first with protected admin surfaces`

**Decision:**
- no login required for public content, scanner use, or downloads in MVP
- admin/moderation operations must be protected from the first release
- public/member authentication is deferred until member-only functionality actually ships

**Authorization pattern:**
- separate public APIs from protected editorial/moderation APIs
- require authenticated access for moderation, internal notes, featured-content management, and publication-control operations
- preserve a hard boundary between public educational behavior and internal editorial behavior

**Security strategy:**
- use least-privilege IAM per Lambda function
- keep moderation/publication permissions out of frontend-only logic
- prevent unreviewed content exposure by enforcing review state in backend services
- do not store health-tracking data in MVP
- maintain educational-only disclaimer support as a system-level requirement, not just copywriting

**Future-ready posture:**
- when accounts are introduced, prefer Cognito-backed identity rather than custom auth
- do not let future auth assumptions distort the public MVP architecture today

### API & Communication Patterns

**API Style:** `HTTP JSON APIs over API Gateway HTTP API`

**Decision:**
Use API Gateway HTTP APIs fronting Lambda functions as the default communication layer for interactive product features.

**Core API domains:**
- scanner/classification API
- recipe-save API
- submission intake API
- moderation/admin API
- featured/editorial management API
- lightweight resource metadata API if needed

**Response contract direction:**
All trust-sensitive APIs should share a consistent response structure built around:
- status/risk tier
- explanation
- next recommended action
- optional source/context note

For example, scanner responses should consistently support concepts like:
- `known_risk`
- `caution`
- `unknown`
- `next_action`

This prevents frontend/backend drift in risk language and keeps UI components aligned with backend truth.

**Error handling standard:**
- machine-readable error code
- human-readable message
- optional recovery guidance
- no silent fallthrough for trust-sensitive classification failures

**Rate limiting approach:**
- apply API Gateway throttling to public APIs
- apply stricter controls to admin/moderation APIs
- revisit finer-grained abuse controls only if real traffic justifies them

### Frontend Architecture

**Frontend Foundation:** `existing Gatsby 5 + React 18 + TypeScript + Tailwind`

**Decision:**
Keep the Gatsby app as the public presentation layer and integrate serverless APIs selectively.

**Architectural implications:**
- routed content pages remain statically generated where possible
- scanner and save flows become focused interactive islands, not a wholesale SPA shift
- trust-critical UX components consume structured backend contracts rather than embedding logic ad hoc
- SEO-first pages should continue minimizing client-side overhead

**State management approach:**
- local/component state for isolated interactions by default
- small shared client state only where needed for save status, scanner flow continuity, or utility interactions
- avoid introducing heavyweight global state tooling unless later complexity proves it necessary

**Bundle/performance posture:**
- keep scanner dependencies isolated from content-page bundles where possible
- do not let interactive tooling degrade recipe and educational page performance
- preserve static rendering and crawlability as primary frontend constraints

### Infrastructure & Deployment

**Hosting strategy:**
- Gatsby build artifacts deploy to `S3`
- `CloudFront` fronts the public site and downloadable assets
- `API Gateway + Lambda` power interactive backend features
- `DynamoDB` stores operational/state data
- `S3` stores downloadable resources, attachments, and generated file artifacts

**Infrastructure as Code:**
- retain and extend the existing Terraform direction
- split infrastructure clearly into:
  - frontend delivery
  - API/runtime
  - data/storage
  - observability/security support

**Environment structure:**
- separate environments for at least development and production
- isolate DynamoDB tables, buckets, and API stages by environment
- keep environment configuration explicit and minimal

**Monitoring and logging:**
- adopt structured logging from the first Lambda functions
- standardize tracing/metrics conventions with AWS Lambda Powertools for TypeScript
- create alarms around API failures, Lambda errors, and moderation/publication path failures
- prioritize observability for scanner classification and publication safety paths

**Scaling strategy:**
- rely on serverless scaling characteristics for MVP
- use DynamoDB on-demand capacity
- keep architecture simple until traffic or moderation volume proves the need for more specialization

### Decision Impact Analysis

**Implementation Sequence:**
1. extend Terraform to define frontend/API/data boundaries clearly
2. stand up API Gateway HTTP APIs and Lambda service skeletons
3. establish DynamoDB tables for ingredient catalog, saves, submissions, and operational metadata
4. implement shared API contracts for risk/status responses
5. connect Gatsby interactive flows to backend APIs
6. add protected moderation/editorial surfaces
7. add observability and enforcement checks around trust-critical flows

**Cross-Component Dependencies:**
- scanner UX depends on the ingredient catalog model and shared risk contract
- recipe-save flows depend on save-state API design and future auth compatibility
- moderation UX depends on submission queue modeling and protected admin APIs
- downloads/preparedness UX depends on S3 asset organization and stable metadata contracts
- SEO/performance goals constrain how much logic can move into client-heavy frontend behavior

This gives the system a clean shape:
- static public content where possible
- serverless decision logic where necessary
- explicit trust boundaries everywhere

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**  
The highest-risk implementation divergence points are:
- DynamoDB naming and key design
- API route and payload naming
- risk-tier and trust-status vocabulary
- Lambda project structure
- validation boundaries
- error and logging formats
- Gatsby-to-API integration patterns
- S3 asset and metadata handling

These areas must be standardized so multiple agents do not produce incompatible services or UI integrations.

### Naming Patterns

**Database Naming Conventions:**
- DynamoDB table names should use lowercase snake_case:
  - `ingredient_catalog`
  - `user_recipe_saves`
  - `submission_queue`
  - `operational_metadata`
- Primary keys and sort keys should use uppercase DynamoDB key fields only for shared infrastructure conventions:
  - `PK`
  - `SK`
- Domain attributes should use lowercase snake_case:
  - `ingredient_name`
  - `risk_tier`
  - `source_strength`
  - `next_action`
  - `recipe_slug`
  - `moderation_status`
- Timestamp attributes should use ISO-8601 strings in UTC:
  - `created_at`
  - `updated_at`
  - `reviewed_at`

**API Naming Conventions:**
- Public API routes should use lowercase kebab-case nouns and action-oriented subpaths only when necessary:
  - `/scanner/classify`
  - `/recipes/save`
  - `/submissions/recipes`
  - `/submissions/stories`
  - `/admin/submissions/{submissionId}`
- Route parameters should use lower camelCase in application code, but path templates should remain readable:
  - `{submissionId}`
  - `{recipeSlug}`
- JSON fields should use `snake_case` in API payloads for consistency with backend persistence and trust metadata:
  - `risk_tier`
  - `next_action`
  - `source_note`
  - `moderation_status`

**Code Naming Conventions:**
- TypeScript types/interfaces/classes: `PascalCase`
- functions/variables/hooks: `camelCase`
- files for React components: `PascalCase.tsx`
- files for Lambda/domain modules/utilities: `kebab-case.ts`
- directories: `kebab-case`
- route/page slugs remain content-friendly and SEO-safe

### Structure Patterns

**Project Organization:**
The architecture should separate frontend presentation from backend service logic clearly.

**Frontend structure**
- Gatsby page/templates remain in the existing frontend structure
- trust-critical UI primitives should live in dedicated component modules
- API client logic should be centralized, not scattered through page components
- scanner, save, and moderation-related client calls should go through shared service wrappers

**Backend structure**
Each Lambda-capable service area should follow a consistent shape:
- `handlers/` for Lambda entrypoints
- `domain/` for business logic
- `schemas/` for request/response validation
- `repositories/` for DynamoDB/S3 access
- `contracts/` for shared response and risk-language definitions
- `observability/` or shared utilities for logging/metrics/tracing helpers

**Tests**
- backend tests should be colocated or mirrored consistently by module, but the pattern must be uniform
- recommend `*.test.ts` near the module for unit tests
- integration tests should live in a dedicated higher-level test area when introduced

### Format Patterns

**API Response Formats:**
All JSON APIs should use a predictable envelope for trust-sensitive interactions:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

For failures:

```json
{
  "data": null,
  "meta": {
    "request_id": "..."
  },
  "error": {
    "code": "INGREDIENT_NOT_CLASSIFIED",
    "message": "The ingredient could not be classified confidently.",
    "recovery_guidance": "Research before buying."
  }
}
```

**Risk/Trust Format Rules:**
- canonical risk tiers:
  - `known_risk`
  - `caution`
  - `unknown`
- canonical next actions:
  - `avoid`
  - `verify_before_using`
  - `research_before_buying`
- source posture values should also be standardized, for example:
  - `source_backed`
  - `editorial_caution`
  - `mixed_evidence`

**Data Exchange Formats:**
- dates: ISO-8601 UTC strings
- booleans: true/false
- enums: lowercase snake_case strings
- no mixed camelCase/snake_case API payloads
- null should be used intentionally; do not omit fields when the contract says the field is present-but-empty

### Communication Patterns

**Frontend-to-API Pattern:**
- Gatsby components should not call raw `fetch` ad hoc for trust-critical features
- use shared API client functions per domain
- all scanner-related consumers must consume the same typed contract
- all recipe-save consumers must use the same save-state abstraction
- frontend must render backend-provided trust tiers and next actions, not reinvent them locally

**State Management Pattern:**
- local state first
- shared state only for cross-page or repeated utility needs
- scanner result state should be normalized once per response
- trust/risk interpretation belongs to the backend contract layer, not duplicated UI heuristics

**Logging Pattern:**
- all Lambda handlers use structured logs
- log fields should include:
  - `request_id`
  - `route`
  - `service_domain`
  - `outcome`
  - `risk_tier` where relevant
  - `submission_id` or `recipe_slug` where relevant
- never log sensitive or unnecessary user-supplied payloads in raw form

### Process Patterns

**Validation Patterns:**
- validate all request bodies and query inputs at the Lambda boundary
- reject malformed payloads before domain logic runs
- frontend validation improves UX, but backend validation is authoritative
- scanner input, submission input, and moderation actions each require explicit schema validation

**Error Handling Patterns:**
- trust-critical failures must fail explicitly, not silently
- unknown classification is a designed outcome, not an exception
- technical failures and trust-status outcomes must stay separate:
  - `unknown` is not a server error
  - failed classification processing is a server/application error
- user-facing error messages should be calm, direct, and action-oriented

**Loading State Patterns:**
- frontend loading states must distinguish:
  - content loading
  - scanner processing
  - save action in progress
  - submission action in progress
- loading should not hide existing trust information unnecessarily
- retry patterns should be conservative and explicit for mutations

### Enforcement Guidelines

**All AI Agents MUST:**
- use `snake_case` for API payload fields and DynamoDB attributes
- use the canonical trust vocabulary:
  - `known_risk`
  - `caution`
  - `unknown`
  - `avoid`
  - `verify_before_using`
  - `research_before_buying`
- keep business logic out of Gatsby page components
- validate input at Lambda boundaries
- return the standard API response envelope
- keep trust interpretation centralized in shared backend/domain contracts
- prevent moderation/publication rules from being enforced only in the frontend

**Pattern Enforcement:**
- architecture and story reviews should reject new synonyms for trust/risk states
- API contract changes must be treated as deliberate architectural changes
- frontend and backend types should be aligned through shared contract definitions where practical
- any deviation from naming or payload standards should be documented before merge

### Pattern Examples

**Good Examples:**
- DynamoDB field: `risk_tier`
- API field: `next_action`
- Lambda file: `classify-ingredient.ts`
- React component: `SafetyNoteBlock.tsx`
- API route: `/scanner/classify`
- success response:
  ```json
  {
    "data": {
      "ingredient_name": "gelatin",
      "risk_tier": "known_risk",
      "next_action": "avoid"
    },
    "meta": {
      "request_id": "abc-123"
    },
    "error": null
  }
  ```

**Anti-Patterns:**
- mixed response fields like `riskTier`, `risk_tier`, and `risk-level` in different services
- frontend-only ingredient classification rules that drift from backend contracts
- ad hoc `fetch` calls embedded throughout page components
- table names like `IngredientCatalog` or `ingredient-catalog`
- API routes mixing singular/plural inconsistently
- using exceptions to represent normal `unknown` classification outcomes

These rules are mainly about one thing: if multiple agents build scanner logic, save flows, moderation endpoints, and Gatsby integrations separately, they should still produce one coherent system.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
alphagaldata/
├── README.md
├── package.json
├── tsconfig.json
├── gatsby-config.ts
├── gatsby-node.js
├── gatsby-browser.js
├── gatsby-ssr.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── content/
│   ├── recipes/
│   └── ...
├── static/
│   ├── admin/
│   ├── data/
│   └── downloads/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── recipes/
│   │   ├── scanner/
│   │   ├── safety/
│   │   ├── preparedness/
│   │   └── shared/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── recipes.tsx
│   │   ├── scanner.tsx
│   │   ├── downloads.tsx
│   │   ├── submit-recipe.tsx
│   │   └── ...
│   ├── templates/
│   │   ├── recipe.tsx
│   │   └── learn-article.tsx
│   ├── services/
│   │   ├── api/
│   │   ├── scanner/
│   │   ├── recipes/
│   │   └── shared/
│   ├── contracts/
│   │   ├── risk.ts
│   │   ├── scanner.ts
│   │   ├── recipes.ts
│   │   ├── submissions.ts
│   │   └── api.ts
│   ├── data/
│   ├── styles/
│   ├── types/
│   └── utils/
├── backend/
│   ├── handlers/
│   │   ├── scanner/
│   │   ├── recipes/
│   │   ├── submissions/
│   │   ├── moderation/
│   │   └── admin/
│   ├── domain/
│   │   ├── scanner/
│   │   ├── recipes/
│   │   ├── submissions/
│   │   ├── moderation/
│   │   └── shared/
│   ├── repositories/
│   │   ├── dynamodb/
│   │   ├── s3/
│   │   └── shared/
│   ├── schemas/
│   │   ├── scanner/
│   │   ├── recipes/
│   │   ├── submissions/
│   │   └── moderation/
│   ├── contracts/
│   │   ├── risk.ts
│   │   ├── scanner.ts
│   │   ├── recipes.ts
│   │   ├── submissions.ts
│   │   └── api.ts
│   ├── observability/
│   │   ├── logger.ts
│   │   ├── metrics.ts
│   │   └── tracing.ts
│   ├── config/
│   └── utils/
├── infra/
│   ├── terraform/
│   │   ├── modules/
│   │   ├── envs/
│   │   │   ├── dev/
│   │   │   └── prod/
│   │   └── shared/
│   └── scripts/
├── scripts/
│   ├── sync-ingredients.js
│   ├── generate_cards.js
│   └── ...
├── docs/
└── _bmad-output/
```

### Architectural Boundaries

**API Boundaries:**
- Gatsby remains the public presentation layer and never directly owns trust-critical classification logic.
- All interactive trust-critical operations cross into backend APIs:
  - scanner classification
  - recipe save/unsave
  - submission intake
  - moderation actions
  - editorial/featured state changes
- Public APIs and protected admin APIs must remain separate by route and handler grouping.

**Component Boundaries:**
- `src/components/` owns presentation components and UI behavior.
- `src/services/` owns frontend-side API clients and orchestration helpers.
- `src/contracts/` owns frontend-consumed contracts and risk vocabulary types.
- Page and template files compose components and services but should not implement domain rules.

**Service Boundaries:**
- `backend/handlers/` only adapts API Gateway events into validated domain calls.
- `backend/domain/` owns business logic and trust decisions.
- `backend/repositories/` owns persistence and storage integration.
- `backend/schemas/` owns request/response validation.
- `backend/contracts/` owns backend truth for payload structures and status vocabulary.

**Data Boundaries:**
- file-based content remains in `content/`, `static/`, and existing Gatsby data sources
- application operational data lives in DynamoDB
- downloadable/generated artifacts and attachments live in S3
- backend repositories are the only layer allowed to know DynamoDB/S3 implementation details directly

### Requirements to Structure Mapping

**Feature / FR mapping:**
- public content, recipes, and educational pages
  - `src/pages/`, `src/templates/`, `src/components/recipes/`, `src/components/safety/`
- scanner experience
  - frontend: `src/pages/scanner.tsx`, `src/components/scanner/`, `src/services/scanner/`, `src/contracts/scanner.ts`
  - backend: `backend/handlers/scanner/`, `backend/domain/scanner/`, `backend/schemas/scanner/`, `backend/repositories/dynamodb/`
- recipe save flow
  - frontend: `src/components/recipes/`, `src/services/recipes/`, `src/contracts/recipes.ts`
  - backend: `backend/handlers/recipes/`, `backend/domain/recipes/`, `backend/repositories/dynamodb/`
- submissions and moderation
  - frontend: `src/pages/submit-recipe.tsx`, future moderation/admin surfaces, `src/services/api/`
  - backend: `backend/handlers/submissions/`, `backend/handlers/moderation/`, `backend/domain/submissions/`, `backend/domain/moderation/`
- preparedness/download tools
  - frontend: `src/pages/downloads.tsx`, `src/components/preparedness/`
  - backend only where metadata or controlled access is needed
- trust/risk vocabulary
  - `src/contracts/risk.ts`
  - `backend/contracts/risk.ts`

**Cross-cutting concerns:**
- trust and safety messaging
  - `src/components/safety/`
  - `src/contracts/risk.ts`
  - `backend/contracts/risk.ts`
  - `backend/domain/shared/`
- observability
  - `backend/observability/`
- infrastructure
  - `infra/terraform/`
- content curation/editorial support
  - existing content structure plus `backend/handlers/admin/` and `backend/domain/moderation/`

### Integration Points

**Internal Communication:**
- Gatsby pages call frontend service modules
- frontend service modules call backend HTTP APIs
- Lambda handlers validate input and delegate to domain services
- domain services call repositories
- repositories call DynamoDB or S3
- contracts and trust vocabulary stay aligned across both sides

**External Integrations:**
- CloudFront and S3 for site delivery/assets
- API Gateway for backend entry
- Lambda for compute
- DynamoDB for operational records
- S3 for downloads, attachments, and generated artifacts
- Cognito later, only when public/member auth is introduced

**Data Flow:**
- public content flows through Gatsby build and CloudFront delivery
- interactive flows go browser → API Gateway → Lambda → DynamoDB/S3
- moderation/publication state is enforced in backend before anything becomes public
- risk-tier and next-action data originate in backend logic and are rendered by frontend components

### File Organization Patterns

**Configuration Files:**
- root config stays focused on Gatsby/frontend tooling
- backend-specific config lives under `backend/config/`
- infrastructure config lives under `infra/terraform/`
- environment examples stay at repo root, with environment-specific infra values in Terraform env folders

**Source Organization:**
- frontend and backend are clearly separated at the top level
- shared contracts stay near each side rather than extracted into a package system
- domain-specific code is grouped by feature area, not by technical layer alone

**Test Organization:**
- frontend tests should live near components/services where practical
- backend unit tests should live near domain/repository modules
- integration/API tests can be introduced under a dedicated backend test area later
- keep the testing pattern uniform once chosen

**Asset Organization:**
- content assets remain with Gatsby/content conventions
- downloadable artifacts remain under `static/` for public assets or in S3 when operationally managed
- generated serverless artifacts should not be mixed into frontend source folders

### Development Workflow Integration

**Development Server Structure:**
- Gatsby development remains the frontend local entry point
- backend services should be runnable/testable independently
- frontend service wrappers should support local API base URLs cleanly

**Build Process Structure:**
- Gatsby build produces the public site artifact
- backend functions package independently from frontend build output
- Terraform composes deployment resources across both layers

**Deployment Structure:**
- frontend delivery and backend runtime should be deployable independently
- infrastructure definitions should preserve that separation
- operational changes to Lambda or DynamoDB should not require a frontend rebuild unless contracts change

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The architecture decisions work together without contradiction. Gatsby plus S3/CloudFront supports the SEO-first, routed public-site model, while API Gateway HTTP APIs, Lambda, DynamoDB, and S3 cover the selective interactive features without introducing unnecessary platform complexity. The choices remain aligned with the explicit constraints of no real-time features, no health-data tracking, and manual-but-enforced moderation.

**Pattern Consistency:**
The implementation patterns support the stack and the UX trust model consistently. Canonical `snake_case` payloads, shared risk vocabulary, standard API envelopes, and Lambda validation boundaries all reinforce the same backend-owned truth model. The UX trust tiers map cleanly to architecture contracts instead of being left as presentation-only language.

**Structure Alignment:**
The proposed project structure supports the architectural decisions well. `src/` remains the Gatsby presentation boundary, `backend/` becomes the serverless application boundary, and `infra/terraform/` cleanly owns infrastructure concerns. The chosen single-repo structure is simple enough for the current project stage while still supporting clear implementation boundaries.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
Although epics are not created yet, all major feature groups from the PRD have architectural support:
- public content and discovery through Gatsby pages, templates, and SEO-safe routing
- recipe viewing and save flows through frontend components plus backend save APIs
- ingredient scanner classification through backend domain logic and ingredient catalog data
- dining cards, downloads, and preparedness resources through public content and S3/static delivery
- moderation and editorial control through protected admin APIs and backend publication enforcement
- future accounts and trusted-member workflows through explicit forward-compatible boundaries without contaminating the MVP

**Functional Requirements Coverage:**
All 42 functional requirements are architecturally supported. The architecture covers routed public experiences, trust-sensitive content handling, scanner flows, downloads, moderation controls, and future expansion paths. Cross-cutting functional requirements such as disclaimers, publication safety, and no-health-data handling are addressed at the system level rather than left to content authors alone.

**Non-Functional Requirements Coverage:**
The architecture addresses the NFR set directly:
- performance through pre-rendered public pages and selective interactivity
- security and trust through backend publication controls, protected moderation surfaces, and no health tracking
- reliability through static delivery and low-complexity serverless services
- accessibility through alignment with the UX component and interaction requirements
- SEO and crawlability through static routed content, sitemap support, and avoiding JS-only rendering for important public content

### Implementation Readiness Validation ✅

**Decision Completeness:**
The core decisions are complete enough to guide implementation:
- platform and hosting direction are fixed
- serverless backend shape is fixed
- trust/risk vocabulary is fixed
- repo boundaries are fixed
- data, API, and moderation directions are fixed

**Structure Completeness:**
The project structure is specific enough for implementation planning. It defines where frontend UI, frontend API clients, backend handlers, domain logic, persistence, contracts, and infrastructure belong. That is sufficient to drive epics, stories, and later implementation without major ambiguity.

**Pattern Completeness:**
The architecture addresses the highest-risk implementation divergence points:
- naming conventions
- API route and payload standards
- trust-tier vocabulary
- validation boundaries
- error-handling expectations
- logging conventions
- frontend/backend separation rules

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps:**
- The MVP admin/moderation authentication mechanism is still not explicitly chosen. The architecture requires protected admin access from day one, but the implementation phase must choose the concrete AWS-native mechanism.
- The long-term single source of truth for shared contracts is not fully fixed. The structure intentionally keeps contracts near frontend and backend code, but implementation should define whether backend contracts are authoritative or whether a tighter shared-contract pattern will be introduced later.

**Nice-to-Have Gaps:**
- Additional concrete examples of API payloads beyond scanner/save flows would help later implementation.
- A short infrastructure environment matrix for `dev` vs `prod` would make Terraform stories easier to draft.

### Validation Issues Addressed

No blocking issues were found. The only open items are implementation-clarity decisions that belong naturally in epics and stories rather than requiring architectural rework. This means the architecture can be treated as ready, with those two items called out explicitly for early implementation planning.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

The architecture is coherent, internally consistent, and detailed enough to guide AI agents through implementation without major ambiguity. The remaining open items are small enough to resolve during epics and stories without destabilizing the architectural baseline.
