# まいにち小個展

毎日ひとつのテーマを、好きな画材で描いて飾る小さなオンライン展覧会です。
いいね数やランキングではなく、同じテーマを人それぞれの画材、視点、色、線でどう見たかを楽しむMVPです。

## セットアップ

1. 依存関係を入れます。

```bash
npm install
```

2. `.env.example` を参考に `.env.local` を作ります。

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Supabase SQL Editorで `supabase/schema.sql` を実行します。
4. 続けて `supabase/seed.sql` を実行します。
5. Supabase Authで Email provider を有効にします。
6. ローカルで起動します。

```bash
npm run dev
```

公開手順は [DEPLOYMENT.md](./DEPLOYMENT.md) にまとめています。

## テーマ運用

- JST / Asia/Tokyo 基準
- 毎朝5:00に今日のテーマが切り替わります
- 0:00から4:59までは前日のテーマです
- 平日は具体物を多めにし、土曜は場所や記憶、日曜は気分や抽象を混ぜます

## 実装済み

- 今日のテーマ表示、残り時間、締切、次の切り替え時間
- 作品を飾るフロー
- 画像選択、トリミング、明るさ、コントラスト、彩度、WebP保存
- Supabase Storageへの画像保存
- 画材タグ、ひとこと、額縁テーマ
- 飾る前は同じテーマのギャラリーをぼかす導線
- 優しいリアクション3種類
- ユーザー展示室、合計展示数、連続日数、バッジ、解放済み額縁
- デモ用の表現サンプル

## 主なページ

- `/` 今日のテーマ
- `/theme/[id]` テーマ詳細
- `/new?themeId=` 作品を飾るフロー
- `/gallery/[themeId]` 同じテーマの展示
- `/room/[userId]` ユーザー展示室
- `/me` 自分の展示室
- `/login` 展示室をひらく

## Supabase

必要なテーブルとStorage bucketは `supabase/schema.sql` に含まれています。

- `profiles`
- `themes`
- `artworks`
- `reactions`
- `badges`
- Storage bucket: `artworks`

メール認証を使う場合は、Supabase Dashboard > Authentication > URL Configuration で本番URLと `/auth/callback` を許可してください。

## TODO

- 本番運用時のテーマ自動作成を管理画面化する
- 作品削除、プロフィール編集を追加する
- 画像プレビューと保存後WebPの見え方をさらに一致させる
