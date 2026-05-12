import { describe, expect, it } from "vitest";
import {
  getAllPublishedGames,
  getAllPublishedGuides,
  getAllRenderedPublishedGuides,
  getGameBySlug,
  getGuideBySlug,
  getRenderedGuideBySlug,
  getGuideUrl,
  getPublicSitemapUrls
} from "@/lib/content";

describe("public content filtering", () => {
  it("excludes draft and fixture games from public indexes", () => {
    const games = getAllPublishedGames();

    expect(games.map((game) => game.slug)).toEqual([
      "battlestar-galactica-scattered-hopes"
    ]);
    expect(games.some((game) => game.isFixture)).toBe(false);
    expect(games.map((game) => game.slug)).not.toContain("everwind");
    expect(games.map((game) => game.slug)).not.toContain("aethus");
    expect(games.map((game) => game.slug)).not.toContain("draft-depths");
  });

  it("only returns published guides from public games", () => {
    const guides = getAllPublishedGuides();
    const slugs = guides.map((guide) => guide.slug);

    expect(slugs).toEqual([
      "resources-guide",
      "beginner-guide",
      "fleet-management-guide",
      "beginner-mistakes",
      "combat-guide",
      "meta-upgrades-guide"
    ]);
    expect(slugs).not.toContain("fixture-guide");
    expect(slugs).not.toContain("draft-guide");
  });

  it("keeps withdrawn launch candidates private", () => {
    expect(getGameBySlug("everwind")).toBeUndefined();
    expect(getGameBySlug("aethus")).toBeUndefined();
    expect(getGuideBySlug("everwind", "beginner-guide")).toBeUndefined();
    expect(getGuideBySlug("aethus", "beginner-guide")).toBeUndefined();
  });

  it("builds stable guide urls", () => {
    const guide = getGuideBySlug(
      "battlestar-galactica-scattered-hopes",
      "beginner-guide"
    );

    expect(guide?.title).toBe(
      "Battlestar Galactica: Scattered Hopes Opening Route: What To Do In Your First 3 Maps"
    );
    expect(getGuideUrl("battlestar-galactica-scattered-hopes", "beginner-guide")).toBe(
      "/games/battlestar-galactica-scattered-hopes/beginner-guide"
    );
  });

  it("hydrates published guide display fields from markdown frontmatter", async () => {
    const guide = await getRenderedGuideBySlug(
      "battlestar-galactica-scattered-hopes",
      "beginner-guide"
    );

    expect(guide?.shortTitle).toBe("Opening Route");
    expect(guide?.summary).toBe(
      "An opening route for your first three maps, covering Callisto, early management turns, and the safest first-battle plan."
    );
    expect(guide?.type).toBe("beginner");
  });

  it("hydrates the published guide index from markdown where available", async () => {
    const guides = await getAllRenderedPublishedGuides();
    const resourcesGuide = guides.find((guide) => guide.slug === "resources-guide");

    expect(resourcesGuide?.shortTitle).toBe("Resources Guide");
    expect(resourcesGuide?.summary).toBe(
      "A beginner resource guide covering Tylium, supplies, salvage, ammo, and emergency materials."
    );
    expect(resourcesGuide?.type).toBe("resources");
  });

  it("returns undefined for unknown or unpublished games and guides", () => {
    expect(getGameBySlug("missing")).toBeUndefined();
    expect(getGameBySlug("everwind")).toBeUndefined();
    expect(getGameBySlug("aethus")).toBeUndefined();
    expect(getGameBySlug("fixture-island")).toBeUndefined();
    expect(getGameBySlug("draft-depths")).toBeUndefined();
    expect(getGuideBySlug("everwind", "missing")).toBeUndefined();
    expect(getGuideBySlug("fixture-island", "fixture-guide")).toBeUndefined();
    expect(getGuideBySlug("draft-depths", "draft-guide")).toBeUndefined();
  });

  it("builds sitemap urls in stable public order", () => {
    expect(getPublicSitemapUrls()).toEqual([
      "/",
      "/games",
      "/games/battlestar-galactica-scattered-hopes",
      "/games/battlestar-galactica-scattered-hopes/resources-guide",
      "/games/battlestar-galactica-scattered-hopes/beginner-guide",
      "/games/battlestar-galactica-scattered-hopes/fleet-management-guide",
      "/games/battlestar-galactica-scattered-hopes/beginner-mistakes",
      "/games/battlestar-galactica-scattered-hopes/combat-guide",
      "/games/battlestar-galactica-scattered-hopes/meta-upgrades-guide",
      "/zh",
      "/zh/games",
      "/zh/games/battlestar-galactica-scattered-hopes",
      "/zh/games/battlestar-galactica-scattered-hopes/resources-guide",
      "/zh/games/battlestar-galactica-scattered-hopes/beginner-guide",
      "/zh/games/battlestar-galactica-scattered-hopes/fleet-management-guide",
      "/zh/games/battlestar-galactica-scattered-hopes/beginner-mistakes",
      "/zh/games/battlestar-galactica-scattered-hopes/combat-guide",
      "/zh/games/battlestar-galactica-scattered-hopes/meta-upgrades-guide"
    ]);
  });

  it("keeps fixture and draft content out of sitemap urls", () => {
    expect(getPublicSitemapUrls()).not.toContain("/games/everwind");
    expect(getPublicSitemapUrls()).not.toContain("/games/aethus");
    expect(getPublicSitemapUrls()).not.toContain("/games/fixture-island");
    expect(getPublicSitemapUrls()).not.toContain("/games/draft-depths");
    expect(getPublicSitemapUrls()).not.toContain("/games/everwind/beginner-guide");
    expect(getPublicSitemapUrls()).not.toContain("/games/aethus/beginner-guide");
    expect(getPublicSitemapUrls()).not.toContain("/games/fixture-island/fixture-guide");
    expect(getPublicSitemapUrls()).not.toContain("/games/draft-depths/draft-guide");
    expect(getPublicSitemapUrls()).not.toContain("/zh/games/fixture-island");
    expect(getPublicSitemapUrls()).not.toContain("/zh/games/draft-depths");
    expect(getPublicSitemapUrls()).not.toContain("/zh/games/fixture-island/fixture-guide");
    expect(getPublicSitemapUrls()).not.toContain("/zh/games/draft-depths/draft-guide");
  });
});
