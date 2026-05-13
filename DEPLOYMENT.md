# 公開手順

このMVPは Vercel + Supabase で公開する想定です。Next.js はVercel上でほぼゼロ設定で動きます。

## 1. Supabaseを用意する

1. Supabaseで新しいProjectを作成します。
2. SQL Editorで `supabase/schema.sql` を実行します。
3. 続けて `supabase/seed.sql` を実行します。
4. Authentication > Providers で Anonymous sign-ins を有効にします。
5. メールリンクも使う場合は Email provider を有効にします。

## 2. Vercelへデプロイする

推奨はGitHub連携です。

1. このリポジトリをGitHubへpushします。
2. Vercelで New Project を選び、このリポジトリをImportします。
3. Framework Preset は Next.js のままでOKです。
4. Environment Variables に以下を入れます。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

5. Deploy を実行します。

## 3. Supabase AuthのURL設定

Supabase Dashboard > Authentication > URL Configuration で設定します。

- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs:
  - `https://your-vercel-domain.vercel.app/auth/callback`
  - `https://*-your-team.vercel.app/auth/callback` preview環境を使う場合
  - `http://localhost:3000/auth/callback` ローカル確認用

## 4. 公開後チェック

- `/` で今日のテーマが表示される
- `/login` で名前だけではじめられる
- `/new?themeId=...` で画像を選び、最後のボタンが「展示室に飾る」になっている
- 飾る前は同じテーマのギャラリーがぼかされる
- 飾った後に `/gallery/[themeId]` が見られる
- `/me` に合計展示数、連続日数、バッジ、解放済み額縁が出る

## 5. CLIで公開する場合

ローカルにnpmが使える環境なら、Vercel CLIでも公開できます。

```bash
npm install
npm run build
npx vercel
npx vercel --prod
```

この環境では現時点で `npm` がPATHに見えていないため、GitHub連携か、Node.js/npmを通常インストールした端末からの実行を推奨します。
