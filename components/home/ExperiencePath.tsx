import {
  ArrowRight,
  Brush,
  GalleryHorizontal,
  ImagePlus,
  KeyRound,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const steps: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: Brush,
    title: "描く",
    body: "今日のテーマを、好きな画材で。"
  },
  {
    icon: ImagePlus,
    title: "撮る",
    body: "スマホ写真を作品の入口に。"
  },
  {
    icon: SlidersHorizontal,
    title: "整える",
    body: "明るさと色を、少しだけ。"
  },
  {
    icon: GalleryHorizontal,
    title: "飾る",
    body: "額縁と白い壁で展示室へ。"
  },
  {
    icon: KeyRound,
    title: "ひらく",
    body: "同じテーマの見え方に出会う。"
  }
];

export function ExperiencePath() {
  return (
    <section className="border-y border-line bg-wall/70">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm text-muted">from drawing to exhibition</p>
            <h2 className="mt-3 text-3xl font-light leading-tight text-ink">
              スマホで撮った絵も、額縁に入れると作品になる。
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              先に比べない。まずは自分の一枚を飾る。飾るたびに、あなたの小さな個展が育っていきます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/new?themeId=demo-theme">飾る流れを試す</ButtonLink>
              <ButtonLink href="/theme/demo-theme" variant="secondary">
                開く前の展示を見る
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative border border-line bg-paper p-4 shadow-paper">
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid h-9 w-9 place-items-center border border-line bg-wall text-sage">
                      <Icon size={17} aria-hidden="true" />
                    </div>
                    {index < steps.length - 1 ? (
                      <ArrowRight
                        className="hidden text-muted/60 sm:block"
                        size={16}
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-base font-light text-ink">{step.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
