const deckAccents = [
  {
    badgeClassName: "bg-[#205781]/10 text-[#205781]",
    borderClassName: "border-[#205781]/15",
    glowClassName:
      "bg-[radial-gradient(circle_at_top_right,rgba(32,87,129,0.24),transparent_45%)]",
    surfaceClassName:
      "bg-[linear-gradient(180deg,rgba(203,231,255,0.82),rgba(255,255,255,0.96))]",
  },
  {
    badgeClassName: "bg-[#f08a5d]/12 text-[#b45309]",
    borderClassName: "border-[#f08a5d]/18",
    glowClassName:
      "bg-[radial-gradient(circle_at_top_right,rgba(240,138,93,0.24),transparent_45%)]",
    surfaceClassName:
      "bg-[linear-gradient(180deg,rgba(255,229,214,0.86),rgba(255,255,255,0.96))]",
  },
  {
    badgeClassName: "bg-[#7c3aed]/10 text-[#6d28d9]",
    borderClassName: "border-[#7c3aed]/15",
    glowClassName:
      "bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_45%)]",
    surfaceClassName:
      "bg-[linear-gradient(180deg,rgba(237,233,254,0.82),rgba(255,255,255,0.96))]",
  },
  {
    badgeClassName: "bg-[#0f766e]/10 text-[#0f766e]",
    borderClassName: "border-[#0f766e]/15",
    glowClassName:
      "bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.2),transparent_45%)]",
    surfaceClassName:
      "bg-[linear-gradient(180deg,rgba(204,251,241,0.8),rgba(255,255,255,0.96))]",
  },
] as const;

const deckEmojis = ["📘", "🌍", "🧠", "🪄", "🦊", "🎧", "🧩", "🚀"] as const;

function getSeed(value: number | string) {
  return String(value)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getDeckPresentation(value: number | string) {
  const seed = getSeed(value);

  return {
    ...deckAccents[seed % deckAccents.length],
    emoji: deckEmojis[seed % deckEmojis.length],
  };
}

export function getLanguagePairLabel(sourceLanguage: string, targetLanguage: string) {
  return `${sourceLanguage.toUpperCase()} -> ${targetLanguage.toUpperCase()}`;
}
