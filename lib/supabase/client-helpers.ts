"use client";

import { BADGE_RULES } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ArtworkStats } from "@/lib/types";

export async function ensureClientProfile(params: {
  userId: string;
  displayName: string;
  username?: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const safeName = params.displayName.trim().slice(0, 24) || "展示者";
  const username =
    params.username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) ||
    `room_${params.userId.slice(0, 8)}`;

  const { error } = await supabase.from("profiles").upsert({
    id: params.userId,
    username,
    display_name: safeName
  });

  if (error) {
    throw new Error(`展示室の名前を保存できませんでした: ${error.message}`);
  }
}

export async function syncEarnedBadges(userId: string, stats: ArtworkStats) {
  const supabase = createBrowserSupabaseClient();
  const earned = BADGE_RULES.filter((badge) => {
    const totalOk = !badge.requiredTotal || stats.total >= badge.requiredTotal;
    const streakOk = !badge.requiredStreak || stats.streak >= badge.requiredStreak;
    return totalOk && streakOk;
  });

  if (earned.length === 0) {
    return;
  }

  const { error } = await supabase.from("badges").upsert(
    earned.map((badge) => ({
      user_id: userId,
      badge_type: badge.type
    })),
    { onConflict: "user_id,badge_type" }
  );

  if (error) {
    throw new Error(`バッジを保存できませんでした: ${error.message}`);
  }
}
