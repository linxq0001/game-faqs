import type { GameArtwork } from "@/content/games";

/** Minimal client-safe type for guide card rendering */
export type GuideWithGame = {
  slug: string;
  title: string;
  shortTitle?: string;
  type: string;
  status: "published";
  summary: string;
  directAnswer: string;
  updatedAt: string;
  gameVersion: string;
  verificationStatus: string;
  readTime: string;
  sourceUrls: string[];
  sections: { heading: string; headingLevel?: 2 | 3; body: string; bullets?: string[] }[];
  artwork?: GameArtwork;
  game: {
    title: string;
    slug: string;
    steamUrl: string;
    appid: string;
    tags: string[];
    artwork?: GameArtwork;
  };
};

export function getGameUrl(gameSlug: string, locale: string = "en"): string {
  return locale === "en" ? `/games/${gameSlug}` : `/${locale}/games/${gameSlug}`;
}

export function getGuideUrl(gameSlug: string, guideSlug: string, locale: string = "en"): string {
  return locale === "en" ? `/games/${gameSlug}/${guideSlug}` : `/${locale}/games/${gameSlug}/${guideSlug}`;
}
