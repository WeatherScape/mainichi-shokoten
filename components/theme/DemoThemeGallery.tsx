"use client";

import { useEffect, useState } from "react";
import { Check, LockKeyhole } from "lucide-react";
import { DEMO_ARTWORKS, DemoArtworkGrid } from "@/components/artwork/DemoArtworkCard";
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
        <div className="mb-7 grid gap-5 border border-line bg-wall p-5 shadow-paper lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 border border-sage bg-paper px-3 py-2 text-xs text-sage">
              <Check size={14} aria-hidden="true" />
              展示がひらきました
            </div>
            <p className="text-sm text-muted">opened gallery</p>
            <h2 className="mt-2 text-3xl font-light leading-tight text-ink">
              同じテーマなのに、世界はこんなに違って見える。
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              あなたの一枚を飾ったあとで、みんなの見え方がひらきました。
              色、線、余白、画材の違いをゆっくり眺めてください。
            </p>
          </div>
          <div className="flex max-w-xl flex-wrap gap-2">
            {DEMO_ARTWORKS.map((artwork) => (
              <span key={artwork.id} className="border border-line bg-paper px-3 py-2 text-xs text-muted">
                {artwork.material}
              </span>
            ))}
          </div>
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
          <div className="mx-auto grid h-11 w-11 place-items-center border border-line bg-paper text-sage">
            <LockKeyhole size={18} aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs text-muted">closed until your first work</p>
          <h2 className="mt-3 text-2xl font-light leading-9 text-ink">
            あなたの一枚を飾ると、みんなの見え方がひらきます。
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            先に比べてしまわないように、同じテーマの展示は飾ったあとで開きます。
            6つの画材の見え方が、この壁の奥で待っています。
          </p>
          <ButtonLink className="mt-6" href="/new?themeId=demo-theme">
            描いたら飾る
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
