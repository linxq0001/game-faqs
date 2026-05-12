import Link from "next/link";
import type { GuideWithGame } from "@/lib/content";
import { getGuideUrl } from "@/lib/content";
import { getGuideDisplayTitle } from "@/lib/guide-title";
import { StatusBadge } from "./StatusBadge";

export function GuideCard({ guide, locale = "en" }: { guide: GuideWithGame; locale?: string }) {
  const cardTitle = getGuideDisplayTitle(guide.game.title, guide.title, guide.shortTitle);
  const artwork = guide.artwork ?? guide.game.artwork;

  return (
    <Link
      href={getGuideUrl(guide.game.slug, guide.slug, locale)}
      className="guide-card guide-card-link"
      aria-label={cardTitle}
    >
      <div className="guide-card-top">
        <div className="guide-card-copy">
          <StatusBadge>
            {guide.game.title} / {guide.type}
          </StatusBadge>
          <h3>{cardTitle}</h3>
          <p>{guide.summary}</p>
        </div>

        {artwork ? (
          <div className="guide-card-art" aria-hidden="true">
            <img src={artwork.src} alt="" />
          </div>
        ) : null}
      </div>

      <div className="card-meta">
        <span>Updated {guide.updatedAt}</span>
        <span>{guide.readTime}</span>
      </div>
    </Link>
  );
}