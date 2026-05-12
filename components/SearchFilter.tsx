"use client";

import { useState } from "react";
import { GuideCard } from "./GuideCard";
import type { GuideWithGame } from "@/lib/types";

export function SearchFilter({
  guides,
  locale = "en",
}: {
  guides: GuideWithGame[];
  locale?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? guides.filter(
        (g) =>
          g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.summary.toLowerCase().includes(query.toLowerCase()) ||
          g.game.title.toLowerCase().includes(query.toLowerCase()) ||
          g.type.toLowerCase().includes(query.toLowerCase())
      )
    : guides;

  return (
    <>
      <div className="section-title">
        <span>
          {query.trim()
            ? `Search: "${query.trim()}"`
            : locale === "zh"
              ? "浏览攻略索引"
              : "Browse Guide Index"}
        </span>
        <span>
          {filtered.length}{" "}
          {locale === "zh" ? "个结果" : query.trim() ? "results" : "published"}
        </span>
      </div>
      <form
        className="search-shell"
        style={{ marginBottom: 14 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          placeholder={locale === "zh" ? "搜索攻略..." : "Search guides..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="guide-grid">
        {filtered.map((guide) => (
          <GuideCard
            key={`${guide.game.slug}-${guide.slug}`}
            guide={guide}
            locale={locale}
          />
        ))}
      </div>
    </>
  );
}
