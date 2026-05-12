# Patch Signal Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public Patch Signal guide site experience: a reading-first homepage/guide index, one game hub, one guide page template, typed sample content, metadata, sitemap, and basic tests.

**Architecture:** Create a small Next.js App Router project with static content stored as typed TypeScript data. Shared components render the approved dark scout radar + restrained pixel identity, while content utilities enforce published-only public indexes and stable URLs.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules/global CSS, Vitest, Testing Library, Playwright for visual smoke checks.

---

## File Structure

- Create `package.json`: project scripts and dependencies.
- Create `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `playwright.config.ts`: tooling configuration.
- Create `app/layout.tsx`: root layout and global metadata.
- Create `app/page.tsx`: homepage/guide index.
- Create `app/games/page.tsx`: public game index.
- Create `app/games/[gameSlug]/page.tsx`: game hub route.
- Create `app/games/[gameSlug]/[guideSlug]/page.tsx`: guide page route.
- Create `app/sitemap.ts`: published-only sitemap.
- Create `app/not-found.tsx`: branded 404.
- Create `app/globals.css`: full Patch Signal visual system.
- Create `content/games.ts`: typed game and guide data.
- Create `lib/content.ts`: content lookup, filtering, URL helpers, metadata helpers.
- Create `components/*.tsx`: focused UI components.
- Create `tests/content.test.ts`: content and sitemap behavior tests.
- Create `tests/render.test.tsx`: component behavior tests.
- Create `e2e/home.spec.ts`: Playwright smoke check for layout and navigation.

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create project package scripts**

Write `package.json`:

```json
{
  "name": "patch-signal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@next/sitemap": "^4.2.3",
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.4.0",
    "typescript": "^5.8.0",
    "vite": "^6.3.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 2: Create TypeScript config**

Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create Next config**

Write `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

- [ ] **Step 4: Create test configs**

Write `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
```

Write `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

- [ ] **Step 5: Create ignore file**

Write `.gitignore`:

```gitignore
node_modules
.next
dist
coverage
playwright-report
test-results
.superpowers
.DS_Store
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

## Task 2: Add Typed Content Model

**Files:**
- Create: `content/games.ts`
- Create: `lib/content.ts`
- Create: `tests/setup.ts`
- Create: `tests/content.test.ts`

- [ ] **Step 1: Add test setup**

Write `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing content tests**

Write `tests/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getAllPublishedGames,
  getAllPublishedGuides,
  getGameBySlug,
  getGuideBySlug,
  getGuideUrl,
  getPublicSitemapUrls
} from "@/lib/content";

describe("public content filtering", () => {
  it("excludes draft and fixture games from public indexes", () => {
    const games = getAllPublishedGames();
    expect(games.map((game) => game.slug)).toEqual(["everwind", "aethus"]);
    expect(games.some((game) => game.isFixture)).toBe(false);
  });

  it("excludes draft guides from guide indexes and sitemap urls", () => {
    const guides = getAllPublishedGuides();
    expect(guides.map((guide) => guide.slug)).not.toContain("best-base-locations");
    expect(getPublicSitemapUrls()).not.toContain("/games/everwind/best-base-locations");
  });

  it("builds stable guide urls", () => {
    const guide = getGuideBySlug("everwind", "beginner-guide");
    expect(guide?.title).toBe("Everwind Beginner Guide: What To Do First");
    expect(getGuideUrl("everwind", "beginner-guide")).toBe("/games/everwind/beginner-guide");
  });

  it("returns undefined for unknown games and guides", () => {
    expect(getGameBySlug("missing")).toBeUndefined();
    expect(getGuideBySlug("everwind", "missing")).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run: `npm test -- tests/content.test.ts`

Expected: FAIL because `@/lib/content` does not exist.

- [ ] **Step 4: Create typed content fixtures**

Write `content/games.ts`:

```ts
export type GameStatus = "published" | "watchlist" | "draft";
export type GuideStatus = "published" | "draft" | "needs-update";
export type VerificationStatus = "researched" | "played" | "community-confirmed" | "needs-update";
export type GuideType =
  | "beginner"
  | "tips"
  | "settings"
  | "system-requirements"
  | "crafting"
  | "resources"
  | "boss"
  | "puzzle"
  | "ending"
  | "achievements"
  | "map"
  | "faq";

export type Guide = {
  slug: string;
  title: string;
  type: GuideType;
  status: GuideStatus;
  summary: string;
  directAnswer: string;
  updatedAt: string;
  gameVersion: string;
  verificationStatus: VerificationStatus;
  readTime: string;
  sourceUrls: string[];
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
  }>;
};

export type Game = {
  title: string;
  slug: string;
  status: GameStatus;
  steamUrl: string;
  appid: string;
  releaseDate: string;
  tags: string[];
  summary: string;
  coverageStatus: string;
  updatedAt: string;
  isFixture?: boolean;
  guides: Guide[];
};

export const games: Game[] = [
  {
    title: "Everwind",
    slug: "everwind",
    status: "published",
    steamUrl: "https://store.steampowered.com/app/2253100/Everwind/",
    appid: "2253100",
    releaseDate: "2026-03-17",
    tags: ["Survival", "Crafting", "Co-op", "Base Building"],
    summary:
      "A survival crafting adventure with floating islands, co-op setup, resource loops, and early base-building decisions that create strong guide demand.",
    coverageStatus: "Build Now",
    updatedAt: "2026-05-10",
    guides: [
      {
        slug: "beginner-guide",
        title: "Everwind Beginner Guide: What To Do First",
        type: "beginner",
        status: "published",
        summary: "A first-hour route for base setup, early resources, co-op prep, and common mistakes to skip.",
        directAnswer:
          "Build a stable resource loop before chasing combat upgrades. Start with base placement, storage, and co-op setup, then expand into crafting and boss preparation.",
        updatedAt: "2026-05-10",
        gameVersion: "Early Access",
        verificationStatus: "researched",
        readTime: "4 min read",
        sourceUrls: ["https://store.steampowered.com/app/2253100/Everwind/"],
        sections: [
          {
            heading: "Start With A Safe Base Loop",
            body: "Your first goal is not maximum damage. It is a base loop that keeps storage, crafting access, and nearby resources predictable.",
            bullets: ["Place storage early.", "Keep crafting stations close.", "Mark risky routes before long trips."]
          },
          {
            heading: "Delay Expensive Upgrades",
            body: "Early upgrades are only worth it when they speed up gathering, travel, or survival. Cosmetic or narrow combat upgrades can wait."
          }
        ]
      },
      {
        slug: "crafting-resource-route",
        title: "Everwind Crafting And Resource Route",
        type: "crafting",
        status: "published",
        summary: "Materials, stations, and upgrade order for a reliable early crafting loop.",
        directAnswer:
          "Prioritize resources that unlock repeatable crafting stations before one-off items. A repeatable station saves more time than a single stronger tool.",
        updatedAt: "2026-05-10",
        gameVersion: "Early Access",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: ["https://store.steampowered.com/app/2253100/Everwind/"],
        sections: [
          {
            heading: "Crafting Order",
            body: "Use the first resource runs to secure station access, storage, and repair capacity.",
            bullets: ["Storage first.", "Core stations second.", "Combat preparation third."]
          }
        ]
      },
      {
        slug: "best-base-locations",
        title: "Everwind Best Base Locations",
        type: "map",
        status: "draft",
        summary: "How to judge safe, efficient, and co-op friendly base spots before committing.",
        directAnswer:
          "The best early base location is close to repeatable resources, easy to return to, and not exposed to every dangerous route.",
        updatedAt: "2026-05-10",
        gameVersion: "Early Access",
        verificationStatus: "needs-update",
        readTime: "4 min read",
        sourceUrls: ["https://store.steampowered.com/app/2253100/Everwind/"],
        sections: [
          {
            heading: "Location Criteria",
            body: "Use safety, resource access, and return routes as the three base-location checks."
          }
        ]
      }
    ]
  },
  {
    title: "AETHUS",
    slug: "aethus",
    status: "published",
    steamUrl: "https://store.steampowered.com/app/2822250/AETHUS_Demo/",
    appid: "2822250",
    releaseDate: "2024-05-24",
    tags: ["Mining", "Base Building", "Crafting", "Demo"],
    summary:
      "A mining and outpost-focused demo with clear early-game resource and progression questions.",
    coverageStatus: "Seed Pack",
    updatedAt: "2026-05-10",
    guides: [
      {
        slug: "mining-outpost-basics",
        title: "AETHUS Mining And Outpost Basics",
        type: "resources",
        status: "published",
        summary: "How to turn early mining into a reliable surface outpost without wasting materials.",
        directAnswer:
          "Treat the first outpost as a supply chain, not a decoration project. Secure mining access, storage, and return paths before expanding.",
        updatedAt: "2026-05-10",
        gameVersion: "Demo",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: ["https://store.steampowered.com/app/2822250/AETHUS_Demo/"],
        sections: [
          {
            heading: "Outpost Priorities",
            body: "A small, reliable outpost beats a large unfinished one because it reduces travel friction faster."
          }
        ]
      }
    ]
  },
  {
    title: "Fixture Island",
    slug: "fixture-island",
    status: "published",
    steamUrl: "https://example.com/fixture",
    appid: "fixture",
    releaseDate: "2026-01-01",
    tags: ["Fixture"],
    summary: "A fake game used only to prove fixture content cannot leak into public pages.",
    coverageStatus: "Fixture",
    updatedAt: "2026-05-10",
    isFixture: true,
    guides: []
  }
];
```

- [ ] **Step 5: Create content helpers**

Write `lib/content.ts`:

```ts
import { games, type Game, type Guide } from "@/content/games";

export type GuideWithGame = Guide & {
  game: Pick<Game, "title" | "slug" | "steamUrl" | "appid" | "tags">;
};

export function getAllPublishedGames(): Game[] {
  return games.filter((game) => game.status === "published" && !game.isFixture);
}

export function getGameBySlug(slug: string): Game | undefined {
  return getAllPublishedGames().find((game) => game.slug === slug);
}

export function getPublishedGuidesForGame(gameSlug: string): GuideWithGame[] {
  const game = getGameBySlug(gameSlug);
  if (!game) return [];

  return game.guides
    .filter((guide) => guide.status === "published")
    .map((guide) => ({
      ...guide,
      game: {
        title: game.title,
        slug: game.slug,
        steamUrl: game.steamUrl,
        appid: game.appid,
        tags: game.tags
      }
    }));
}

export function getAllPublishedGuides(): GuideWithGame[] {
  return getAllPublishedGames().flatMap((game) => getPublishedGuidesForGame(game.slug));
}

export function getGuideBySlug(gameSlug: string, guideSlug: string): GuideWithGame | undefined {
  return getPublishedGuidesForGame(gameSlug).find((guide) => guide.slug === guideSlug);
}

export function getGameUrl(gameSlug: string): string {
  return `/games/${gameSlug}`;
}

export function getGuideUrl(gameSlug: string, guideSlug: string): string {
  return `/games/${gameSlug}/${guideSlug}`;
}

export function getPublicSitemapUrls(): string[] {
  const gameUrls = getAllPublishedGames().map((game) => getGameUrl(game.slug));
  const guideUrls = getAllPublishedGuides().map((guide) => getGuideUrl(guide.game.slug, guide.slug));

  return ["/", "/games", ...gameUrls, ...guideUrls];
}

export function getGuideDescription(guide: GuideWithGame): string {
  return `${guide.summary} Updated ${guide.updatedAt}. Verification: ${guide.verificationStatus}.`;
}
```

- [ ] **Step 6: Run content tests**

Run: `npm test -- tests/content.test.ts`

Expected: PASS.

## Task 3: Build Shared Layout And Components

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/PixelLogo.tsx`
- Create: `components/SiteHeader.tsx`
- Create: `components/StatusBadge.tsx`
- Create: `components/DirectAnswer.tsx`
- Create: `components/GuideCard.tsx`
- Create: `components/IntentFilter.tsx`
- Create: `components/RelatedGuides.tsx`
- Create: `tests/render.test.tsx`

- [ ] **Step 1: Write component render tests**

Write `tests/render.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DirectAnswer } from "@/components/DirectAnswer";
import { GuideCard } from "@/components/GuideCard";
import { IntentFilter } from "@/components/IntentFilter";
import { getAllPublishedGuides } from "@/lib/content";

describe("guide UI components", () => {
  it("renders direct answers with an accessible label", () => {
    render(<DirectAnswer answer="Build storage before combat upgrades." />);
    expect(screen.getByText("Direct Answer")).toBeInTheDocument();
    expect(screen.getByText("Build storage before combat upgrades.")).toBeInTheDocument();
  });

  it("renders guide cards with metadata", () => {
    const guide = getAllPublishedGuides()[0];
    render(<GuideCard guide={guide} />);
    expect(screen.getByRole("link", { name: /Everwind Beginner Guide/i })).toHaveAttribute(
      "href",
      "/games/everwind/beginner-guide"
    );
    expect(screen.getByText("beginner")).toBeInTheDocument();
    expect(screen.getByText("Updated 2026-05-10")).toBeInTheDocument();
  });

  it("renders intent filters from published guides", () => {
    render(<IntentFilter guides={getAllPublishedGuides()} />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    expect(screen.getByText("Crafting")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/render.test.tsx`

Expected: FAIL because components do not exist.

- [ ] **Step 3: Create layout**

Write `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Patch Signal - Steam and Indie Game Guides",
    template: "%s | Patch Signal"
  },
  description: "Fast English guides for fresh Steam and indie games before the wiki exists.",
  metadataBase: new URL("https://patchsignal.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create global visual system**

Write `app/globals.css` using the approved design tokens:

```css
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500;600;700&family=Literata:opsz,wght@7..72,500;7..72,700&display=swap");

:root {
  --bg: #0b0d09;
  --paper: #f4ecd8;
  --ink: #181713;
  --panel: #11160e;
  --panel-2: #182014;
  --line: rgba(244, 236, 216, 0.18);
  --paper-line: rgba(24, 23, 19, 0.16);
  --amber: #f0c65a;
  --green: #66d39a;
  --red: #d54c38;
  --blue: #62b2ca;
  --muted: #b9b19b;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--bg);
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--paper);
  background:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    radial-gradient(circle at 14% 12%, rgba(213, 76, 56, 0.14), transparent 28%),
    radial-gradient(circle at 85% 10%, rgba(102, 211, 154, 0.12), transparent 32%),
    var(--bg);
  background-size: 16px 16px, 16px 16px, auto, auto, auto;
  font-family: "IBM Plex Mono", monospace;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.16;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04) 1px, transparent 1px, transparent 5px);
}

a {
  color: inherit;
  text-decoration: none;
}

.wrap {
  width: min(1200px, calc(100% - 36px));
  margin: 0 auto;
  padding: 24px 0 38px;
}

.panel {
  border: 1px solid var(--line);
  background: rgba(17, 22, 14, 0.9);
}

.section-title {
  margin: 26px 0 11px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  color: var(--amber);
  font-size: 12px;
  text-transform: uppercase;
}

.section-title span:last-child {
  color: var(--muted);
}

.pixel-island {
  width: 94px;
  height: 62px;
  opacity: 0.56;
  image-rendering: pixelated;
  background:
    linear-gradient(var(--blue), var(--blue)) 26px 8px / 38px 7px no-repeat,
    linear-gradient(var(--paper), var(--paper)) 18px 15px / 58px 7px no-repeat,
    linear-gradient(var(--green), var(--green)) 12px 22px / 70px 10px no-repeat,
    linear-gradient(#6c5435, #6c5435) 26px 32px / 44px 13px no-repeat,
    linear-gradient(#3b2f1e, #3b2f1e) 40px 45px / 16px 12px no-repeat;
}

@media (max-width: 900px) {
  .wrap {
    width: min(100% - 24px, 720px);
    padding-top: 16px;
  }
}
```

- [ ] **Step 5: Create shared components**

Write `components/PixelLogo.tsx`:

```tsx
export function PixelLogo() {
  return <span className="pixel-logo" aria-hidden="true" />;
}
```

Write `components/SiteHeader.tsx`:

```tsx
import Link from "next/link";
import { PixelLogo } from "./PixelLogo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Patch Signal home">
        <PixelLogo />
        <span>Patch Signal</span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/games">Game Guides</Link>
        <Link href="/guides/beginner">Beginner</Link>
        <Link href="/guides/crafting">Crafting</Link>
        <Link href="/guides/boss">Bosses</Link>
        <Link href="/guides/achievements">Achievements</Link>
      </nav>
      <div className="search-shell">Search guides...</div>
    </header>
  );
}
```

Write `components/StatusBadge.tsx`:

```tsx
export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="status-badge">{children}</span>;
}
```

Write `components/DirectAnswer.tsx`:

```tsx
export function DirectAnswer({ answer }: { answer: string }) {
  return (
    <section className="direct-answer" aria-label="Direct answer">
      <strong>Direct Answer</strong>
      <p>{answer}</p>
    </section>
  );
}
```

Write `components/GuideCard.tsx`:

```tsx
import Link from "next/link";
import type { GuideWithGame } from "@/lib/content";
import { getGuideUrl } from "@/lib/content";
import { StatusBadge } from "./StatusBadge";

export function GuideCard({ guide }: { guide: GuideWithGame }) {
  return (
    <article className="guide-card">
      <StatusBadge>
        {guide.game.title} / {guide.type}
      </StatusBadge>
      <h3>
        <Link href={getGuideUrl(guide.game.slug, guide.slug)}>{guide.title}</Link>
      </h3>
      <p>{guide.summary}</p>
      <div className="card-meta">
        <span>Updated {guide.updatedAt}</span>
        <span>{guide.readTime}</span>
      </div>
    </article>
  );
}
```

Write `components/IntentFilter.tsx`:

```tsx
import type { GuideWithGame } from "@/lib/content";

const labels: Record<string, string> = {
  beginner: "Beginner",
  crafting: "Crafting",
  resources: "Resources",
  boss: "Bosses",
  achievements: "Achievements",
  settings: "Settings",
  map: "Map",
  faq: "FAQ",
  "system-requirements": "System Requirements"
};

export function IntentFilter({ guides }: { guides: GuideWithGame[] }) {
  const counts = guides.reduce<Record<string, number>>((acc, guide) => {
    acc[guide.type] = (acc[guide.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="intent-filter panel">
      <h2>Filter by intent</h2>
      {Object.entries(counts).map(([type, count]) => (
        <div className="filter-row" key={type}>
          <span>{labels[type] ?? type}</span>
          <b>{count.toString().padStart(2, "0")}</b>
        </div>
      ))}
    </aside>
  );
}
```

Write `components/RelatedGuides.tsx`:

```tsx
import Link from "next/link";
import type { GuideWithGame } from "@/lib/content";
import { getGuideUrl } from "@/lib/content";

export function RelatedGuides({ guides }: { guides: GuideWithGame[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="related-guides panel">
      <h2>Related guides</h2>
      <div className="related-list">
        {guides.map((guide) => (
          <Link href={getGuideUrl(guide.game.slug, guide.slug)} key={guide.slug}>
            <span className="mini-icon" aria-hidden="true" />
            <span>{guide.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Append component styles**

Append to `app/globals.css`:

```css
.site-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: rgba(13, 17, 10, 0.9);
}

.brand {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--amber);
  font-weight: 700;
  text-transform: uppercase;
}

.pixel-logo {
  width: 26px;
  height: 26px;
  image-rendering: pixelated;
  border: 1px solid rgba(240, 198, 90, 0.6);
  background:
    linear-gradient(var(--amber), var(--amber)) 8px 4px / 10px 4px no-repeat,
    linear-gradient(var(--amber), var(--amber)) 4px 8px / 18px 4px no-repeat,
    linear-gradient(var(--green), var(--green)) 10px 14px / 6px 8px no-repeat;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 18px;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
}

.nav a:first-child,
.nav a:hover {
  color: var(--paper);
}

.search-shell {
  min-width: 230px;
  border: 1px solid rgba(240, 198, 90, 0.36);
  color: var(--muted);
  padding: 8px 10px;
  font-size: 12px;
  background: #090c08;
}

.status-badge {
  display: inline-flex;
  color: var(--green);
  border: 1px solid rgba(102, 211, 154, 0.38);
  padding: 4px 6px;
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.direct-answer {
  border-top: 1px solid var(--paper-line);
  border-bottom: 1px solid var(--paper-line);
  padding: 12px 0;
  margin: 12px 0;
}

.direct-answer strong {
  display: block;
  color: #2f6f4f;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.direct-answer p {
  margin: 0;
  line-height: 1.58;
  font-size: 13px;
}

.guide-card {
  min-height: 190px;
  border: 1px solid var(--line);
  background: rgba(17, 22, 14, 0.9);
  padding: 16px;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.guide-card:hover {
  transform: translateY(-3px);
  border-color: var(--amber);
}

.guide-card h3 {
  margin: 0;
  max-width: 420px;
  font: 700 24px/1.05 "Literata", serif;
  color: var(--paper);
}

.guide-card p {
  max-width: 460px;
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.55;
  font-size: 13px;
}

.card-meta {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  display: flex;
  justify-content: space-between;
  color: var(--amber);
  font-size: 10px;
  text-transform: uppercase;
}

.intent-filter {
  padding: 14px;
  align-self: start;
}

.intent-filter h2 {
  margin: 0 0 14px;
  font-size: 12px;
  color: var(--paper);
  text-transform: uppercase;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(244, 236, 216, 0.12);
  padding: 11px 0;
  color: var(--muted);
  font-size: 12px;
}

.filter-row b {
  color: var(--green);
  font-weight: 600;
}

.related-guides {
  margin-top: 24px;
  padding: 18px;
}

.related-guides h2 {
  margin: 0 0 14px;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--amber);
}

.related-list {
  display: grid;
  gap: 8px;
}

.related-list a {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 9px;
  align-items: center;
  border: 1px solid var(--line);
  padding: 8px;
  font-size: 12px;
}

.mini-icon {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  background:
    linear-gradient(var(--red), var(--red)) 6px 2px / 4px 10px no-repeat,
    linear-gradient(var(--green), var(--green)) 2px 10px / 12px 4px no-repeat;
}

@media (max-width: 900px) {
  .site-header {
    grid-template-columns: 1fr;
  }

  .nav {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .search-shell {
    min-width: 0;
  }
}
```

- [ ] **Step 7: Run component tests**

Run: `npm test -- tests/render.test.tsx`

Expected: PASS.

## Task 4: Implement Homepage And Game Index

**Files:**
- Create: `app/page.tsx`
- Create: `app/games/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create homepage**

Write `app/page.tsx`:

```tsx
import { DirectAnswer } from "@/components/DirectAnswer";
import { GuideCard } from "@/components/GuideCard";
import { IntentFilter } from "@/components/IntentFilter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPublishedGuides } from "@/lib/content";

export default function HomePage() {
  const guides = getAllPublishedGuides();
  const featured = guides[0];

  return (
    <main className="wrap">
      <SiteHeader />
      <section className="home-hero">
        <div className="hero-copy panel">
          <div className="kicker">
            <span className="dots" aria-hidden="true" />
            <span>English guides for fresh Steam and indie games</span>
          </div>
          <h1>Find the guide you need before the wiki exists.</h1>
          <p>
            Patch Signal organizes early-game answers, crafting routes, boss prep, achievements, maps,
            settings, and system requirements into clean guide hubs with update dates and source notes.
          </p>
          <div className="pixel-island" aria-hidden="true" />
        </div>

        <aside className="now-reading">
          <h2>{featured.title}</h2>
          <DirectAnswer answer={featured.directAnswer} />
          <div className="reading-list">
            {guides.slice(1, 4).map((guide) => (
              <a href={`/games/${guide.game.slug}/${guide.slug}`} key={guide.slug}>
                <span className="mini-icon" aria-hidden="true" />
                <span>{guide.title}</span>
              </a>
            ))}
          </div>
        </aside>
      </section>

      <div className="section-title">
        <span>Browse Guide Index</span>
        <span>Published pages only</span>
      </div>
      <section className="index-grid">
        <IntentFilter guides={guides} />
        <div className="cards">{guides.map((guide) => <GuideCard guide={guide} key={`${guide.game.slug}-${guide.slug}`} />)}</div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create game index**

Write `app/games/page.tsx`:

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPublishedGames, getPublishedGuidesForGame } from "@/lib/content";

export const metadata = {
  title: "Game Guides",
  description: "Browse all published Steam and indie game guide hubs on Patch Signal."
};

export default function GamesPage() {
  const games = getAllPublishedGames();

  return (
    <main className="wrap">
      <SiteHeader />
      <section className="page-heading panel">
        <p className="kicker-text">Published guide hubs</p>
        <h1>Game Guides</h1>
        <p>Every public hub links only to reviewed guide pages with update dates and source notes.</p>
      </section>
      <section className="game-list">
        {games.map((game) => (
          <Link className="game-row panel" href={`/games/${game.slug}`} key={game.slug}>
            <span>
              <strong>{game.title}</strong>
              <small>{game.summary}</small>
            </span>
            <b>{getPublishedGuidesForGame(game.slug).length} guides</b>
          </Link>
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Append page styles**

Append to `app/globals.css`:

```css
.home-hero {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) 360px;
  gap: 18px;
  align-items: stretch;
}

.hero-copy {
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.hero-copy .pixel-island {
  position: absolute;
  right: 22px;
  bottom: 24px;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.dots {
  width: 7px;
  height: 7px;
  background: var(--green);
  box-shadow: 11px 0 0 var(--amber), 22px 0 0 var(--red);
}

.hero-copy h1,
.page-heading h1,
.game-hub h1,
.guide-article h1 {
  margin: 0;
  font: 700 clamp(42px, 6.8vw, 86px)/0.88 "Archivo Black", sans-serif;
  text-transform: uppercase;
}

.hero-copy p,
.page-heading p {
  max-width: 640px;
  margin: 22px 0 0;
  color: #d6cdb8;
  line-height: 1.75;
  font-size: 15px;
}

.now-reading {
  border: 1px solid rgba(240, 198, 90, 0.36);
  background: var(--paper);
  color: var(--ink);
  padding: 20px;
  box-shadow: 8px 8px 0 rgba(240, 198, 90, 0.16);
}

.now-reading h2 {
  margin: 0 0 12px;
  font: 700 28px/1.05 "Literata", serif;
}

.reading-list {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.reading-list a {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 9px;
  align-items: center;
  border: 1px solid var(--paper-line);
  padding: 8px;
  font-size: 12px;
}

.index-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 18px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.page-heading {
  margin-top: 18px;
  padding: 24px;
}

.kicker-text {
  color: var(--green);
  font-size: 12px;
  text-transform: uppercase;
}

.game-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.game-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px;
}

.game-row strong,
.game-row small {
  display: block;
}

.game-row small {
  margin-top: 8px;
  color: var(--muted);
  line-height: 1.5;
}

.game-row b {
  color: var(--amber);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .home-hero,
  .index-grid,
  .cards {
    grid-template-columns: 1fr;
  }

  .hero-copy .pixel-island {
    display: none;
  }

  .game-row {
    display: grid;
  }
}
```

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS.

## Task 5: Implement Game Hub And Guide Page

**Files:**
- Create: `app/games/[gameSlug]/page.tsx`
- Create: `app/games/[gameSlug]/[guideSlug]/page.tsx`
- Create: `app/not-found.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create branded 404**

Write `app/not-found.tsx`:

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="wrap">
      <SiteHeader />
      <section className="page-heading panel">
        <p className="kicker-text">Signal lost</p>
        <h1>Guide Not Found</h1>
        <p>This page is not published, was moved, or never passed review.</p>
        <Link className="text-link" href="/">Return to guide index</Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create game hub**

Write `app/games/[gameSlug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/GuideCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPublishedGames, getGameBySlug, getPublishedGuidesForGame } from "@/lib/content";

type Props = {
  params: Promise<{ gameSlug: string }>;
};

export function generateStaticParams() {
  return getAllPublishedGames().map((game) => ({ gameSlug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gameSlug } = await params;
  const game = getGameBySlug(gameSlug);
  if (!game) return {};

  return {
    title: `${game.title} Guides`,
    description: `${game.title} guide hub with beginner tips, crafting routes, achievements, and updated source notes.`
  };
}

export default async function GameHubPage({ params }: Props) {
  const { gameSlug } = await params;
  const game = getGameBySlug(gameSlug);
  if (!game) notFound();

  const guides = getPublishedGuidesForGame(game.slug);

  return (
    <main className="wrap">
      <SiteHeader />
      <section className="game-hub panel">
        <div>
          <p className="kicker-text">{game.coverageStatus}</p>
          <h1>{game.title} Guides</h1>
          <p>{game.summary}</p>
        </div>
        <aside className="meta-panel">
          <div><span>Steam App</span><b>{game.appid}</b></div>
          <div><span>Release</span><b>{game.releaseDate}</b></div>
          <div><span>Updated</span><b>{game.updatedAt}</b></div>
          <a href={game.steamUrl}>Steam page</a>
        </aside>
      </section>

      <div className="tag-row">{game.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

      <div className="section-title">
        <span>Published Guides</span>
        <span>{guides.length} pages</span>
      </div>
      <section className="cards">{guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</section>
    </main>
  );
}
```

- [ ] **Step 3: Create guide page**

Write `app/games/[gameSlug]/[guideSlug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectAnswer } from "@/components/DirectAnswer";
import { RelatedGuides } from "@/components/RelatedGuides";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getAllPublishedGuides,
  getGuideBySlug,
  getGuideDescription,
  getPublishedGuidesForGame
} from "@/lib/content";

type Props = {
  params: Promise<{ gameSlug: string; guideSlug: string }>;
};

export function generateStaticParams() {
  return getAllPublishedGuides().map((guide) => ({
    gameSlug: guide.game.slug,
    guideSlug: guide.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gameSlug, guideSlug } = await params;
  const guide = getGuideBySlug(gameSlug, guideSlug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: getGuideDescription(guide),
    alternates: {
      canonical: `/games/${gameSlug}/${guideSlug}`
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { gameSlug, guideSlug } = await params;
  const guide = getGuideBySlug(gameSlug, guideSlug);
  if (!guide) notFound();

  const related = getPublishedGuidesForGame(gameSlug).filter((item) => item.slug !== guide.slug);

  return (
    <main className="wrap">
      <SiteHeader />
      <article className="guide-article">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Guide Index</Link>
          <span>/</span>
          <Link href={`/games/${guide.game.slug}`}>{guide.game.title}</Link>
        </nav>
        <header className="article-header panel">
          <p className="kicker-text">{guide.game.title} / {guide.type}</p>
          <h1>{guide.title}</h1>
          <div className="article-meta">
            <span>Updated {guide.updatedAt}</span>
            <span>{guide.gameVersion}</span>
            <span>{guide.verificationStatus}</span>
          </div>
        </header>

        <div className="article-body">
          <DirectAnswer answer={guide.directAnswer} />
          {guide.sections.map((section) => (
            <section className="article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="source-note">
            <h2>Sources and update notes</h2>
            <p>This page is marked as {guide.verificationStatus} for {guide.gameVersion}.</p>
            {guide.sourceUrls.map((url) => (
              <a href={url} key={url}>{url}</a>
            ))}
          </section>
        </div>
      </article>
      <RelatedGuides guides={related} />
    </main>
  );
}
```

- [ ] **Step 4: Append detail page styles**

Append to `app/globals.css`:

```css
.game-hub {
  margin-top: 18px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
}

.game-hub p,
.article-header p {
  color: #d6cdb8;
  line-height: 1.7;
}

.meta-panel {
  border: 1px solid var(--line);
  background: #090c08;
  padding: 14px;
}

.meta-panel div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  padding: 9px 0;
  font-size: 12px;
}

.meta-panel span {
  color: var(--muted);
}

.meta-panel b,
.meta-panel a {
  color: var(--amber);
}

.meta-panel a {
  display: inline-block;
  margin-top: 12px;
  font-size: 12px;
  text-transform: uppercase;
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.tag-row span {
  border: 1px solid var(--line);
  color: var(--muted);
  padding: 6px 8px;
  font-size: 11px;
  text-transform: uppercase;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  margin: 18px 0 12px;
}

.article-header {
  padding: 24px;
}

.article-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.article-meta span {
  border: 1px solid var(--line);
  padding: 6px 8px;
  color: var(--amber);
  font-size: 11px;
  text-transform: uppercase;
}

.article-body {
  max-width: 820px;
  margin-top: 18px;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid rgba(240, 198, 90, 0.36);
  padding: 24px;
  box-shadow: 8px 8px 0 rgba(240, 198, 90, 0.16);
}

.article-section {
  border-top: 1px solid var(--paper-line);
  padding-top: 18px;
  margin-top: 18px;
}

.article-section h2,
.source-note h2 {
  font: 700 28px/1.1 "Literata", serif;
  margin: 0 0 10px;
}

.article-section p,
.article-section li,
.source-note p {
  line-height: 1.75;
}

.source-note {
  border-top: 1px solid var(--paper-line);
  margin-top: 22px;
  padding-top: 18px;
}

.source-note a {
  display: block;
  color: #2f6f4f;
  overflow-wrap: anywhere;
  font-size: 13px;
}

.text-link {
  display: inline-block;
  margin-top: 18px;
  color: var(--amber);
}

@media (max-width: 900px) {
  .game-hub {
    grid-template-columns: 1fr;
  }

  .article-body {
    padding: 18px;
  }
}
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS.

## Task 6: Add Sitemap And Route Tests

**Files:**
- Create: `app/sitemap.ts`
- Modify: `tests/content.test.ts`

- [ ] **Step 1: Create sitemap**

Write `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getPublicSitemapUrls } from "@/lib/content";

const siteUrl = "https://patchsignal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return getPublicSitemapUrls().map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-05-10")
  }));
}
```

- [ ] **Step 2: Extend content tests for sitemap**

Append to `tests/content.test.ts`:

```ts
describe("sitemap urls", () => {
  it("contains public game and guide urls only", () => {
    expect(getPublicSitemapUrls()).toEqual([
      "/",
      "/games",
      "/games/everwind",
      "/games/aethus",
      "/games/everwind/beginner-guide",
      "/games/everwind/crafting-resource-route",
      "/games/aethus/mining-outpost-basics"
    ]);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: PASS.

## Task 7: Add Playwright Smoke Checks

**Files:**
- Create: `e2e/home.spec.ts`

- [ ] **Step 1: Create Playwright smoke test**

Write `e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage presents the guide index and direct answer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Patch Signal home/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Find the guide you need before the wiki exists/i })).toBeVisible();
  await expect(page.getByText("Direct Answer")).toBeVisible();
  await expect(page.getByRole("link", { name: /Everwind Beginner Guide/i })).toBeVisible();
});

test("game hub links to a published guide", async ({ page }) => {
  await page.goto("/games/everwind");
  await expect(page.getByRole("heading", { name: /Everwind Guides/i })).toBeVisible();
  await page.getByRole("link", { name: /Everwind Beginner Guide/i }).click();
  await expect(page).toHaveURL(/\/games\/everwind\/beginner-guide$/);
  await expect(page.getByText("Updated 2026-05-10")).toBeVisible();
});
```

- [ ] **Step 2: Run Playwright**

Run: `npm run e2e`

Expected: PASS in desktop and mobile projects.

## Task 8: Visual QA And Final Verification

**Files:**
- No new files unless QA exposes a bug.

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Expected: local server starts on `http://localhost:3000`.

- [ ] **Step 2: Open browser and inspect screens**

Open:

- `http://localhost:3000/`
- `http://localhost:3000/games/everwind`
- `http://localhost:3000/games/everwind/beginner-guide`

Expected:

- Homepage is a guide index, not a marketing-only landing page.
- Pixel accents are visible but restrained.
- Direct answer is above long-form content.
- Cards and text do not overlap on desktop or mobile.
- Draft guide `best-base-locations` is absent from homepage, game hub, and sitemap.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test
npm run build
npm run e2e
```

Expected: all commands pass.

- [ ] **Step 4: Commit if repository is initialized**

Run:

```bash
git status --short
git add package.json package-lock.json tsconfig.json next.config.mjs vitest.config.ts playwright.config.ts .gitignore app components content lib tests e2e docs/superpowers
git commit -m "feat: build patch signal guide site prototype"
```

Expected: commit succeeds if this directory is a git repository. If it is not a git repository, skip commit and report that limitation.

## Self-Review

- Spec coverage: homepage/index, game hub, guide page, pixel scout visual system, published-only filtering, trust metadata, sitemap, and mobile/readability checks are covered.
- Scope: first implementation is intentionally limited to public pages and static typed content. CMS, accounts, comments, ads, and monitoring automation remain out of scope.
- Placeholder scan: no incomplete placeholder markers are present in the implementation steps.
- Type consistency: `Game`, `Guide`, `GuideWithGame`, `getGuideUrl`, `getPublishedGuidesForGame`, and route params are used consistently across tasks.
