import Image from "next/image";
import { CalendarDays, GalleryHorizontal, Sparkles } from "lucide-react";
import { FrameShell } from "@/components/artwork/FrameShell";
import { ButtonLink } from "@/components/ui/Button";
import { FRAME_STYLES } from "@/lib/constants";
import type { Artwork, ArtworkStats, FrameStyle, Theme } from "@/lib/types";
import { cn, formatDateJa, getUnlockedFrames } from "@/lib/utils";

function getFrameProgress(frame: (typeof FRAME_STYLES)[number], stats: ArtworkStats) {
  if (frame.requiredTotal) {
    return {
      current: stats.total,
      required: frame.requiredTotal,
      label: `${Math.max(frame.requiredTotal - stats.total, 0)}作品で解放`
    };
  }

  if (frame.requiredStreak) {
    return {
      current: stats.streak,
      required: frame.requiredStreak,
      label: `${Math.max(frame.requiredStreak - stats.streak, 0)}日で解放`
    };
  }

  return { current: 1, required: 1, label: "解放済み" };
}

export function RoomGrowthPanel({
  artworks,
  stats,
  todayTheme
}: {
  artworks: Artwork[];
  stats: ArtworkStats;
  todayTheme: Theme;
}) {
  const latest = artworks[0];
  const unlockedFrames = new Set<FrameStyle>(getUnlockedFrames(stats));
  const nextFrame = FRAME_STYLES.find((frame) => !unlockedFrames.has(frame.id));
  const nextProgress = nextFrame ? getFrameProgress(nextFrame, stats) : null;
  const nextProgressPercent = nextProgress
    ? Math.min(100, Math.round((nextProgress.current / nextProgress.required) * 100))
    : 100;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="wall-band border border-line p-5 shadow-paper sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">room wall</p>
            <h2 className="mt-2 text-3xl font-light leading-tight text-ink">
              飾るたびに、壁が少し育つ。
            </h2>
          </div>
          <ButtonLink href={`/new?themeId=${todayTheme.id}`}>今日の一枚を飾る</ButtonLink>
        </div>

        {latest ? (
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="mx-auto w-full max-w-xs">
              <FrameShell frameStyle={latest.frame_style}>
                <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <Image
                    src={latest.image_url}
                    alt="最新の展示作品"
                    fill
                    sizes="(max-width: 768px) 80vw, 320px"
                    className="art-image"
                  />
                </div>
              </FrameShell>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span className="border border-line bg-wall px-2 py-1">
                  最新の一枚
                </span>
                <span className="border border-line bg-wall px-2 py-1">
                  {latest.material}
                </span>
                {latest.themes?.title ? (
                  <span className="border border-line bg-wall px-2 py-1">
                    {latest.themes.title}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-ink">
                {latest.note || "静かに飾られています。"}
              </p>
              <p className="mt-3 text-xs text-muted">{formatDateJa(latest.created_at)}</p>
            </div>
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center border border-dashed border-line bg-wall/70 px-6 text-center">
            <div>
              <GalleryHorizontal className="mx-auto text-sage" size={28} aria-hidden="true" />
              <p className="mt-4 text-sm leading-7 text-muted">
                まだ白い壁です。最初の一枚を飾ると、ここがあなたの展示室になります。
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="border border-line bg-wall p-5 shadow-paper">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
              <CalendarDays size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted">今日までの積み重ね</p>
              <p className="text-2xl font-light text-ink">
                {stats.total}作品 / {stats.streak}日連続
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="border border-line bg-paper px-4 py-3">
              <p className="text-xs text-muted">展示数</p>
              <p className="mt-1 text-xl font-light text-ink">{stats.total}</p>
            </div>
            <div className="border border-line bg-paper px-4 py-3">
              <p className="text-xs text-muted">連続日数</p>
              <p className="mt-1 text-xl font-light text-ink">{stats.streak}</p>
            </div>
          </div>
        </div>

        <div className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkles size={17} aria-hidden="true" />
            次に育つ場所
          </div>
          {nextFrame && nextProgress ? (
            <>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-ink">{nextFrame.label}</span>
                <span className="text-muted">{nextFrame.unlockLabel}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden bg-paper">
                <div
                  className="h-full bg-sage transition-all"
                  style={{ width: `${nextProgressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                あと{nextProgress.label.replace("で解放", "")}で、展示室に新しい表情が増えます。
              </p>
            </>
          ) : (
            <p className="text-sm leading-7 text-muted">
              額縁はすべて開いています。次は、あなたの壁の密度が育っていきます。
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FRAME_STYLES.map((frame) => (
            <div
              key={frame.id}
              className={cn(
                "border px-3 py-3 text-xs",
                unlockedFrames.has(frame.id)
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-line bg-wall text-muted"
              )}
            >
              <p>{frame.label}</p>
              <p className="mt-1 opacity-75">
                {unlockedFrames.has(frame.id) ? "解放済み" : frame.unlockLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
