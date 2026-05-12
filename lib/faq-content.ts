import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GuideSection, GuideType } from "@/content/games";

type MarkdownArtwork = {
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
};

export type MarkdownGuideContent = {
  title: string;
  shortTitle?: string;
  summary?: string;
  type?: GuideType;
  updatedAt?: string;
  directAnswer: string;
  sections: GuideSection[];
  sourceUrls: string[];
  artwork?: MarkdownArtwork;
};

type SectionDraft = {
  heading: string;
  headingLevel: 2 | 3;
  bodyParts: string[];
  bullets: string[];
};

function parseFrontmatter(raw: string): { attributes: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { attributes: {}, body: raw };
  }

  const attributes: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    attributes[key] = rawValue.replace(/^"(.*)"$/, "$1");
  }

  return {
    attributes,
    body: raw.slice(match[0].length)
  };
}

function stripHeadingMarker(line: string): string {
  return line.replace(/^#+\s*/, "").trim();
}

function appendParagraph(draft: SectionDraft | undefined, value: string): SectionDraft {
  const nextDraft = draft ?? { heading: "", headingLevel: 2, bodyParts: [], bullets: [] };
  nextDraft.bodyParts.push(value);
  return nextDraft;
}

function finalizeSection(
  sections: GuideSection[],
  draft: SectionDraft | undefined
): SectionDraft | undefined {
  if (!draft) return undefined;

  const body = draft.bodyParts.join("\n\n").trim();
  if (!draft.heading || (!body && draft.bullets.length === 0)) {
    return undefined;
  }

  sections.push({
    heading: draft.heading,
    headingLevel: draft.headingLevel,
    body,
    bullets: draft.bullets.length > 0 ? draft.bullets : undefined
  });

  return undefined;
}

function extractUrls(value: string): string[] {
  return value.match(/https?:\/\/\S+/g) ?? [];
}

export const loadMarkdownGuideContent = cache(
  async (relativePath: string): Promise<MarkdownGuideContent> => {
    const absolutePath = path.join(process.cwd(), relativePath);
    const raw = await readFile(absolutePath, "utf8");
    const { attributes, body } = parseFrontmatter(raw);
    const lines = body.split("\n");

    let articleTitle = attributes.title ?? "";
    let currentH2 = "";
    let currentSection: SectionDraft | undefined;
    let directAnswerParts: string[] = [];
    let sourceUrls = attributes.sourceUrl ? [attributes.sourceUrl] : [];
    let inDirectAnswer = false;
    let inSources = false;
    const sections: GuideSection[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith("![")) continue;

      if (line.startsWith("# ")) {
        articleTitle = stripHeadingMarker(line);
        continue;
      }

      if (line.startsWith("## ")) {
        currentSection = finalizeSection(sections, currentSection);
        currentH2 = stripHeadingMarker(line);
        inDirectAnswer = currentH2 === "Direct Answer";
        inSources = currentH2 === "Sources";

        if (!inDirectAnswer && !inSources) {
          currentSection = {
            heading: currentH2,
            headingLevel: 2,
            bodyParts: [],
            bullets: []
          };
        }
        continue;
      }

      if (line.startsWith("### ")) {
        currentSection = finalizeSection(sections, currentSection);
        currentSection = {
          heading: stripHeadingMarker(line),
          headingLevel: 3,
          bodyParts: [],
          bullets: []
        };
        continue;
      }

      if (inSources) {
        sourceUrls.push(...extractUrls(line));
        continue;
      }

      if (inDirectAnswer) {
        directAnswerParts.push(line);
        continue;
      }

      const bulletMatch = line.match(/^(?:-|\d+\.)\s+(.*)$/);
      if (bulletMatch) {
        currentSection = currentSection ?? {
          heading: currentH2,
          headingLevel: 2,
          bodyParts: [],
          bullets: []
        };
        currentSection.bullets.push(bulletMatch[1].trim());
        continue;
      }

      currentSection = appendParagraph(currentSection ?? {
        heading: currentH2,
        headingLevel: 2,
        bodyParts: [],
        bullets: []
      }, line);
    }

    finalizeSection(sections, currentSection);

    const uniqueSourceUrls = [...new Set(sourceUrls)];
    const artwork =
      attributes.image && attributes.imageAlt && attributes.sourceUrl
        ? {
            src: attributes.image,
            alt: attributes.imageAlt,
            caption: "Official artwork used in the FAQ source file.",
            sourceUrl: attributes.sourceUrl
          }
        : undefined;

    return {
      title: articleTitle,
      shortTitle: attributes.shortTitle,
      summary: attributes.summary,
      type: attributes.type as GuideType | undefined,
      updatedAt: attributes.updatedAt,
      directAnswer: directAnswerParts.join(" ").trim(),
      sections,
      sourceUrls: uniqueSourceUrls,
      artwork
    };
  }
);
