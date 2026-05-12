import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectAnswer } from "@/components/DirectAnswer";
import { RelatedGuides } from "@/components/RelatedGuides";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { guidePageJsonLd } from "@/lib/structured-data";
import { getGuideDisplayTitle } from "@/lib/guide-title";
import {
  getAllPublishedGuides,
  getGameUrl,
  getGuideBySlug,
  getGuideDescription,
  getGuideUrl,
  getRenderedGuideBySlug,
  getRenderedPublishedGuidesForGame
} from "@/lib/content";

const LOCALE = "zh";

type GuidePageProps = {
  params: Promise<{ gameSlug: string; guideSlug: string }>;
};

export function generateStaticParams() {
  return getAllPublishedGuides().map((guide) => ({
    gameSlug: guide.game.slug,
    guideSlug: guide.slug
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { gameSlug, guideSlug } = await params;
  const guide = await getRenderedGuideBySlug(gameSlug, guideSlug, LOCALE);

  if (!guide) {
    return { title: "攻略未找到" };
  }

  return {
    title: `${guide.title}`,
    description: getGuideDescription(guide),
    alternates: {
      canonical: getGuideUrl(gameSlug, guideSlug, LOCALE),
      languages: {
        en: `https://patchsignal.com${getGuideUrl(gameSlug, guideSlug, "en")}`,
      },
    },
    openGraph: {
      title: `${guide.title} | Patch Signal`,
      description: getGuideDescription(guide),
      url: getGuideUrl(gameSlug, guideSlug, LOCALE),
      siteName: "Patch Signal",
      type: "article",
      publishedTime: guide.updatedAt,
      modifiedTime: guide.updatedAt,
      ...(guide.artwork
        ? {
            images: [
              {
                url: guide.artwork.src.startsWith("http")
                  ? guide.artwork.src
                  : `https://patchsignal.com${guide.artwork.src}`,
                width: 1200,
                height: 630,
                alt: guide.artwork.alt
              }
            ]
          }
        : guide.game.artwork
          ? {
              images: [
                {
                  url: guide.game.artwork.src.startsWith("http")
                    ? guide.game.artwork.src
                    : `https://patchsignal.com${guide.game.artwork.src}`,
                  width: 1200,
                  height: 630,
                  alt: guide.game.artwork.alt
                }
              ]
            }
          : {})
    }
  };
}

export default async function ZhGuidePage({ params }: GuidePageProps) {
  const { gameSlug, guideSlug } = await params;
  const guide = await getRenderedGuideBySlug(gameSlug, guideSlug, LOCALE);

  if (!guide) {
    notFound();
  }

  const displayTitle = getGuideDisplayTitle(
    guide.game.title,
    guide.title,
    guide.shortTitle
  );

  const relatedGuides = (await getRenderedPublishedGuidesForGame(gameSlug, LOCALE)).filter(
    (relatedGuide) => relatedGuide.slug !== guide.slug
  );
  const artwork = guide.artwork ?? guide.game.artwork;

  const ldJson = guidePageJsonLd(guide);

  return (
    <main className="wrap">
      <SiteHeader locale="zh" />

      <article className="detail-shell" aria-labelledby="guide-title">
        <div className="detail-paper guide-paper">
          <div className="breadcrumb">
            <Link href="/zh">首页</Link>
            <span>/</span>
            <Link href="/zh/games">游戏</Link>
            <span>/</span>
            <Link href={getGameUrl(guide.game.slug, LOCALE)}>{guide.game.title}</Link>
            <span>/</span>
            <span>{displayTitle}</span>
          </div>

          <span className="kicker">{guide.game.title} 攻略</span>
          <h1 id="guide-title">{displayTitle}</h1>

          <dl className="guide-meta-row" aria-label="Guide details">
            <div>
              <dt>更新于</dt>
              <dd>{guide.updatedAt}</dd>
            </div>
            <div>
              <dt>游戏版本</dt>
              <dd>{guide.gameVersion}</dd>
            </div>
            <div>
              <dt>验证状态</dt>
              <dd>{guide.verificationStatus}</dd>
            </div>
            <div>
              <dt>阅读时间</dt>
              <dd>{guide.readTime}</dd>
            </div>
          </dl>

          {artwork ? (
            <figure className="guide-artwork">
              <img src={artwork.src} alt={artwork.alt} />
              <figcaption>
                {artwork.caption}{" "}
                <a href={artwork.sourceUrl} target="_blank" rel="noreferrer">
                  来源
                </a>
              </figcaption>
            </figure>
          ) : null}

          <DirectAnswer answer={guide.directAnswer} />

          <div className="guide-sections">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                {section.headingLevel === 3 ? (
                  <h3 className="guide-step-title">{section.heading}</h3>
                ) : (
                  <h2>{section.heading}</h2>
                )}
                <p>{section.body}</p>
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <section className="source-notes" aria-labelledby="source-notes-title">
            <h2 id="source-notes-title">来源与更新说明</h2>
            <p>
              最后检查于 {guide.updatedAt}，对应 {guide.gameVersion} 版本。
              验证状态：{guide.verificationStatus}。
            </p>
            <ul>
              {guide.sourceUrls.map((sourceUrl) => (
                <li key={sourceUrl}>
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    {sourceUrl}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <RelatedGuides guides={relatedGuides} />

      <JsonLd data={ldJson.breadcrumbList} />
      <JsonLd data={ldJson.article} />
      {ldJson.faq ? <JsonLd data={ldJson.faq} /> : null}
    </main>
  );
}
