"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ensureClientProfile } from "@/lib/supabase/client-helpers";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function startAnonymously(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signInAnonymously({
          options: {
            data: {
              display_name: displayName.trim() || "展示者"
            }
          }
        });

        if (error || !data.user) {
          throw new Error(error?.message ?? "ログインできませんでした。");
        }

        await ensureClientProfile({
          userId: data.user.id,
          displayName
        });

        router.push(next);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "ログインできませんでした。");
      }
    });
  }

  function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`
          }
        });

        if (error) {
          throw error;
        }

        setMessage("メールを送りました。届いたリンクから展示室に戻れます。");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "メールを送れませんでした。");
      }
    });
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      <form onSubmit={startAnonymously} className="border border-line bg-wall p-6 shadow-paper">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
            <UserRound size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-light text-ink">名前だけではじめる</h2>
            <p className="text-sm text-muted">MVP向けの軽い入口です。</p>
          </div>
        </div>
        <label className="block text-sm text-muted" htmlFor="displayName">
          展示室の名前
        </label>
        <input
          id="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="例：小さな机の人"
          className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink outline-none transition focus:border-sage"
          maxLength={24}
        />
        <Button className="mt-5 w-full" disabled={isPending}>
          <LogIn size={18} aria-hidden="true" />
          描きはじめる
        </Button>
      </form>

      <form onSubmit={sendMagicLink} className="border border-line bg-wall p-6 shadow-paper">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
            <Mail size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-light text-ink">メールで戻る</h2>
            <p className="text-sm text-muted">同じ展示室に戻りたい人向けです。</p>
          </div>
        </div>
        <label className="block text-sm text-muted" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink outline-none transition focus:border-sage"
        />
        <Button className="mt-5 w-full" variant="secondary" disabled={isPending || !email}>
          <Mail size={18} aria-hidden="true" />
          メールを受け取る
        </Button>
      </form>

      {message ? (
        <p className="lg:col-span-2 border border-line bg-paper px-4 py-3 text-sm text-muted">
          {message}
        </p>
      ) : null}
    </div>
  );
}
