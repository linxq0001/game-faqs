import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/GuideCard";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { JsonLd } from "@/components/JsonLd";
import { gameHubJsonLd } from "@/lib/structured-data";
import {
  getAllPublishedGames,
  getGameUrl,
  getGameBySlug,
  getRenderedPublishedGuidesForGame
} from "@/lib/content";

const LOCALE = "zh";

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
    return { title: "游戏未找到" };
  }

  return {
    title: `${game.title} 攻略`,
    description: game.summary,
    alternates: {
      canonical: getGameUrl(game.slug, LOCALE),
      languages: {
        en: `https://patchsignal.com${getGameUrl(game.slug, "en")}`,
      },
    },
    openGraph: {
      title: `${game.title} 攻略 | Patch Signal`,
      description: game.summary,
      url: getGameUrl(game.slug, LOCALE),
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

export default async function ZhGameHubPage({ params }: GamePageProps) {
  const { gameSlug } = await params;
  const game = getGameBySlug(gameSlug);

  if (!game) {
    notFound();
  }

  const guides = await getRenderedPublishedGuidesForGame(game.slug, LOCALE);

  return (
    <main className="wrap">
      <SiteHeader locale="zh" />

      <section className="detail-shell" aria-labelledby="game-title">
        <div className="detail-paper game-hub-paper">
          <div className="breadcrumb">
            <Link href="/zh">首页</Link>
            <span>/</span>
            <Link href="/zh/games">游戏</Link>
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
                  <dt>收录状态</dt>
                  <dd>{game.coverageStatus}</dd>
                </div>
                <div>
                  <dt>Steam AppID</dt>
                  <dd>{game.appid}</dd>
                </div>
                <div>
                  <dt>发布日期</dt>
                  <dd>{game.releaseDate}</dd>
                </div>
                <div>
                  <dt>更新于</dt>
                  <dd>{game.updatedAt}</dd>
                </div>
              </dl>

              <div className="detail-actions">
                <a href={game.steamUrl} target="_blank" rel="noreferrer">
                  打开 Steam 页面
                </a>
              </div>

              <div className="tag-row detail-tags" aria-label={`${game.title} tags`}>
                {game.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            {game.artwork ? (
              <figure className="hub-artwork pixel-frame">
                <img src={game.artwork.src} alt={game.artwork.alt} />
                <figcaption>{game.artwork.caption}</figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="published-guides-title">
        <div className="section-title">
          <span id="published-guides-title">已发布攻略</span>
          <span>{guides.length} 篇在线</span>
        </div>
        <div className="guide-grid">
          {guides.map((guide) => (
            <GuideCard key={`${guide.game.slug}-${guide.slug}`} guide={guide} locale="zh" />
          ))}
        </div>
      </section>

      <JsonLd data={gameHubJsonLd(game)} />
    </main>
  );
}
