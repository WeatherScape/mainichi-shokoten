# 公開手順

このMVPは Vercel + Supabase で公開します。

## 1. Supabase

1. SupabaseでProjectを作成します。
2. SQL Editorで `supabase/schema.sql` を実行します。
3. 続けて `supabase/seed.sql` を実行します。
4. Authentication > Providers で Email provider を有効にします。
5. 名前だけではじめる入口も使う場合は、Authentication > Providers で Anonymous sign-ins を有効にします。

## 2. Vercelの環境変数

Vercel > Project Settings > Environment Variables に追加します。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

`NEXT_PUBLIC_SITE_URL` はメール確認リンクの戻り先に使います。本番URLを入れてください。

## 3. Supabase AuthのURL設定

メールリンクでエラーになるときは、ここが一番大事です。

Supabase Dashboard > Authentication > URL Configuration で設定します。

- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs:
  - `https://your-vercel-domain.vercel.app/auth/callback`
  - `https://*.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

このプロジェクトなら例は以下です。

- Site URL: `https://mainichi-shokoten-bscm.vercel.app`
- Redirect URL: `https://mainichi-shokoten-bscm.vercel.app/auth/callback`

## 4. 公開後チェック

- `/` で今日のテーマと残り時間が表示される
- `/login` で確認メールを送れる
- メールのリンクから `/auth/callback` を通って `/me` に戻れる
- `/new?themeId=...` の最後のボタンが「展示室に飾る」になっている
- 飾ったあとに `/gallery/[themeId]?opened=1` が開く
- `/me` に展示数、連続日数、バッジ、解放済み額縁が出る
