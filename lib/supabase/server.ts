import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

type MutableCookieStore = ReturnType<typeof cookies> & {
  set: (options: { name: string; value: string } & CookieOptions) => void;
};

export function createServerSupabaseClient() {
  const cookieStore = cookies() as MutableCookieStore;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabaseの環境変数が設定されていません。");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components cannot always mutate cookies; middleware refreshes them.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Server Components cannot always mutate cookies; middleware refreshes them.
        }
      }
    }
  });
}
