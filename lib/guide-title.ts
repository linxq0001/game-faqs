function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function trimGuideTitle(gameTitle: string, guideTitle: string): string {
  const pattern = new RegExp(`^${escapeRegExp(gameTitle)}(?:\\s*[:\\-\\/|]\\s*|\\s+)`, "i");

  if (!pattern.test(guideTitle)) {
    return guideTitle;
  }

  const nextTitle = guideTitle.replace(pattern, "").trim();
  return nextTitle || guideTitle;
}

export function getGuideDisplayTitle(
  gameTitle: string,
  guideTitle: string,
  shortTitle?: string
): string {
  return shortTitle?.trim() || trimGuideTitle(gameTitle, guideTitle);
}
