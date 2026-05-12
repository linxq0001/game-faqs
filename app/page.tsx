import type { Metadata } from "next";
import Link from "next/link";
import { DirectAnswer } from "@/components/DirectAnswer";
import { GuideCard } from "@/components/GuideCard";
import { IntentFilter } from "@/components/IntentFilter";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { JsonLd } from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structured-data";
import { getAllRenderedPublishedGuides, getGuideUrl } from "@/lib/content";
import { getGuideDisplayTitle } from "@/lib/guide-title";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://patchsignal.com/art/bsg/official-game-hub.jpg",
        width: 1200,
        height: 630,
        alt: "Patch Signal - Steam and Indie Game Guides"
      }
    ]
  }
};

export default async function HomePage() {
  const guides = await getAllRenderedPublishedGuides();
  const featuredGuide = guides[0];
  const readingLinks = guides.slice(0, 4);

  return (
    <main className="wrap">
      <SiteHeader />

      <section className="home-hero">
        <div className="hero-copy">
          <span className="kicker">Steam / Indie Guide Index</span>
          <h1>Fast answers for games before the wiki catches up.</h1>
          <p>
            Patch Signal is a reading-first guide index for new Steam and indie
            games: direct answers, early routes, resource notes, and practical
            checks that get updated as coverage improves.
          </p>
        </div>

        <aside className="hero-answer panel" aria-label="Featured direct answer">
          {featuredGuide ? (
            <>
              <span className="kicker">Featured Answer</span>
              <h2>
                {getGuideDisplayTitle(
                  featuredGuide.game.title,
                  featuredGuide.title,
                  featuredGuide.shortTitle
                )}
              </h2>
              <DirectAnswer answer={featuredGuide.directAnswer} />
              <Link
                className="text-link"
                href={getGuideUrl(featuredGuide.game.slug, featuredGuide.slug)}
              >
                Read the full guide
              </Link>
            </>
          ) : (
            <p>No published guides yet.</p>
          )}
        </aside>
      </section>

      <section className="reading-strip panel" aria-label="Reading links">
        <span className="kicker">Start Reading</span>
        <div className="reading-links">
          {readingLinks.length === 0 ? (
            <p className="muted-note">Public guide links are hidden for now.</p>
          ) : null}
          {readingLinks.map((guide) => (
            <Link key={`${guide.game.slug}-${guide.slug}`} href={getGuideUrl(guide.game.slug, guide.slug)}>
              <span>{guide.game.title}</span>
              {getGuideDisplayTitle(guide.game.title, guide.title, guide.shortTitle)}
            </Link>
          ))}
        </div>
      </section>

      <section className="index-layout" aria-label="Browse guide index">
        <IntentFilter guides={guides} />

        <div>
          <SearchFilter guides={guides} />
        </div>
      </section>

      <JsonLd data={homeJsonLd()} />
    </main>
  );
}
