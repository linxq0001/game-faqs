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
  const guide = await getRenderedGuideBySlug(gameSlug, guideSlug);

  if (!guide) {
    return {
      title: "Guide Not Found"
    };
  }

  return {
    title: `${guide.title}`,
    description: getGuideDescription(guide),
    alternates: {
      canonical: getGuideUrl(gameSlug, guideSlug),
      languages: {
        zh: `https://patchsignal.com${getGuideUrl(gameSlug, guideSlug, "zh")}`,
      },
    },
    openGraph: {
      title: `${guide.title} | Patch Signal`,
      description: getGuideDescription(guide),
      url: getGuideUrl(gameSlug, guideSlug),
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

export default async function GuidePage({ params }: GuidePageProps) {
  const { gameSlug, guideSlug } = await params;
  const guide = await getRenderedGuideBySlug(gameSlug, guideSlug);

  if (!guide) {
    notFound();
  }

  const displayTitle = getGuideDisplayTitle(
    guide.game.title,
    guide.title,
    guide.shortTitle
  );

  const relatedGuides = (await getRenderedPublishedGuidesForGame(gameSlug)).filter(
    (relatedGuide) => relatedGuide.slug !== guide.slug
  );
  const artwork = guide.artwork ?? guide.game.artwork;

  return (
    <main className="wrap">
      <SiteHeader />

      <article className="detail-shell" aria-labelledby="guide-title">
        <div className="detail-paper guide-paper">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/games">Games</Link>
            <span>/</span>
            <Link href={getGameUrl(guide.game.slug)}>{guide.game.title}</Link>
            <span>/</span>
            <span>{displayTitle}</span>
          </div>

          <span className="kicker">{guide.game.title} Guide</span>
          <h1 id="guide-title">{displayTitle}</h1>

          <dl className="guide-meta-row" aria-label="Guide details">
            <div>
              <dt>Updated</dt>
              <dd>{guide.updatedAt}</dd>
            </div>
            <div>
              <dt>Game Version</dt>
              <dd>{guide.gameVersion}</dd>
            </div>
            <div>
              <dt>Verification</dt>
              <dd>{guide.verificationStatus}</dd>
            </div>
            <div>
              <dt>Read Time</dt>
              <dd>{guide.readTime}</dd>
            </div>
          </dl>

          {artwork ? (
            <figure className="guide-artwork">
              <img src={artwork.src} alt={artwork.alt} />
              <figcaption>
                {artwork.caption}{" "}
                <a href={artwork.sourceUrl} target="_blank" rel="noreferrer">
                  Source
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
            <h2 id="source-notes-title">Sources And Update Notes</h2>
            <p>
              Last checked {guide.updatedAt} against {guide.gameVersion} coverage.
              Verification status: {guide.verificationStatus}.
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

      <JsonLd data={guidePageJsonLd(guide).breadcrumbList} />
      <JsonLd data={guidePageJsonLd(guide).article} />
      {guidePageJsonLd(guide).faq ? (
        <JsonLd data={guidePageJsonLd(guide).faq} />
      ) : null}
    </main>
  );
}
