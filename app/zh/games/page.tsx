import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getAllPublishedGames,
  getGameUrl,
  getRenderedPublishedGuidesForGame
} from "@/lib/content";

const LOCALE = "zh";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "https://patchsignal.com/games",
    },
  },
};

export default async function ZhGamesPage() {
  const games = getAllPublishedGames();

  return (
    <main className="wrap">
      <SiteHeader locale="zh" />

      <section className="index-hero">
        <span className="kicker">公开游戏索引</span>
        <h1>所有已收录游戏</h1>
        <p>
          浏览所有公开的 Patch Signal 游戏中心及其已发布的攻略。
        </p>
      </section>

      <section className="game-list" aria-label="Published games">
        {games.length === 0 ? (
          <article className="panel empty-state">
            <span className="kicker">暂停收录</span>
            <h2>暂无公开游戏。</h2>
            <p>
              公开游戏中心当前处于隐藏状态，下一批攻略正在准备中。
            </p>
          </article>
        ) : null}

        {await Promise.all(games.map(async (game) => {
          const guides = await getRenderedPublishedGuidesForGame(game.slug, LOCALE);

          return (
            <article className="game-index-card panel" key={game.slug}>
              <div className="game-index-head">
                <div>
                  <span className="kicker">{game.coverageStatus}</span>
                  <h2>
                    <Link href={getGameUrl(game.slug, LOCALE)}>{game.title}</Link>
                  </h2>
                  <p>{game.summary}</p>
                </div>
                <div className="game-meta">
                  <span>AppID {game.appid}</span>
                  <span>更新于 {game.updatedAt}</span>
                  <span>{guides.length} 篇攻略</span>
                </div>
              </div>

              <div className="tag-row" aria-label={`${game.title} tags`}>
                {game.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="compact-guide-grid">
                {guides.map((guide) => (
                  <GuideCard key={`${guide.game.slug}-${guide.slug}`} guide={guide} locale="zh" />
                ))}
              </div>
            </article>
          );
        }))}
      </section>
    </main>
  );
}
