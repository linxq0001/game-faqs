import type { MetadataRoute } from "next";

import { getAllRenderedPublishedGuides } from "@/lib/content";

const siteUrl = "https://patchsignal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = await getAllRenderedPublishedGuides();
  const zhGuides = await getAllRenderedPublishedGuides("zh");

  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  entries.push({ url: siteUrl, lastModified: new Date() });
  entries.push({ url: `${siteUrl}/games`, lastModified: new Date() });
  entries.push({ url: `${siteUrl}/zh`, lastModified: new Date() });
  entries.push({ url: `${siteUrl}/zh/games`, lastModified: new Date() });

  // Game hubs
  const gameSlugs = new Set<string>();
  for (const guide of guides) {
    if (!gameSlugs.has(guide.game.slug)) {
      gameSlugs.add(guide.game.slug);
      entries.push({
        url: `${siteUrl}/games/${guide.game.slug}`,
        lastModified: new Date(guide.updatedAt)
      });
      entries.push({
        url: `${siteUrl}/zh/games/${guide.game.slug}`,
        lastModified: new Date(guide.updatedAt)
      });
    }
  }

  // EN guides
  for (const guide of guides) {
    entries.push({
      url: `${siteUrl}/games/${guide.game.slug}/${guide.slug}`,
      lastModified: new Date(guide.updatedAt)
    });
  }

  // ZH guides
  for (const guide of zhGuides) {
    entries.push({
      url: `${siteUrl}/zh/games/${guide.game.slug}/${guide.slug}`,
      lastModified: new Date(guide.updatedAt)
    });
  }

  return entries;
}
