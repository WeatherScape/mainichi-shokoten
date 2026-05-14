import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/me";
  }

  return value;
}

function redirectToLogin(requestUrl: URL, reason: string) {
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set("auth_error", reason);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");

  if (providerError) {
    return redirectToLogin(requestUrl, providerError);
  }

  const supabase = createServerSupabaseClient();
  if (!code && (!tokenHash || !otpType)) {
    return redirectToLogin(requestUrl, "missing_code");
  }

  const { data, error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: otpType! });

  if (error || !data.user) {
    return redirectToLogin(requestUrl, "callback_failed");
  }

  const displayName =
    typeof data.user.user_metadata?.display_name === "string" &&
    data.user.user_metadata.display_name.trim()
      ? data.user.user_metadata.display_name.trim().slice(0, 24)
      : "展示者";

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      username: `room_${data.user.id.slice(0, 8)}`,
      display_name: displayName
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return redirectToLogin(requestUrl, "profile_failed");
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
