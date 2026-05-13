# まいにち小個展

毎日ひとつのテーマを、好きな画材で描いて飾る小さなオンライン展覧会です。  
いいね数やランキングではなく、同じテーマを人それぞれがどう見たかを楽しむMVPです。

## セットアップ

1. Node.js と npm を使える状態にします。
2. 依存関係を入れます。

```bash
npm install
```

3. `.env.example` を参考に `.env.local` を作ります。

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Supabase SQL Editor で `supabase/schema.sql` を実行します。
5. 続けて `supabase/seed.sql` を実行し、30日分のテーマを入れます。
6. Supabase Auth で Anonymous sign-ins を有効にします。メールリンクも使う場合は Email provider を設定します。
7. ローカルで起動します。

```bash
npm run dev
```

公開手順は `DEPLOYMENT.md` にまとめています。

## 実装済み

- 今日のテーマ表示、テーマ詳細、同テーマのギャラリー
- 画像選択、正方形/4:5トリミング、明るさ/コントラスト/彩度調整、WebP保存
- Supabase Storage への作品画像保存
- 画材タグ、ひとこと、CSS額縁、白壁プレビュー
- 最後の保存ボタン「展示室に飾る」
- 飾る前は同テーマギャラリーを見せないロックUI
- 優しいリアクション3種
- ユーザー展示室、合計展示数、連続日数、バッジ、額縁解放
- 7日連続時の共有カード表示

## 主要ページ

- `/` 今日のテーマ
- `/theme/[id]` テーマ詳細
- `/new?themeId=` 作品を飾るフロー
- `/gallery/[themeId]` 同じテーマの展示
- `/room/[userId]` ユーザー展示室
- `/me` 自分の展示室
- `/login` 展示室をひらく

## Supabase

必要なテーブルとStorage bucketは `supabase/schema.sql` に含めています。

- `profiles`
- `themes`
- `artworks`
- `reactions`
- `badges`
- Storage bucket: `artworks`

## TODO

- 本番運用時はSupabaseの型生成を追加する
- 作品削除、プロフィール編集、メールログイン後のプロフィール補完を追加する
- 画像プレビューを最終WebPと完全一致する表示に近づける
- seedのテーマ日付を運用カレンダーに合わせる
