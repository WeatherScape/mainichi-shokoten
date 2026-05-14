import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm text-muted">your quiet room</p>
        <h1 className="mt-3 text-4xl font-light text-ink">展示室をひらく</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          作品を飾るための小さな入口です。メールで戻れるようにしておくと、
          スマホを替えても同じ展示室に帰ってこられます。
        </p>
      </div>
      <Suspense>
        <AuthPanel />
      </Suspense>
    </main>
  );
}
