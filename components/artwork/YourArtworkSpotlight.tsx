import Image from "next/image";
import { ArrowDown, Check } from "lucide-react";
import { FrameShell } from "@/components/artwork/FrameShell";
import { ButtonLink } from "@/components/ui/Button";
import type { Artwork, Theme } from "@/lib/types";
import { formatDateJa } from "@/lib/utils";

export function YourArtworkSpotlight({
  artwork,
  theme,
  justOpened
}: {
  artwork: Artwork;
  theme: Theme;
  justOpened: boolean;
}) {
  return (
    <section className="mb-7 wall-band border border-sage/50 p-5 shadow-paper sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div className="mx-auto w-full max-w-xs">
          <div className="border border-line bg-wall px-5 py-6 shadow-paper">
            <div className="mx-auto mb-5 h-px w-14 bg-line" />
            <FrameShell frameStyle={artwork.frame_style}>
              <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                <Image
                  src={artwork.image_url}
                  alt="あなたの展示作品"
                  fill
                  sizes="(max-width: 768px) 82vw, 320px"
                  className="art-image"
                  priority={justOpened}
                />
              </div>
            </FrameShell>
          </div>
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 border border-sage bg-paper px-3 py-2 text-xs text-sage">
            <Check size={14} aria-hidden="true" />
            {justOpened ? "展示がひらきました" : "あなたの一枚"}
          </div>
          <p className="text-sm text-muted">your work on this wall</p>
          <h2 className="mt-2 text-3xl font-light leading-tight text-ink">
            この一枚を置いたので、みんなの見え方がひらきました。
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            先に比べずに描いたあなたの作品が、このテーマの展示の入口です。
            ここから下に、同じ「{theme.title}」を見た人たちの色、線、余白が並びます。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
            <span className="border border-line bg-wall px-2 py-1">{theme.title}</span>
            <span className="border border-line bg-wall px-2 py-1">{artwork.material}</span>
            <span className="border border-line bg-wall px-2 py-1">
              {formatDateJa(artwork.created_at)}
            </span>
          </div>
          {artwork.note ? (
            <p className="mt-5 border-l border-line pl-4 text-sm leading-7 text-ink">
              {artwork.note}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/me" variant="secondary">
              自分の展示室へ
            </ButtonLink>
            <ButtonLink href="#everyone-gallery" variant="ghost">
              <ArrowDown size={16} aria-hidden="true" />
              みんなの展示へ
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
