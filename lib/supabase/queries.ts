import { redirect } from "next/navigation";
import { getDailyThemeByDate, getDailyThemeIndex } from "@/data/themes";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEFAULT_THEME_DESCRIPTION } from "@/lib/constants";
import type { Artwork, Material, Profile, Theme } from "@/lib/types";
import { getThemeDateJST } from "@/lib/theme";

export async function getSessionUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getProfile(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data as Profile | null;
}

export async function getTodayTheme() {
  const supabase = createServerSupabaseClient();
  const today = getThemeDateJST();
  const dailyTheme = getDailyThemeByDate(today);
  const { data } = await supabase
    .from("themes")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (data) {
    return {
      ...(data as Theme),
      title: dailyTheme.title,
      description: dailyTheme.description || DEFAULT_THEME_DESCRIPTION
    };
  }

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("date", { ascending: true });

  if (themes?.length) {
    const index = getDailyThemeIndex(today) % themes.length;
    return {
      ...(themes[index] as Theme),
      title: dailyTheme.title,
      description: dailyTheme.description || DEFAULT_THEME_DESCRIPTION,
      date: today
    };
  }

  return {
    id: "demo-theme",
    title: dailyTheme.title,
    description: dailyTheme.description || DEFAULT_THEME_DESCRIPTION,
    date: today,
    created_at: new Date().toISOString()
  };
}

export async function getTheme(themeId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("themes")
    .select("*")
    .eq("id", themeId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const todayTheme = await getTodayTheme();
  if (todayTheme.id === themeId) {
    return todayTheme;
  }

  return data as Theme;
}

export async function getArtworkForTheme(userId: string, themeId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("artworks")
    .select("*")
    .eq("user_id", userId)
    .eq("theme_id", themeId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as Artwork | null;
}

export async function getRecentArtworks(limit = 6) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("artworks")
    .select(
      "*, profiles(id, username, display_name), themes(id, title, date)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Artwork[];
}

export async function getThemeArtworks(themeId: string, material?: Material) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("artworks")
    .select("*, profiles(id, username, display_name), themes(id, title, date)")
    .eq("theme_id", themeId)
    .order("created_at", { ascending: false });

  if (material) {
    query = query.eq("material", material);
  }

  const { data } = await query;
  return (data ?? []) as Artwork[];
}

export async function getUserArtworks(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("artworks")
    .select("*, profiles(id, username, display_name), themes(id, title, date)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as Artwork[];
}

export async function getUserBadges(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("badges")
    .select("badge_type, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: true });

  return data ?? [];
}
