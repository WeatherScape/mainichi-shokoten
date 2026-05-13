"use client";

import { useEffect, useState } from "react";
import { DemoArtworkGrid } from "@/components/artwork/DemoArtworkCard";
import { ButtonLink } from "@/components/ui/Button";

const DEMO_FRAMED_KEY = "mainichi-shokoten-demo-framed";

export function markDemoArtworkFramed() {
  window.localStorage.setItem(DEMO_FRAMED_KEY, "1");
}

export function DemoThemeGallery({ initialOpen }: { initialOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen) {
      window.localStorage.setItem(DEMO_FRAMED_KEY, "1");
      return;
    }

    setIsOpen(window.localStorage.getItem(DEMO_FRAMED_KEY) === "1");
  }, [initialOpen]);

  if (isOpen) {
    return (
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
    );
  }

  return (
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
  );
}
