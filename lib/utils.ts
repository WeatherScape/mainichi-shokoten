import { clsx, type ClassValue } from "clsx";
import { BADGE_RULES, FRAME_STYLES } from "@/lib/constants";
import type { Artwork, ArtworkStats, FrameStyle } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getTokyoDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function formatDateJa(value: string | Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).format(typeof value === "string" ? new Date(value) : value);
}

function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calculateArtworkStats(artworks: Pick<Artwork, "created_at">[]): ArtworkStats {
  const total = artworks.length;
  const daySet = new Set(
    artworks.map((artwork) => getTokyoDateKey(new Date(artwork.created_at)))
  );
  let streak = 0;
  let cursor = getTokyoDateKey();

  while (daySet.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return { total, streak };
}

export function getUnlockedFrames(stats: ArtworkStats): FrameStyle[] {
  return FRAME_STYLES.filter((frame) => {
    const totalOk = !frame.requiredTotal || stats.total >= frame.requiredTotal;
    const streakOk = !frame.requiredStreak || stats.streak >= frame.requiredStreak;
    return totalOk && streakOk;
  }).map((frame) => frame.id);
}

export function getEarnedBadges(stats: ArtworkStats) {
  return BADGE_RULES.filter((badge) => {
    const totalOk = !badge.requiredTotal || stats.total >= badge.requiredTotal;
    const streakOk = !badge.requiredStreak || stats.streak >= badge.requiredStreak;
    return totalOk && streakOk;
  });
}

export function frameClassName(frameStyle: FrameStyle) {
  const map: Record<FrameStyle, string> = {
    blank: "frame-blank",
    wood: "frame-wood",
    mat: "frame-mat",
    black: "frame-black",
    museum: "frame-museum"
  };
  return map[frameStyle];
}

export function getDisplayName(profile?: { display_name?: string | null; username?: string | null }) {
  return profile?.display_name || profile?.username || "名もなき展示者";
}
