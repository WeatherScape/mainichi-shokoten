import { notFound } from "next/navigation";
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

export default async function ThemePage({ params }: { params: { id: string } }) {
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
