import { redirect, notFound } from "next/navigation";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { MaterialFilter } from "@/components/artwork/MaterialFilter";
import { YourArtworkSpotlight } from "@/components/artwork/YourArtworkSpotlight";
import { LockedGalleryNotice } from "@/components/theme/LockedGalleryNotice";
import { MATERIALS } from "@/lib/constants";
import {
  getArtworkForTheme,
  getTheme,
  getThemeArtworks,
  requireSessionUser
} from "@/lib/supabase/queries";
import type { Material } from "@/lib/types";
import { formatDateJa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  params,
  searchParams
}: {
  params: { themeId: string };
  searchParams: { material?: string; opened?: string };
}) {
  const user = await requireSessionUser();
  const theme = await getTheme(params.themeId);

  if (!theme) {
    notFound();
  }

  const myArtwork = await getArtworkForTheme(user.id, theme.id);

  if (!myArtwork && searchParams.material) {
    redirect(`/gallery/${theme.id}`);
  }

  const material = MATERIALS.includes(searchParams.material as Material)
    ? (searchParams.material as Material)
    : undefined;
  const artworks = myArtwork
    ? await getThemeArtworks(theme.id, material)
    : await getThemeArtworks(theme.id);
  const justOpened = searchParams.opened === "1";
  const galleryArtworks = myArtwork
    ? artworks.filter((artwork) => artwork.id !== myArtwork.id)
    : artworks;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="mb-8">
        <p className="text-sm text-muted">{formatDateJa(theme.date)} の展示</p>
        <h1 className="mt-3 text-4xl font-light text-ink">{theme.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          同じテーマなのに、世界はこんなに違って見える。
        </p>
      </section>

      {myArtwork ? (
        <>
          <YourArtworkSpotlight
            artwork={myArtwork}
            theme={theme}
            justOpened={justOpened}
          />
          <section id="everyone-gallery" className="scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">everyone's wall</p>
                <h2 className="mt-2 text-3xl font-light text-ink">みんなの見え方</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted">
                あなたの一枚を置いたあとで眺めるから、違いがやさしく見えてきます。
              </p>
            </div>
          </section>
          <MaterialFilter themeId={theme.id} current={material} />
          <div className="mt-6">
            <GalleryGrid artworks={galleryArtworks} currentUserId={user.id} />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <LockedGalleryNotice themeId={theme.id} />
          <GalleryGrid artworks={artworks} currentUserId={user.id} locked />
        </div>
      )}
    </main>
  );
}
