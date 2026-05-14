"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ensureClientProfile } from "@/lib/supabase/client-helpers";

function getReadableAuthMessage(code: string | null) {
  if (!code) {
    return "";
  }

  if (code === "callback_failed") {
    return "メールの確認リンクを開けませんでした。リンクが古い場合は、もう一度メールを受け取ってください。";
  }

  if (code === "missing_code") {
    return "確認リンクの情報が足りませんでした。もう一度メールを受け取ってください。";
  }

  if (code === "profile_failed") {
    return "展示室の準備で止まりました。少し時間を置いて、もう一度開いてください。";
  }

  return code;
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/me";
  }

  return value;
}

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const authError = searchParams.get("auth_error");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const readable = getReadableAuthMessage(authError);
    if (readable) {
      setMessage(readable);
    }
  }, [authError]);

  function startAnonymously(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const safeName = displayName.trim() || "展示者";
        const { data, error } = await supabase.auth.signInAnonymously({
          options: {
            data: {
              display_name: safeName
            }
          }
        });

        if (error || !data.user) {
          throw new Error(
            "匿名ではじめる設定がまだ有効になっていません。メールで展示室をひらいてください。"
          );
        }

        await ensureClientProfile({
          userId: data.user.id,
          displayName: safeName
        });

        router.push(next);
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "展示室をひらけませんでした。メールでの入口も試してください。"
        );
      }
    });
  }

  function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const safeName = displayName.trim() || "展示者";
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              display_name: safeName
            },
            emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`
          }
        });

        if (error) {
          throw error;
        }

        setMessage(
          "確認メールを送りました。メールのボタンを開くと、あなたの展示室に戻れます。"
        );
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "メールを送れませんでした。アドレスを確認して、もう一度試してください。"
        );
      }
    });
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      <form
        onSubmit={sendMagicLink}
        className="border border-line bg-wall p-6 shadow-paper lg:col-span-2"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
            <Mail size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-light text-ink">メールで展示室をひらく</h2>
            <p className="text-sm text-muted">
              最初に名前を決めて、確認メールから戻ってきます。
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-muted" htmlFor="displayNameEmail">
              展示室の名前
            </label>
            <input
              id="displayNameEmail"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="例：小さな机の人"
              className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink outline-none transition focus:border-sage"
              maxLength={24}
            />
          </div>
          <div>
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
          </div>
        </div>

        <Button className="mt-5 w-full sm:w-auto" disabled={isPending || !email}>
          <Mail size={18} aria-hidden="true" />
          確認メールを受け取る
        </Button>
      </form>

      <form
        onSubmit={startAnonymously}
        className="border border-line bg-wall/70 p-6 shadow-paper lg:col-span-2"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
              <UserRound size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-light text-ink">名前だけではじめる</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Supabase側で匿名ログインを有効にしたときだけ使える軽い入口です。
                上の展示室の名前を使います。
              </p>
            </div>
          </div>
          <Button variant="secondary" disabled={isPending}>
            <ArrowRight size={17} aria-hidden="true" />
            試してみる
          </Button>
        </div>
      </form>

      {message ? (
        <p className="lg:col-span-2 border border-line bg-paper px-4 py-3 text-sm leading-7 text-muted">
          {message}
        </p>
      ) : null}
    </div>
  );
}
