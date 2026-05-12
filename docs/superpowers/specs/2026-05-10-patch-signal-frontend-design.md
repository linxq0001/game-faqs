# Patch Signal Frontend Design Spec

## Purpose

Patch Signal is an English Steam/Indie game guide site for early long-tail search demand. The site should help search visitors find direct answers, browse guides by player intent, and understand whether a guide is current and trustworthy.

The visual direction is **guide index and reading first**, with a restrained **dark scout radar + pixel game** identity. It should feel like a fast guide hub for fresh games, not a generic gaming blog, wiki clone, or internal monitoring dashboard.

## Brand Direction

Working name: **Patch Signal**.

Core promise:

> Find the guide you need before the wiki exists.

Visual personality:

- Dark tactical base: charcoal/black background, low-contrast grid, subtle scanline texture.
- Pixel accents: small pixel logo, 8-bit icons, tiny island/map motifs, blocky status markers.
- Readability priority: guide cards, direct answer modules, metadata, source/update notes, and internal links are more important than decorative effects.
- SEO utility tone: specific, practical, up-to-date, and honest about verification status.

Avoid:

- Purple-blue generic gaming gradients.
- Oversized marketing hero with no guide content.
- Dashboard-first layout that makes the public site feel like an admin tool.
- Heavy retro arcade styling that hurts trust or readability.

## Information Architecture

Primary public routes:

- `/` homepage and guide index.
- `/games` all covered games.
- `/games/<game-slug>` game hub.
- `/games/<game-slug>/<guide-slug>` guide page.
- `/guides/<guide-type>` optional guide-type index, such as beginner, crafting, boss, achievements, settings.

First screen priorities:

1. Brand and guide categories.
2. Search or guide lookup affordance.
3. Clear headline explaining the site.
4. A real guide preview with a direct answer.
5. Links into published guide pages.

## Page Designs

### Homepage / Guide Index

The homepage is an index for finding guides, not a landing page.

Required sections:

- Compact top navigation with brand, guide categories, and search.
- Hero block with the promise: “Find the guide you need before the wiki exists.”
- Featured direct-answer preview from a real guide.
- Browse-by-intent filter list: beginner, crafting, bosses, achievements, settings, system requirements, map, FAQ.
- Guide cards showing game, guide type, title, short answer/summary, updated date, read time or status.
- Published content only. Drafts may be visible in local/dev tooling, but not in public production index.

### Game Hub

The game hub should be the SEO and navigation anchor for a game.

Required content:

- Game title, Steam URL, appid, release date, tags, and current coverage status.
- Brief game summary focused on guide relevance.
- Last updated date.
- Guide cluster grouped by type or player intent.
- “Start here” guide.
- Related pages within the same game.
- Source notes where useful.

Visual treatment:

- Keep the dark scout frame and pixel accents.
- Use structured rows/cards for guide clusters.
- Include small status labels such as `published`, `needs update`, `source checked`, or `watchlist`, but do not expose internal scoring notes.

### Guide Page

The guide page is the most important template.

Required content order:

1. Game/title breadcrumb.
2. Guide title matching the search intent.
3. Updated date, game version, verification status, and source links when available.
4. Direct Answer module near the top.
5. Step-by-step sections, tables, checklists, or comparison blocks depending on guide type.
6. Related guides from the same game.
7. Source and update notes.

Guide pages should answer first, then explain. The design should support skimming, not long magazine reading.

## Components

Core components:

- `SiteHeader`: brand, category nav, search.
- `PixelLogo`: small blocky mark used consistently.
- `DirectAnswer`: prominent answer box for guide pages and previews.
- `GuideCard`: game label, guide type, title, summary, update metadata.
- `IntentFilter`: browse by player intent.
- `GameMetaPanel`: release date, Steam link, appid, tags, guide count.
- `GuideCluster`: grouped links for a game hub.
- `StatusBadge`: published, draft, needs update, source checked, watchlist.
- `RelatedGuides`: same-game internal links.
- `SourceNote`: links and verification notes.

Pixel elements should be small and functional: icons, logo, separators, status dots, and tiny decorative map/island shapes. They should not dominate article content.

## Visual System

Color tokens:

- Background: near-black charcoal, `#0b0d09`.
- Panel: deep green-black, `#11160e`.
- Text: warm parchment, `#f4ecd8`.
- Muted text: desaturated parchment-gray.
- Accent amber: `#f0c65a`.
- Verification green: `#66d39a`.
- Warning red: `#d54c38`.
- Secondary blue: `#62b2ca`.

Typography:

- Display: bold condensed/blocky sans for brand and hero headings.
- Body/UI: readable monospace for metadata, badges, filters, and compact UI.
- Article headings: serif or humanist display face to improve reading warmth.

Layout rules:

- Keep cards at 8px radius or less, preferably square or sharp for the scout/pixel identity.
- Avoid nested cards.
- Use stable grid dimensions for guide cards, filters, and metadata panels.
- Mobile layout becomes single-column with guide content above decorative panels.

Motion:

- Subtle hover lift on guide cards.
- Soft scanline or radar shimmer only in brand/hero areas.
- No distracting animations inside article reading flow.

## Content And Trust Rules

Each public guide must include:

- Last updated date.
- Guide type.
- Game relationship.
- Direct answer.
- Verification status: `researched`, `played`, `community-confirmed`, or `needs-update`.
- Source URLs when factual claims depend on Steam, official announcements, patch notes, or community confirmations.

Public pages must not show:

- Internal candidate scores.
- Chinese monitoring notes.
- Fixture/sample games.
- Draft guides in production navigation or sitemap.

## SEO Rules

Each published game and guide page generates:

- Title.
- Description.
- Canonical URL.
- Open Graph metadata.
- Sitemap entry.
- Internal links to relevant published pages.

Draft and watchlist content:

- Not included in sitemap.
- Not linked from production index.
- May exist as local content or unpublished briefs.

## Implementation Notes

Recommended first implementation:

- Static or hybrid-rendered site.
- Content stored as typed local data or MDX.
- No CMS in version one.
- No user accounts, comments, forum, or community submission.
- No full ad integration; reserve quiet ad slots later without breaking reading flow.

Representative first screens to implement:

1. Homepage/guide index.
2. Game hub for one verified game.
3. Guide page template with Direct Answer, metadata, body sections, and related guides.

## Acceptance Criteria

- The site visually matches the approved Patch Signal direction: dark scout radar base, restrained pixel accents, reading-first layout.
- Homepage works as a guide index, not a marketing-only page.
- Guide page puts a direct answer above long-form explanation.
- Game hub clearly links all published guides for a game.
- Draft content is not publicly indexed.
- Mobile layout remains readable and does not overlap.
- Metadata and update status are visible on guide cards and guide pages.
- Pixel elements add identity without reducing readability.

