import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <div className="border border-line bg-wall p-8 shadow-paper">
        <p className="text-sm text-muted">empty wall</p>
        <h1 className="mt-3 text-3xl font-light text-ink">展示が見つかりません</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
          作品やテーマが移動したか、まだ用意されていないようです。
        </p>
        <ButtonLink className="mt-6" href="/" variant="secondary">
          今日のテーマへ
        </ButtonLink>
      </div>
    </main>
  );
}
