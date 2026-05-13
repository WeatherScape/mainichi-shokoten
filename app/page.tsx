import { Brush, GalleryHorizontal, KeyRound } from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemeHero } from "@/components/theme/ThemeHero";
import {
  getArtworkForTheme,
  getRecentArtworks,
  getSessionUser,
  getTodayTheme
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();
  const theme = await getTodayTheme();
  const myArtwork =
    user && theme.id !== "demo-theme"
      ? await getArtworkForTheme(user.id, theme.id)
      : null;
  const recentArtworks = await getRecentArtworks(6);

  return (
    <main>
      <ThemeHero theme={theme} hasArtwork={Boolean(myArtwork)} />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {[
          {
            icon: Brush,
            title: "今日のテーマを、好きな画材で描く。",
            body: "水彩でも、鉛筆でも、デジタルでも。うまさではなく、見え方の違いを楽しみます。"
          },
          {
            icon: GalleryHorizontal,
            title: "描いたら、展示室に飾る。",
            body: "スマホ写真を整え、額縁と白い壁で、作品として静かに並べます。"
          },
          {
            icon: KeyRound,
            title: "飾ると、みんなの見え方がひらく。",
            body: "先に比べないために、同じテーマのギャラリーは飾ったあとで開きます。"
          }
        ].map((item) => (
          <article key={item.title} className="border border-line bg-wall p-6 shadow-paper">
            <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
              <item.icon size={18} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-light leading-8 text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">recently framed</p>
            <h2 className="mt-2 text-3xl font-light text-ink">最近飾られた作品</h2>
          </div>
          <ButtonLink href={`/theme/${theme.id}`} variant="secondary">
            今日の展示へ
          </ButtonLink>
        </div>
        {recentArtworks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                currentUserId={user?.id}
                locked={artwork.theme_id === theme.id && !myArtwork}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="最初の壁は、まだ静かです。"
            body="今日のテーマを描いて飾ると、ここに小さな展示が生まれます。"
            href={`/new?themeId=${theme.id}`}
            action="描いたら飾る"
          />
        )}
      </section>
    </main>
  );
}
