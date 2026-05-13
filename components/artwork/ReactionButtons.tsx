"use client";

import { useEffect, useState, useTransition } from "react";
import { HeartHandshake } from "lucide-react";
import { REACTIONS } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ReactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      setMessage("ログインすると、そっと反応を残せます。");
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
      setMessage("受け取りました。");
    });
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-3">
        {REACTIONS.map((reaction) => {
          const active = selected.includes(reaction.type);
          return (
            <button
              key={reaction.type}
              type="button"
              disabled={isPending || active}
              onClick={() => react(reaction.type)}
              className={cn(
                "inline-flex min-h-10 items-center justify-center gap-2 border px-3 py-2 text-xs transition",
                active
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-line bg-wall text-muted hover:border-sage hover:text-ink"
              )}
            >
              <HeartHandshake size={14} aria-hidden="true" />
              {reaction.label}
            </button>
          );
        })}
      </div>
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}
