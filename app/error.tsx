"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <div className="border border-line bg-wall p-8 shadow-paper">
        <p className="text-sm text-muted">the room is temporarily closed</p>
        <h1 className="mt-3 text-3xl font-light text-ink">展示室を開けませんでした</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
          {error.message || "時間を置いて、もう一度お試しください。"}
        </p>
        <Button className="mt-6" onClick={reset} variant="secondary">
          もう一度開く
        </Button>
      </div>
    </main>
  );
}
