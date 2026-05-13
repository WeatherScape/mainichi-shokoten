import { Award, Sparkles, Square } from "lucide-react";
import { BADGE_RULES, FRAME_STYLES } from "@/lib/constants";
import type { ArtworkStats, FrameStyle } from "@/lib/types";
import { getEarnedBadges, getUnlockedFrames } from "@/lib/utils";

export function RewardSummary({
  stats,
  badges
}: {
  stats: ArtworkStats;
  badges?: string[];
}) {
  const computedBadges = getEarnedBadges(stats);
  const badgeTypes = new Set(badges ?? computedBadges.map((badge) => badge.type));
  const unlockedFrames = new Set<FrameStyle>(getUnlockedFrames(stats));
  const nextFrame = FRAME_STYLES.find((frame) => !unlockedFrames.has(frame.id));

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="border border-line bg-wall p-5 shadow-paper">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted">展示室の育ち</p>
            <p className="text-2xl font-light text-ink">
              {stats.total}作品 / {stats.streak}日連続
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          {nextFrame
            ? `あと少しで「${nextFrame.label}」が開きます。${nextFrame.unlockLabel}。`
            : "すべての額縁が開いています。静かな壁が、ずいぶん育ちました。"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <Square size={17} aria-hidden="true" />
            解放済みの額縁
          </div>
          <div className="flex flex-wrap gap-2">
            {FRAME_STYLES.map((frame) => (
              <span
                key={frame.id}
                className={
                  unlockedFrames.has(frame.id)
                    ? "border border-sage bg-sage/10 px-2 py-1 text-xs text-sage"
                    : "border border-line bg-paper px-2 py-1 text-xs text-muted"
                }
              >
                {frame.label}
              </span>
            ))}
          </div>
        </div>
        <div className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <Award size={17} aria-hidden="true" />
            バッジ
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGE_RULES.map((badge) => (
              <span
                key={badge.type}
                className={
                  badgeTypes.has(badge.type)
                    ? "border border-clay bg-clay/10 px-2 py-1 text-xs text-clay"
                    : "border border-line bg-paper px-2 py-1 text-xs text-muted"
                }
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
