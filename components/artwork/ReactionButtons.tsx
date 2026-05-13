"use client";

import { useEffect, useState, useTransition } from "react";
import { Eye, Palette, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { REACTIONS } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ReactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

const reactionMeta: Record<ReactionType, { icon: LucideIcon; hint: string }> = {
  color: { icon: Palette, hint: "色に目が止まった" },
  line: { icon: PenLine, hint: "線をもう一度見たい" },
  view: { icon: Eye, hint: "見方がひらいた" }
};

export function ReactionButtons({
  artworkId,
  currentUserId
}: {
  artworkId: string;
  currentUserId?: string | null;
}) {
  const [selected, setSelected] = useState<ReactionType[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    supabase
      .from("reactions")
      .select("reaction_type")
      .eq("artwork_id", artworkId)
      .eq("user_id", currentUserId)
      .then(({ data }) => {
        setSelected((data ?? []).map((item) => item.reaction_type as ReactionType));
      });
  }, [artworkId, currentUserId]);

  function react(type: ReactionType) {
    if (!currentUserId) {
      setMessage("ログインすると、そっと鑑賞のしるしを残せます。");
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("reactions").insert({
        artwork_id: artworkId,
        user_id: currentUserId,
        reaction_type: type
      });

      if (error && !error.message.includes("duplicate")) {
        setMessage("反応を残せませんでした。少し時間を置いてください。");
        return;
      }

      setSelected((current) => (current.includes(type) ? current : [...current, type]));
      setMessage("鑑賞のしるしを置きました。");
    });
  }

  return (
    <div className="space-y-2 border-t border-line pt-3">
      <p className="text-xs text-muted">そっと残すリアクション</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {REACTIONS.map((reaction) => {
          const active = selected.includes(reaction.type);
          const Icon = reactionMeta[reaction.type].icon;
          return (
            <button
              key={reaction.type}
              type="button"
              disabled={isPending || active}
              onClick={() => react(reaction.type)}
              className={cn(
                "group min-h-16 border px-3 py-3 text-left text-xs transition disabled:cursor-default",
                active
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-line bg-paper text-muted hover:border-sage hover:bg-wall hover:text-ink"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center border transition",
                    active
                      ? "border-sage bg-wall"
                      : "border-line bg-wall text-sage group-hover:border-sage"
                  )}
                >
                  <Icon size={14} aria-hidden="true" />
                </span>
                <span className="font-medium">{reaction.label}</span>
              </span>
              <span className="mt-2 block leading-5 opacity-75">
                {active ? "残しました" : reactionMeta[reaction.type].hint}
              </span>
            </button>
          );
        })}
      </div>
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}
