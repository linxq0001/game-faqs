import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getAllPublishedGames,
  getGameUrl,
  getRenderedPublishedGuidesForGame
} from "@/lib/content";

export default async function GamesPage() {
  const games = getAllPublishedGames();

  return (
    <main className="wrap">
      <SiteHeader />

      <section className="index-hero">
        <span className="kicker">Public Game Index</span>
        <h1>All covered games</h1>
        <p>
          Browse every public Patch Signal game hub and the published guides
          currently attached to it.
        </p>
      </section>

      <section className="game-list" aria-label="Published games">
        {games.length === 0 ? (
          <article className="panel empty-state">
            <span className="kicker">Coverage Paused</span>
            <h2>No public games right now.</h2>
            <p>
              Published game hubs are currently hidden while the next guide set
              is being prepared.
            </p>
          </article>
        ) : null}

        {await Promise.all(games.map(async (game) => {
          const guides = await getRenderedPublishedGuidesForGame(game.slug);

          return (
            <article className="game-index-card panel" key={game.slug}>
              <div className="game-index-head">
                <div>
                  <span className="kicker">{game.coverageStatus}</span>
                  <h2>
                    <Link href={getGameUrl(game.slug)}>{game.title}</Link>
                  </h2>
                  <p>{game.summary}</p>
                </div>
                <div className="game-meta">
                  <span>AppID {game.appid}</span>
                  <span>Updated {game.updatedAt}</span>
                  <span>{guides.length} guides</span>
                </div>
              </div>

              <div className="tag-row" aria-label={`${game.title} tags`}>
                {game.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="compact-guide-grid">
                {guides.map((guide) => (
                  <GuideCard key={`${guide.game.slug}-${guide.slug}`} guide={guide} />
                ))}
              </div>
            </article>
          );
        }))}
      </section>
    </main>
  );
}
