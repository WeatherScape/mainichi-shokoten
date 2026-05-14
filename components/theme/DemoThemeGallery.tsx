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
            <p className="text-sm text-muted">opened sample gallery</p>
            <h2 className="mt-2 text-3xl font-light leading-tight text-ink">
              サンプルでも、画材が変わると見え方が変わります。
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              これは今日のお題ではなく、表現の違いを伝えるための見本展示です。
              本番では、あなたの一枚を飾ったあとで同じテーマの展示が開きます。
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
          <p className="mt-5 text-xs text-muted">sample gallery</p>
          <h2 className="mt-3 text-2xl font-light leading-9 text-ink">
            これは今日のお題ではない、表現サンプルです。
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            例として「白い花」を6つの画材で並べています。
            実際のお題は、あなたが飾るまで同じテーマの展示を見せません。
          </p>
          <ButtonLink className="mt-6" href="/new?themeId=demo-theme">
            デモで飾ってみる
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
