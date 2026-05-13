import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { RewardSummary } from "@/components/rewards/RewardSummary";
import {
  getProfile,
  getSessionUser,
  getUserArtworks,
  getUserBadges
} from "@/lib/supabase/queries";
import { calculateArtworkStats, getDisplayName } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RoomPage({ params }: { params: { userId: string } }) {
  const [profile, user, artworks, badges] = await Promise.all([
    getProfile(params.userId),
    getSessionUser(),
    getUserArtworks(params.userId),
    getUserBadges(params.userId)
  ]);

  if (!profile) {
    notFound();
  }

  const stats = calculateArtworkStats(artworks);

  return (
    <main className="wall-band min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="mb-8 border-b border-line pb-8">
          <p className="text-sm text-muted">small private exhibition</p>
          <h1 className="mt-3 text-4xl font-light text-ink">
            {getDisplayName(profile)}の展示室
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            白い壁に、描いた日々が少しずつ並んでいます。
          </p>
        </section>
        <div className="mb-8">
          <RewardSummary
            stats={stats}
            badges={badges.map((badge) => badge.badge_type)}
          />
        </div>
        <GalleryGrid artworks={artworks} currentUserId={user?.id} />
      </div>
    </main>
  );
}
