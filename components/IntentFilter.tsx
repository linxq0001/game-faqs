import type { GuideWithGame } from "@/lib/types";

const labels: Record<string, string> = {
  beginner: "Beginner",
  tips: "Tips",
  crafting: "Crafting",
  resources: "Resources",
  boss: "Bosses",
  achievements: "Achievements",
  settings: "Settings",
  map: "Map",
  faq: "FAQ",
  "system-requirements": "System Requirements"
};

export function IntentFilter({ guides }: { guides: GuideWithGame[] }) {
  const counts = guides.reduce<Record<string, number>>((acc, guide) => {
    acc[guide.type] = (acc[guide.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="intent-filter panel">
      <h2>Filter by intent</h2>
      {Object.entries(counts).map(([type, count]) => (
        <div className="filter-row" key={type}>
          <span>{labels[type] ?? type}</span>
          <b>{count.toString().padStart(2, "0")}</b>
        </div>
      ))}
    </aside>
  );
}
