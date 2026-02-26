# AlphaGalData (Gatsby)

## Strategy
- **Mission**: Deliver evidence-based resources, visuals, and community tools for people navigating alpha-gal syndrome while positioning alphagaldata.com as the authoritative hub for tick-borne allergy data.
- **Audience**: Patients, caregivers, allergists, and advocacy partners seeking trustworthy information, location awareness, and product guidance.
- **North-star KPIs**: Weekly sessions (+traffic quality), newsletter sign-ups, map interaction depth, affiliate click-through rate, AdSense RPM.

### Tracking & Monetization
- GA4 (`G-Y9DXW6X4E2`) and AdSense are already injected for production. Add Google Tag Manager to orchestrate future experiments (heatmap, conversion tags) and migrate to consent-aware tracking before Q4.
- Stand up a simple conversion layer: track newsletter form submits, outbound partner clicks, and map filter usage as custom GA4 events. Mirror the same conversion goals in Google Ads for remarketing.
- Curate 3–5 affiliate/CPM partners relevant to allergy-safe groceries and medical supplies. House product data in `/src/content/shop/*.mdx` so it can be surfaced contextually on educational posts.

### Content & UX
- Keep the Leaflet hotspot map fresher by highlighting recent case activity ("past 30 days" overlay) and surfacing the latest research headlines alongside it.
- Expand `/learn` articles with structured outlines (problem → symptoms → care plan) and embed callouts that cross-link to climate and investing sites where relevant (e.g., insurance content).
- Launch an email capture block that offers a "monthly alpha-gal update" lead magnet; the newsletter will feed campaign retargeting and partner monetization.

### Data & Automation
- Use the `data-bot` repo to fetch CDC/USDA tick surveillance CSVs weekly and commit geojson updates to `alphagaldata/src/data/` via a GitHub Action (cron Tue/Thu). Reference the prototype scripts under `../scripts/geojson` for projection/tiling.
- Mirror allergy clinic locations from `data-bot/database` into a thin JSON API served from S3. Expose them on a new `/providers` page and track filter usage.
- Keep Terraform (`tf/`) aligned with DNS + S3 hosting; add alarms for 4xx/5xx spikes via CloudWatch once the next deploy pipeline refresh is scheduled.

### Traffic & Campaigns
- Always include campaign tags on inter-site promotions (`?utm_source=network&utm_medium=referral&utm_campaign=alphagal-network`).
- Social cadence: weekly Instagram carousel (map screenshot + tip), bi-weekly LinkedIn post aimed at clinicians, quarterly Reddit AMA recap.
- Paid experiments: run seasonal Google Ads for "alpha gal symptoms" retargeting, and test Pinterest Idea Pins driving to the learn hub with UTM tracking.

### Operations
- **Weekly**: Review GA4 engagement + AdSense RPM, refresh featured resources, confirm `data-bot` cron success.
- **Monthly**: Publish a short "Alpha-Gal Trends" blog entry, rotate hero imagery, audit top queries in Search Console.
- **Quarterly**: Back up `tf/` state, revisit affiliate roster, and refresh the roadmap in this README.

## Progress Log
- 2025-09-22 — Documented growth plan, clarified analytics owners, and linked data-bot automation requirements.

## Development Notes
Static site with Leaflet heat map, pages, and nightly tasks. See `DEPLOY.md` and `.env.example` for deploy specifics.
Set the following environment variables for analytics:
- `GATSBY_GA4_MEASUREMENT_ID` (defaults to `G-Y9DXW6X4E2` if unset)
- `GATSBY_GTM_CONTAINER_ID` (optional – when provided, GTM loads GA4 + conversion tags)
- Ingredient data now syncs from `../data-bot/datasets/alphagal/ingredients.json`. `npm run build` runs `npm run prepare:data` to copy the latest dataset; set `INGREDIENTS_SOURCE` to override the source path when running in CI.
