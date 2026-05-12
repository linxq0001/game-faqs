import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { gameHubJsonLd } from "@/lib/structured-data";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/GuideCard";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getAllPublishedGames,
  getGameUrl,
  getGameBySlug,
  getRenderedPublishedGuidesForGame
} from "@/lib/content";

type GamePageProps = {
  params: Promise<{ gameSlug: string }>;
};

export function generateStaticParams() {
  return getAllPublishedGames().map((game) => ({
    gameSlug: game.slug
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { gameSlug } = await params;
  const game = getGameBySlug(gameSlug);

  if (!game) {
    return {
      title: "Game Not Found"
    };
  }

  return {
    title: `${game.title} Guides`,
    description: game.summary,
    alternates: {
      canonical: getGameUrl(game.slug),
      languages: {
        zh: `https://patchsignal.com${getGameUrl(game.slug, "zh")}`,
      },
    },
    openGraph: {
      title: `${game.title} Guides | Patch Signal`,
      description: game.summary,
      url: getGameUrl(game.slug),
      siteName: "Patch Signal",
      type: "article",
      ...(game.artwork
        ? {
            images: [
              {
                url: game.artwork.src.startsWith("http")
                  ? game.artwork.src
                  : `https://patchsignal.com${game.artwork.src}`,
                width: 1200,
                height: 630,
                alt: game.artwork.alt
              }
            ]
          }
        : {})
    }
  };
}

export default async function GameHubPage({ params }: GamePageProps) {
  const { gameSlug } = await params;
  const game = getGameBySlug(gameSlug);

  if (!game) {
    notFound();
  }

  const guides = await getRenderedPublishedGuidesForGame(game.slug);

  return (
    <main className="wrap">
      <SiteHeader />

      <section className="detail-shell" aria-labelledby="game-title">
        <div className="detail-paper game-hub-paper">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/games">Games</Link>
            <span>/</span>
            <span>{game.title}</span>
          </div>

          <div className="game-hub-overview">
            <div className="game-hub-copy">
              <StatusBadge>{game.coverageStatus}</StatusBadge>
              <h1 id="game-title">{game.title}</h1>
              <p className="detail-summary">{game.summary}</p>

              <dl className="detail-meta-grid" aria-label={`${game.title} details`}>
                <div>
                  <dt>Coverage</dt>
                  <dd>{game.coverageStatus}</dd>
                </div>
                <div>
                  <dt>Steam AppID</dt>
                  <dd>{game.appid}</dd>
                </div>
                <div>
                  <dt>Release Date</dt>
                  <dd>{game.releaseDate}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{game.updatedAt}</dd>
                </div>
              </dl>
            </div>

            <div className="game-hub-side">
              {game.artwork ? (
                <figure className="hub-artwork pixel-frame">
                  <img src={game.artwork.src} alt={game.artwork.alt} />
                  <figcaption>{game.artwork.caption}</figcaption>
                </figure>
              ) : null}

              <div className="tag-row detail-tags" aria-label={`${game.title} tags`}>
                {game.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="detail-actions">
                <a href={game.steamUrl} target="_blank" rel="noreferrer">
                  Open Steam Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="published-guides-title">
        <div className="section-title">
          <span id="published-guides-title">Published Guides</span>
          <span>{guides.length} live</span>
        </div>
        <div className="guide-grid">
          {guides.map((guide) => (
            <GuideCard key={`${guide.game.slug}-${guide.slug}`} guide={guide} />
          ))}
        </div>
      </section>
    <JsonLd data={gameHubJsonLd(game)} />
    </main>
  );
}
