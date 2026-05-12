import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DirectAnswer } from "@/components/DirectAnswer";
import { GuideCard } from "@/components/GuideCard";
import { IntentFilter } from "@/components/IntentFilter";
import { RelatedGuides } from "@/components/RelatedGuides";
import { SiteHeader } from "@/components/SiteHeader";
import type { GuideWithGame } from "@/lib/content";

const mockGuide: GuideWithGame = {
  slug: "beginner-guide",
  title: "Mock Beginner Guide",
  shortTitle: "Beginner Guide",
  type: "beginner",
  status: "published",
  summary: "A compact mock guide for rendering tests.",
  directAnswer: "Build storage before combat upgrades.",
  updatedAt: "2026-05-11",
  gameVersion: "Launch",
  verificationStatus: "researched",
  readTime: "4 min read",
  sourceUrls: ["https://example.com"],
  sections: [{ heading: "Start", body: "Start with basics." }],
  game: {
    title: "Mock Game",
    slug: "mock-game",
    steamUrl: "https://example.com/mock-game",
    appid: "mock",
    tags: ["Crafting"]
  }
};

const craftingGuide: GuideWithGame = {
  ...mockGuide,
  slug: "crafting-route",
  title: "Mock Crafting Route",
  shortTitle: "Crafting Route",
  type: "crafting"
};

const resourcesGuide: GuideWithGame = {
  ...mockGuide,
  slug: "resource-route",
  title: "Mock Resource Route",
  shortTitle: "Resource Route",
  type: "resources"
};

const systemGuide: GuideWithGame = {
  ...mockGuide,
  slug: "system-requirements",
  title: "Mock System Requirements",
  shortTitle: "System Requirements",
  type: "system-requirements"
};

describe("guide UI components", () => {
  it("renders direct answers with an accessible label", () => {
    render(<DirectAnswer answer="Build storage before combat upgrades." />);

    const answer = screen.getByRole("region", { name: /direct answer/i });
    expect(answer).toHaveTextContent("Direct Answer");
    expect(answer).toHaveTextContent("Build storage before combat upgrades.");
  });

  it("renders the site header with a real search box", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: /patch signal home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("searchbox", { name: /search guides/i })).toBeInTheDocument();
  });

  it("renders guide cards with metadata", () => {
    render(<GuideCard guide={mockGuide} />);

    expect(screen.getByRole("link", { name: /Beginner Guide/i })).toHaveAttribute(
      "href",
      "/games/mock-game/beginner-guide"
    );
    expect(screen.getByText("Mock Game / beginner")).toBeInTheDocument();
    expect(screen.getByText("Updated 2026-05-11")).toBeInTheDocument();
  });

  it("strips repeated game names from guide card titles", () => {
    render(
      <GuideCard
        guide={{
          ...mockGuide,
          shortTitle: undefined,
          title: "Mock Game Opening Route Guide"
        }}
      />
    );

    expect(screen.getByRole("link", { name: "Opening Route Guide" })).toHaveAttribute(
      "href",
      "/games/mock-game/beginner-guide"
    );
  });

  it("renders intent filters from published guides with counts", () => {
    render(
      <IntentFilter
        guides={[
          mockGuide,
          { ...mockGuide, slug: "beginner-2" },
          craftingGuide,
          resourcesGuide,
          systemGuide
        ]}
      />
    );

    expect(screen.getByText("Beginner").closest(".filter-row")).toHaveTextContent("02");
    expect(screen.getByText("Crafting").closest(".filter-row")).toHaveTextContent("01");
    expect(screen.getByText("Resources").closest(".filter-row")).toHaveTextContent("01");
    expect(screen.getByText("System Requirements").closest(".filter-row")).toHaveTextContent("01");
  });

  it("renders related guide links when related guides exist", () => {
    render(<RelatedGuides guides={[craftingGuide]} />);

    expect(screen.getByRole("link", { name: /Crafting Route/i }))
      .toHaveAttribute("href", "/games/mock-game/crafting-route");
  });

  it("returns no related guide markup when no related guides exist", () => {
    const { container } = render(<RelatedGuides guides={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
