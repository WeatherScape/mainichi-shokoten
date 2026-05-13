import { notFound } from "next/navigation";
import { DemoArtworkGrid } from "@/components/artwork/DemoArtworkCard";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { LockedGalleryNotice } from "@/components/theme/LockedGalleryNotice";
import { ButtonLink } from "@/components/ui/Button";
import {
  getArtworkForTheme,
  getSessionUser,
  getTheme,
  getThemeArtworks
} from "@/lib/supabase/queries";
import { formatDateJa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ThemePage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { open?: string };
}) {
  if (params.id === "demo-theme") {
    const isDemoOpen = searchParams?.open === "1";

    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="mb-10 border-b border-line pb-8">
          <p className="text-sm text-muted">今日のテーマ</p>
          <h1 className="mt-3 text-5xl font-light leading-tight text-ink">
            コーヒーカップ
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
            先に比べない。まずは自分の一枚を飾る。飾ると、みんなの見え方がひらきます。
          </p>
          <div className="mt-7">
            <ButtonLink href="/new?themeId=demo-theme">描いたら飾る</ButtonLink>
          </div>
        </section>

        {isDemoOpen ? (
          <section>
            <div className="mb-6 max-w-2xl">
              <p className="text-sm text-muted">opened gallery</p>
              <h2 className="mt-2 text-3xl font-light text-ink">
                同じテーマなのに、世界はこんなに違って見える。
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                あなたの一枚を飾ったあとで、みんなの見え方がひらきました。
              </p>
            </div>
            <DemoArtworkGrid />
          </section>
        ) : (
          <section className="relative overflow-hidden">
            <DemoArtworkGrid locked />
            <div className="absolute inset-0 grid place-items-center bg-wall/62 px-4 backdrop-blur-[2px]">
              <div className="max-w-xl border border-line bg-wall/95 p-7 text-center shadow-hush">
                <h2 className="text-2xl font-light leading-9 text-ink">
                  あなたの一枚を飾ると、みんなの見え方がひらきます。
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted">
                  先に比べてしまわないように、同じテーマの展示は飾ったあとで開きます。
                </p>
                <ButtonLink className="mt-6" href="/new?themeId=demo-theme">
                  描いたら飾る
                </ButtonLink>
              </div>
            </div>
          </section>
        )}
      </main>
    );
  }

  const [theme, user] = await Promise.all([getTheme(params.id), getSessionUser()]);

  if (!theme) {
    notFound();
  }

  const myArtwork = user ? await getArtworkForTheme(user.id, theme.id) : null;
  const artworks = await getThemeArtworks(theme.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="mb-10 border-b border-line pb-8">
        <p className="text-sm text-muted">{formatDateJa(theme.date)} のテーマ</p>
        <h1 className="mt-3 text-5xl font-light leading-tight text-ink">{theme.title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{theme.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={`/new?themeId=${theme.id}`}>描いたら飾る</ButtonLink>
          {myArtwork ? (
            <ButtonLink href={`/gallery/${theme.id}`} variant="secondary">
              みんなの展示を見る
            </ButtonLink>
          ) : null}
        </div>
      </section>

      {myArtwork ? (
        <GalleryGrid artworks={artworks} currentUserId={user?.id} />
      ) : (
        <div className="space-y-6">
          <LockedGalleryNotice themeId={theme.id} />
          <GalleryGrid artworks={artworks} currentUserId={user?.id} locked />
        </div>
      )}
    </main>
  );
}
