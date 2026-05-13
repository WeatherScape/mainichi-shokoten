import { redirect } from "next/navigation";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { RewardSummary } from "@/components/rewards/RewardSummary";
import { WeekShareCard } from "@/components/rewards/WeekShareCard";
import {
  getProfile,
  getUserArtworks,
  getUserBadges,
  requireSessionUser
} from "@/lib/supabase/queries";
import { calculateArtworkStats, getDisplayName } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const user = await requireSessionUser();
  const [profile, artworks, badges] = await Promise.all([
    getProfile(user.id),
    getUserArtworks(user.id),
    getUserBadges(user.id)
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
          <h1 className="mt-3 text-4xl font-light text-ink">
            {getDisplayName(profile)}の展示室
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            続けるほど、展示室が少しずつ育ちます。
          </p>
        </section>
        <div className="space-y-6">
          <WeekShareCard show={stats.streak >= 7} />
          <RewardSummary
            stats={stats}
            badges={badges.map((badge) => badge.badge_type)}
          />
          <GalleryGrid artworks={artworks} currentUserId={user.id} />
        </div>
      </div>
    </main>
  );
}
