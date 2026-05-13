import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Artwork } from "@/lib/types";

export function GalleryGrid({
  artworks,
  currentUserId,
  locked = false
}: {
  artworks: Artwork[];
  currentUserId?: string | null;
  locked?: boolean;
}) {
  if (artworks.length === 0) {
    return (
      <EmptyState
        title="まだ、壁は静かです。"
        body="このテーマに作品が飾られると、ここに少しずつ並びます。"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          currentUserId={currentUserId}
          locked={locked}
        />
      ))}
    </div>
  );
}
