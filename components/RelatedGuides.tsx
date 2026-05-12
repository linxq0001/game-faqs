import Link from "next/link";
import type { GuideWithGame } from "@/lib/content";
import { getGuideUrl } from "@/lib/content";
import { getGuideDisplayTitle } from "@/lib/guide-title";

export function RelatedGuides({ guides }: { guides: GuideWithGame[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="related-guides panel">
      <h2>Related guides</h2>
      <div className="related-list">
        {guides.map((guide) => (
          <Link
            href={getGuideUrl(guide.game.slug, guide.slug)}
            key={`${guide.game.slug}/${guide.slug}`}
          >
            <span className="mini-icon" aria-hidden="true" />
            <span>{getGuideDisplayTitle(guide.game.title, guide.title, guide.shortTitle)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
