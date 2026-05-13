import { redirect, notFound } from "next/navigation";
import { Check, GalleryHorizontal } from "lucide-react";
import { GalleryGrid } from "@/components/artwork/GalleryGrid";
import { MaterialFilter } from "@/components/artwork/MaterialFilter";
import { LockedGalleryNotice } from "@/components/theme/LockedGalleryNotice";
import { ButtonLink } from "@/components/ui/Button";
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
          {justOpened ? (
            <section className="mb-7 border border-sage/50 bg-wall p-5 shadow-paper">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 border border-sage bg-paper px-3 py-2 text-xs text-sage">
                    <Check size={14} aria-hidden="true" />
                    展示がひらきました
                  </div>
                  <h2 className="text-2xl font-light leading-tight text-ink">
                    あなたの一枚が壁にかかりました。
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    ここから、同じテーマを見た人たちの色や線がひらきます。
                    まずは自分の一枚を置いたあとで、ゆっくり眺めてください。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/me" variant="secondary">
                    自分の展示室へ
                  </ButtonLink>
                  <ButtonLink href={`/new?themeId=${theme.id}`}>
                    もう一枚飾る
                  </ButtonLink>
                </div>
              </div>
            </section>
          ) : (
            <section className="mb-7 border border-line bg-wall p-4 shadow-paper">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <GalleryHorizontal size={17} aria-hidden="true" className="text-sage" />
                <span>あなたの一枚を飾ったので、このテーマの展示が開いています。</span>
              </div>
            </section>
          )}
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
