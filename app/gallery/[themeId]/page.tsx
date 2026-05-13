import { redirect, notFound } from "next/navigation";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { MaterialFilter } from "@/components/artwork/MaterialFilter";
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
  searchParams: { material?: string };
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
          <MaterialFilter themeId={theme.id} current={material} />
          <div className="mt-6">
            <GalleryGrid artworks={artworks} currentUserId={user.id} />
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
