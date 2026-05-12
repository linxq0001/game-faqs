import { games, type Game, type Guide } from "@/content/games";
import { loadMarkdownGuideContent } from "@/lib/faq-content";

export type PublishedGuide = Guide & {
  status: "published";
};

export type PublishedGame = Omit<Game, "guides"> & {
  guides: PublishedGuide[];
};

export type GuideWithGame = PublishedGuide & {
  game: Pick<PublishedGame, "title" | "slug" | "steamUrl" | "appid" | "tags" | "artwork">;
};

function isPublicGame(game: Game): boolean {
  return game.status === "published" && !game.isFixture;
}

function isPublishedGuide(guide: Guide): guide is PublishedGuide {
  return guide.status === "published";
}

function toPublishedGame(game: Game): PublishedGame {
  return {
    ...game,
    guides: game.guides.filter(isPublishedGuide)
  };
}

function withGame(guide: PublishedGuide, game: PublishedGame): GuideWithGame {
  return {
    ...guide,
    game: {
      title: game.title,
      slug: game.slug,
      steamUrl: game.steamUrl,
      appid: game.appid,
      tags: game.tags,
      artwork: game.artwork
    }
  };
}

async function hydrateGuide(guide: GuideWithGame, locale: string = "en"): Promise<GuideWithGame> {
  if (!guide.contentPath) {
    return guide;
  }

  const localizedPath = guide.contentPath.replace(/\/(en|zh)\//, `/${locale}/`);
  const markdownContent = await loadMarkdownGuideContent(localizedPath);

  return {
    ...guide,
    title: markdownContent.title || guide.title,
    shortTitle: markdownContent.shortTitle || guide.shortTitle,
    summary: markdownContent.summary || guide.summary,
    type: markdownContent.type || guide.type,
    updatedAt: markdownContent.updatedAt ?? guide.updatedAt,
    directAnswer: markdownContent.directAnswer || guide.directAnswer,
    sections: markdownContent.sections.length > 0 ? markdownContent.sections : guide.sections,
    sourceUrls: markdownContent.sourceUrls.length > 0 ? markdownContent.sourceUrls : guide.sourceUrls,
    artwork: markdownContent.artwork ?? guide.artwork
  };
}

export function getAllPublishedGames(): PublishedGame[] {
  return games.filter(isPublicGame).map(toPublishedGame);
}

export function getGameBySlug(slug: string): PublishedGame | undefined {
  return getAllPublishedGames().find((game) => game.slug === slug);
}

export function getPublishedGuidesForGame(gameSlug: string): GuideWithGame[] {
  const game = getGameBySlug(gameSlug);
  if (!game) return [];

  return game.guides.map((guide) => withGame(guide, game));
}

export function getAllPublishedGuides(): GuideWithGame[] {
  return getAllPublishedGames().flatMap((game) => getPublishedGuidesForGame(game.slug));
}

export function getGuideBySlug(
  gameSlug: string,
  guideSlug: string
): GuideWithGame | undefined {
  return getPublishedGuidesForGame(gameSlug).find((guide) => guide.slug === guideSlug);
}

export async function getRenderedPublishedGuidesForGame(gameSlug: string, locale: string = "en"): Promise<GuideWithGame[]> {
  const guides = getPublishedGuidesForGame(gameSlug);
  return Promise.all(guides.map((guide) => hydrateGuide(guide, locale)));
}

export async function getAllRenderedPublishedGuides(locale: string = "en"): Promise<GuideWithGame[]> {
  const guides = getAllPublishedGuides();
  return Promise.all(guides.map((guide) => hydrateGuide(guide, locale)));
}

export async function getRenderedGuideBySlug(
  gameSlug: string,
  guideSlug: string,
  locale: string = "en"
): Promise<GuideWithGame | undefined> {
  const guide = getGuideBySlug(gameSlug, guideSlug);
  if (!guide) return undefined;

  return hydrateGuide(guide, locale);
}

export function getGameUrl(gameSlug: string, locale: string = "en"): string {
  return locale === "en" ? `/games/${gameSlug}` : `/${locale}/games/${gameSlug}`;
}

export function getGuideUrl(gameSlug: string, guideSlug: string, locale: string = "en"): string {
  return locale === "en" ? `/games/${gameSlug}/${guideSlug}` : `/${locale}/games/${gameSlug}/${guideSlug}`;
}

export function getPublicSitemapUrls(): string[] {
  const gameUrls = getAllPublishedGames().map((game) => getGameUrl(game.slug));
  const guideUrls = getAllPublishedGuides().map((guide) =>
    getGuideUrl(guide.game.slug, guide.slug)
  );
  const zhGameUrls = getAllPublishedGames().map((game) => getGameUrl(game.slug, "zh"));
  const zhGuideUrls = getAllPublishedGuides().map((guide) =>
    getGuideUrl(guide.game.slug, guide.slug, "zh")
  );

  return ["/", "/games", ...gameUrls, ...guideUrls, "/zh", "/zh/games", ...zhGameUrls, ...zhGuideUrls];
}

export function getGuideDescription(guide: GuideWithGame): string {
  return `${guide.summary} Updated ${guide.updatedAt}. Verification: ${guide.verificationStatus}.`;
}
