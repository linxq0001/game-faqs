import type { GuideWithGame, PublishedGame } from "./content";
import { getGameUrl, getGuideUrl } from "./content";
import { getGuideDisplayTitle } from "./guide-title";

const SITE_URL = "https://patchsignal.com";
const SITE_NAME = "Patch Signal";

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Fast English guides for fresh Steam and indie games before the wiki exists.",
  };
}

export function gameHubJsonLd(game: PublishedGame) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: `${SITE_URL}${getGameUrl(game.slug)}`,
    description: game.summary,
    applicationCategory: "Game",
    ...(game.artwork
      ? {
          image: game.artwork.src.startsWith("http")
            ? game.artwork.src
            : `${SITE_URL}${game.artwork.src}`,
        }
      : {}),
  };
}

export function guidePageJsonLd(guide: GuideWithGame) {
  const displayTitle = getGuideDisplayTitle(
    guide.game.title,
    guide.title,
    guide.shortTitle
  );
  const guideUrl = `${SITE_URL}${getGuideUrl(guide.game.slug, guide.slug)}`;
  const gameUrl = `${SITE_URL}${getGameUrl(guide.game.slug)}`;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Games",
        item: `${SITE_URL}/games`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.game.title,
        item: gameUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: displayTitle,
        item: guideUrl,
      },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayTitle,
    description: guide.summary,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    url: guideUrl,
    ...(guide.artwork
      ? {
          image: guide.artwork.src.startsWith("http")
            ? guide.artwork.src
            : `${SITE_URL}${guide.artwork.src}`,
        }
      : guide.game.artwork
        ? {
            image: guide.game.artwork.src.startsWith("http")
              ? guide.game.artwork.src
              : `${SITE_URL}${guide.game.artwork.src}`,
          }
        : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  const faq = guide.directAnswer
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the quick answer for ${displayTitle}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: guide.directAnswer,
            },
          },
        ],
      }
    : null;

  return { breadcrumbList, article, faq };
}
