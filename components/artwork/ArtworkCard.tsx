import Image from "next/image";
import Link from "next/link";
import { FrameShell } from "@/components/artwork/FrameShell";
import { ReactionButtons } from "@/components/artwork/ReactionButtons";
import type { Artwork } from "@/lib/types";
import { cn, formatDateJa, getDisplayName } from "@/lib/utils";

export function ArtworkCard({
  artwork,
  locked = false,
  currentUserId
}: {
  artwork: Artwork;
  locked?: boolean;
  currentUserId?: string | null;
}) {
  const author = getDisplayName(artwork.profiles);
  const themeTitle = artwork.themes?.title ?? "今日のテーマ";

  return (
    <article className="group border border-line bg-wall p-3 shadow-paper transition duration-300 hover:-translate-y-0.5 hover:border-sage/70 hover:shadow-hush">
      <FrameShell frameStyle={artwork.frame_style}>
        <div className="relative aspect-[4/5] overflow-hidden bg-paper">
          <Image
            src={artwork.image_url}
            alt={`${author}の作品`}
            fill
            sizes="(max-width: 768px) 92vw, 360px"
            className={cn(
              "art-image transition duration-500 group-hover:scale-[1.015]",
              locked && "locked-blur"
            )}
          />
          {locked ? (
            <div className="absolute inset-0 grid place-items-center bg-wall/38 px-4 text-center text-sm font-medium text-ink">
              飾るとひらきます
            </div>
          ) : null}
        </div>
      </FrameShell>
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="border border-line bg-paper px-2 py-1">{themeTitle}</span>
          <span className="border border-line bg-paper px-2 py-1 text-sage">
            {artwork.material}
          </span>
        </div>
        {artwork.note ? (
          <p className="text-sm leading-7 text-ink">{artwork.note}</p>
        ) : (
          <p className="text-sm leading-7 text-muted">静かに飾られています。</p>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
          <Link href={`/room/${artwork.user_id}`} className="hover:text-ink">
            作者 {author}
          </Link>
          <span>{formatDateJa(artwork.created_at)}</span>
        </div>
        {!locked ? (
          <ReactionButtons artworkId={artwork.id} currentUserId={currentUserId} />
        ) : null}
      </div>
    </article>
  );
}
