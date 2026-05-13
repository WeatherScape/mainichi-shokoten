import { Clock, ImagePlus, Paintbrush } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type { Theme } from "@/lib/types";
import { formatDateJa } from "@/lib/utils";

export function ThemeHero({
  theme,
  hasArtwork
}: {
  theme: Theme;
  hasArtwork: boolean;
}) {
  return (
    <section className="wall-band border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted">{formatDateJa(theme.date)} のテーマ</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-ink sm:text-6xl">
            {theme.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {theme.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2 border border-line bg-wall px-3 py-2">
              <Clock size={16} aria-hidden="true" />
              推奨時間 15分
            </span>
            <span className="inline-flex items-center gap-2 border border-line bg-wall px-3 py-2">
              <Paintbrush size={16} aria-hidden="true" />
              好きな画材で描いてください
            </span>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={`/new?themeId=${theme.id}`}>
              <ImagePlus size={18} aria-hidden="true" />
              描いたら飾る
            </ButtonLink>
            {hasArtwork ? (
              <ButtonLink href={`/gallery/${theme.id}`} variant="secondary">
                みんなの展示を見る
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-sm border border-line bg-wall p-7 shadow-hush">
            <div className="aspect-[4/5] border border-line bg-paper p-8">
              <div className="flex h-full flex-col justify-between border border-line bg-wall p-6">
                <p className="text-xs text-muted">today's small exhibition</p>
                <p className="text-3xl font-light leading-tight text-ink">{theme.title}</p>
                <p className="text-sm leading-7 text-muted">
                  描いたら、あなたの展示室に飾りましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
