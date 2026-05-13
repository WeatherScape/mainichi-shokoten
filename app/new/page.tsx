import { notFound } from "next/navigation";
import { NewArtworkFlow } from "@/components/artwork/NewArtworkFlow";
import {
  getTheme,
  getTodayTheme,
  getUserArtworks,
  requireSessionUser
} from "@/lib/supabase/queries";
import { calculateArtworkStats } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewArtworkPage({
  searchParams
}: {
  searchParams: { themeId?: string };
}) {
  const user = await requireSessionUser();
  const theme = searchParams.themeId
    ? await getTheme(searchParams.themeId)
    : await getTodayTheme();

  if (!theme) {
    notFound();
  }

  const artworks = await getUserArtworks(user.id);
  const stats = calculateArtworkStats(artworks);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="mb-8">
        <p className="text-sm text-muted">new work for today's wall</p>
        <h1 className="mt-3 text-4xl font-light text-ink">「{theme.title}」を飾る</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          写真を選び、少し整えて、額縁を選びます。最後に展示室へそっと飾りましょう。
        </p>
      </section>
      <NewArtworkFlow theme={theme} userId={user.id} initialStats={stats} />
    </main>
  );
}
