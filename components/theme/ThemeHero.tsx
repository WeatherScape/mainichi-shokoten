import { CalendarClock, Clock, ImagePlus, Paintbrush, Sunrise } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type { Theme } from "@/lib/types";
import {
  getNextThemeOpenText,
  getRemainingTime,
  getRemainingTimeText,
  getThemeDeadlineDisplayText
} from "@/lib/theme";
import { formatDateJa } from "@/lib/utils";

export function ThemeHero({
  theme,
  hasArtwork
}: {
  theme: Theme;
  hasArtwork: boolean;
}) {
  const remaining = getRemainingTime();
  const remainingText = getRemainingTimeText();
  const deadlineText = getThemeDeadlineDisplayText();
  const nextThemeText = getNextThemeOpenText();

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
              <Paintbrush size={16} aria-hidden="true" />
              好きな画材で
            </span>
            <span className="inline-flex items-center gap-2 border border-line bg-wall px-3 py-2">
              <Clock size={16} aria-hidden="true" />
              少し描いても、ゆっくり描いても
            </span>
            <span className="inline-flex items-center gap-2 border border-line bg-wall px-3 py-2">
              <Sunrise size={16} aria-hidden="true" />
              毎朝5:00に切り替え
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div
              className={
                remaining.isAlmostClosed
                  ? "border border-clay/50 bg-clay/10 p-4 shadow-paper"
                  : "border border-line bg-wall p-4 shadow-paper"
              }
            >
              <p className="text-xs text-muted">残り時間</p>
              <p className="mt-2 text-lg font-light leading-7 text-ink">{remainingText}</p>
            </div>
            <div className="border border-line bg-wall p-4 shadow-paper">
              <p className="text-xs text-muted">締切</p>
              <p className="mt-2 text-sm leading-7 text-ink">{deadlineText}</p>
              <p className="mt-1 text-xs text-muted">翌朝4:59まで</p>
            </div>
            <div className="border border-line bg-wall p-4 shadow-paper">
              <p className="text-xs text-muted">次の切り替え</p>
              <p className="mt-2 text-sm leading-7 text-ink">
                <CalendarClock className="mr-1 inline text-sage" size={15} aria-hidden="true" />
                朝5:00
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">{nextThemeText}</p>
            </div>
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
