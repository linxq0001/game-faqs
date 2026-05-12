import type { Metadata } from "next";
import Link from "next/link";
import { DirectAnswer } from "@/components/DirectAnswer";
import { GuideCard } from "@/components/GuideCard";
import { IntentFilter } from "@/components/IntentFilter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllRenderedPublishedGuides, getGuideUrl } from "@/lib/content";
import { getGuideDisplayTitle } from "@/lib/guide-title";
import { JsonLd } from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structured-data";

const LOCALE = "zh";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "https://patchsignal.com",
    },
  },
  openGraph: {
    images: [
      {
        url: "https://patchsignal.com/art/bsg/official-game-hub.jpg",
        width: 1200,
        height: 630,
        alt: "Patch Signal - Steam 和独立游戏攻略"
      }
    ]
  }
};

export default async function ZhHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const allGuides = await getAllRenderedPublishedGuides(LOCALE);
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const guides = query
    ? allGuides.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.summary.toLowerCase().includes(query) ||
          g.game.title.toLowerCase().includes(query) ||
          g.type.toLowerCase().includes(query)
      )
    : allGuides;
  const featuredGuide = guides[0];
  const readingLinks = guides.slice(0, 4);

  return (
    <main className="wrap">
      <SiteHeader locale="zh" />

      <section className="home-hero">
        <div className="hero-copy">
          <span className="kicker">Steam / 独立游戏攻略索引</span>
          <h1>在 Wiki 追上来之前，最快获取游戏答案。</h1>
          <p>
            Patch Signal 是一个以阅读为主的攻略索引站，覆盖新上线的 Steam
            和独立游戏：直接答案、开局路线、资源笔记、实战检查，随覆盖率提升持续更新。
          </p>
        </div>

        <aside className="hero-answer panel" aria-label="Featured direct answer">
          {featuredGuide ? (
            <>
              <span className="kicker">精选答案</span>
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
                href={getGuideUrl(featuredGuide.game.slug, featuredGuide.slug, LOCALE)}
              >
                阅读完整攻略
              </Link>
            </>
          ) : (
            <p>暂无已发布攻略。</p>
          )}
        </aside>
      </section>

      <section className="reading-strip panel" aria-label="Reading links">
        <span className="kicker">开始阅读</span>
        <div className="reading-links">
          {readingLinks.length === 0 ? (
            <p className="muted-note">公开攻略链接暂未开放。</p>
          ) : null}
          {readingLinks.map((guide) => (
            <Link key={`${guide.game.slug}-${guide.slug}`} href={getGuideUrl(guide.game.slug, guide.slug, LOCALE)}>
              <span>{guide.game.title}</span>
              {getGuideDisplayTitle(guide.game.title, guide.title, guide.shortTitle)}
            </Link>
          ))}
        </div>
      </section>

      <section className="index-layout" aria-label="Browse guide index">
        <IntentFilter guides={guides} />

        <div>
          <div className="section-title">
            <span>{query ? `搜索: "${q}"` : "浏览攻略索引"}</span>
            <span>{guides.length} 个结果</span>
          </div>
          <div className="guide-grid">
            {guides.map((guide) => (
              <GuideCard key={`${guide.game.slug}-${guide.slug}`} guide={guide} locale="zh" />
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={homeJsonLd()} />
    </main>
  );
}
