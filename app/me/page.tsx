import { redirect } from "next/navigation";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { RoomGrowthPanel } from "@/components/room/RoomGrowthPanel";
import { RewardSummary } from "@/components/rewards/RewardSummary";
import { WeekShareCard } from "@/components/rewards/WeekShareCard";
import {
  getProfile,
  getTodayTheme,
  getUserArtworks,
  getUserBadges,
  requireSessionUser
} from "@/lib/supabase/queries";
import { calculateArtworkStats, getDisplayName } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const user = await requireSessionUser();
  const [profile, artworks, badges, todayTheme] = await Promise.all([
    getProfile(user.id),
    getUserArtworks(user.id),
    getUserBadges(user.id),
    getTodayTheme()
  ]);

  if (!profile) {
    redirect("/login");
  }

  const stats = calculateArtworkStats(artworks);

  return (
    <main className="wall-band min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="mb-8 border-b border-line pb-8">
          <p className="text-sm text-muted">my room</p>
          <h1 className="mt-3 text-4xl font-light leading-tight text-ink">
            {getDisplayName(profile)}の展示室
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            続けるほど、展示室が少しずつ育ちます。今日の一枚、解放された額縁、
            積み重なった壁をここで眺めます。
          </p>
        </section>
        <div className="space-y-6">
          <WeekShareCard show={stats.streak >= 7} />
          <RoomGrowthPanel artworks={artworks} stats={stats} todayTheme={todayTheme} />
          <RewardSummary
            stats={stats}
            badges={badges.map((badge) => badge.badge_type)}
          />
          <section className="pt-2">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">room archive</p>
                <h2 className="mt-2 text-3xl font-light text-ink">飾ってきた作品</h2>
              </div>
            </div>
          </section>
          <GalleryGrid artworks={artworks} currentUserId={user.id} />
        </div>
      </div>
    </main>
  );
}
