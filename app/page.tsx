import { Brush, GalleryHorizontal, KeyRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoArtworkGrid } from "@/components/artwork/DemoArtworkCard";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeHero } from "@/components/theme/ThemeHero";
import {
  getArtworkForTheme,
  getSessionUser,
  getTodayTheme
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const conceptItems: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
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
];

export default async function HomePage() {
  const user = await getSessionUser();
  const theme = await getTodayTheme();
  const myArtwork =
    user && theme.id !== "demo-theme"
      ? await getArtworkForTheme(user.id, theme.id)
      : null;

  return (
    <main>
      <ThemeHero theme={theme} hasArtwork={Boolean(myArtwork)} />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {conceptItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="border border-line bg-wall p-6 shadow-paper">
              <div className="grid h-10 w-10 place-items-center border border-line bg-paper text-sage">
                <Icon size={18} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-light leading-8 text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm text-muted">six views of one theme</p>
            <h2 className="mt-2 text-3xl font-light text-ink">
              同じテーマなのに、世界はこんなに違って見える。
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              透明水彩、ペン画、オイルパステル。うまさではなく、見え方の違いを楽しみます。
              スマホで撮った絵も、額縁に入れると作品になります。
            </p>
          </div>
          <ButtonLink href="/theme/demo-theme" variant="secondary">
            展示を見る
          </ButtonLink>
        </div>
        <DemoArtworkGrid />
        <div className="mt-8 border border-line bg-wall px-5 py-4 text-sm leading-7 text-muted shadow-paper">
          先に比べない。まずは自分の一枚を飾る。飾るたびに、あなたの小さな個展が育っていく。
        </div>
      </section>
    </main>
  );
}
