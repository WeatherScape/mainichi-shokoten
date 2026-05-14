"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Check, ImagePlus, Palette, SlidersHorizontal, Sparkles } from "lucide-react";
import { FrameShell } from "@/components/artwork/FrameShell";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FRAME_STYLES, MATERIALS } from "@/lib/constants";
import type { FrameStyle, ImageAdjustments, Material } from "@/lib/types";
import { cn } from "@/lib/utils";
import { markDemoArtworkFramed } from "@/components/theme/DemoThemeGallery";

const demoFrames = FRAME_STYLES.filter((frame) =>
  ["blank", "wood", "mat", "black"].includes(frame.id)
);

const placeholderNote = "今日見つけた色、線、気分をひとこと";

export function DemoNewArtworkFlow() {
  const [imageUrl, setImageUrl] = useState("");
  const [material, setMaterial] = useState<Material>("透明水彩");
  const [note, setNote] = useState("");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("blank");
  const [completed, setCompleted] = useState(false);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0
  });

  const filter = useMemo(
    () =>
      `brightness(${100 + adjustments.brightness}%) contrast(${
        100 + adjustments.contrast
      }%) saturate(${100 + adjustments.saturation}%)`,
    [adjustments]
  );

  const selectedFrameLabel =
    demoFrames.find((frame) => frame.id === frameStyle)?.label ?? "余白のみ";
  const trimmedNote = note.trim();
  const readinessItems = [
    { label: "画像", done: Boolean(imageUrl), hint: imageUrl ? "選びました" : "あとで差し替えできます" },
    { label: "調整", done: true, hint: "壁に合う明るさへ" },
    { label: "画材", done: Boolean(material), hint: material },
    { label: "額縁", done: true, hint: selectedFrameLabel }
  ];

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setCompleted(false);
  }

  function updateAdjustment(key: keyof ImageAdjustments, value: number) {
    setAdjustments((current) => ({ ...current, [key]: value }));
  }

  function completeDemoFraming() {
    markDemoArtworkFramed();
    setCompleted(true);
  }

  const artworkPreview = (
    <FrameShell frameStyle={frameStyle}>
      <div className="aspect-[4/5] overflow-hidden bg-paper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="展示プレビュー"
            className="h-full w-full object-contain"
            style={{ filter }}
          />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(180deg,#fffaf1,#f5efe4)] px-6 text-center">
            <div>
              <div className="mx-auto h-24 w-20 border border-line bg-wall shadow-paper" />
              <p className="mt-5 text-sm leading-7 text-muted">
                画像なしでも、飾る体験を試せます。
              </p>
            </div>
          </div>
        )}
      </div>
    </FrameShell>
  );

  if (completed) {
    return (
      <section className="wall-band border border-line px-5 py-8 shadow-paper sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="mx-auto w-full max-w-sm">
            <div className="border border-line bg-wall px-6 py-8 shadow-hush">
              <div className="mx-auto mb-6 h-px w-16 bg-line" />
              {artworkPreview}
              <div className="mt-5 border-t border-line pt-4 text-center">
                <p className="text-xs text-muted">白い花 / {material}</p>
                <p className="mt-2 text-sm leading-7 text-ink">
                  {trimmedNote || placeholderNote}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="mx-auto grid h-12 w-12 place-items-center border border-sage bg-wall text-sage lg:mx-0">
              <Check size={20} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm text-muted">gallery opened</p>
            <h2 className="mt-3 text-3xl font-light leading-tight text-ink">
              今日の一枚が、あなたの展示室に飾られました。
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              これで同じテーマの展示がひらきます。自分の一枚を先に置いたあとで見るから、
              みんなの色や線の違いが、少しやさしく入ってきます。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink href="/theme/demo-theme?open=1">今日の展示を見る</ButtonLink>
              <ButtonLink href="/me" variant="secondary">
                自分の展示室へ
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        <section className="border border-line bg-wall p-5 shadow-paper">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">today's wall</p>
              <h2 className="mt-2 text-2xl font-light text-ink">飾る準備</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              {readinessItems.map((item) => (
                <div key={item.label} className="border border-line bg-paper px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-ink">
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center border text-[10px]",
                        item.done ? "border-sage bg-sage text-white" : "border-line text-muted"
                      )}
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    {item.label}
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-muted">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <ImagePlus size={18} aria-hidden="true" />
            Step 1 画像を選ぶ
          </div>
          <label className="grid min-h-64 cursor-pointer place-items-center border border-dashed border-line bg-paper px-5 py-8 text-center transition hover:border-sage">
            <input className="sr-only" type="file" accept="image/*" onChange={chooseImage} />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="選んだ作品"
                className="max-h-72 w-full object-contain"
                style={{ filter }}
              />
            ) : (
              <div>
                <div className="mx-auto h-40 w-32 border border-line bg-wall shadow-paper" />
                <p className="mt-5 text-sm text-muted">
                  スマホで撮った絵を選んでください。未選択でもこのまま流れを試せます。
                </p>
              </div>
            )}
          </label>
        </section>

        <section className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <SlidersHorizontal size={18} aria-hidden="true" />
            Step 2 作品を整える
          </div>
          <div className="grid gap-4">
            {[
              ["brightness", "明るさ"],
              ["contrast", "コントラスト"],
              ["saturation", "彩度"]
            ].map(([key, label]) => (
              <label key={key} className="text-sm text-muted">
                <span className="flex items-center justify-between gap-4">
                  <span>{label}</span>
                  <span>{adjustments[key as keyof ImageAdjustments]}</span>
                </span>
                <input
                  className="range-input mt-2 w-full"
                  type="range"
                  min="-35"
                  max="35"
                  value={adjustments[key as keyof ImageAdjustments]}
                  onChange={(event) =>
                    updateAdjustment(
                      key as keyof ImageAdjustments,
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border border-line bg-wall p-5 shadow-paper md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
              <Palette size={18} aria-hidden="true" />
              Step 3 画材を選ぶ
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMaterial(item)}
                  className={cn(
                    "border px-3 py-2 text-sm transition",
                    material === item
                      ? "border-sage bg-sage text-white"
                      : "border-line bg-paper text-muted hover:border-sage"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="demo-note">
              Step 4 ひとことを書く
            </label>
            <textarea
              id="demo-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={placeholderNote}
              className="mt-4 min-h-44 w-full resize-none border border-line bg-paper px-3 py-3 text-sm leading-7 text-ink outline-none transition focus:border-sage"
              maxLength={120}
            />
            <p className="mt-2 text-xs text-muted">{note.length}/120</p>
          </div>
        </section>

        <section className="border border-line bg-wall p-5 shadow-paper">
          <p className="mb-4 text-sm font-medium text-ink">Step 5 額縁を選ぶ</p>
          <div className="grid gap-2 sm:grid-cols-4">
            {demoFrames.map((frame) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => setFrameStyle(frame.id)}
                className={cn(
                  "border px-3 py-3 text-sm transition",
                  frameStyle === frame.id
                    ? "border-sage bg-sage text-white"
                    : "border-line bg-paper text-muted hover:border-sage"
                )}
              >
                {frame.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <section className="wall-band border border-line p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkles size={17} aria-hidden="true" />
            Step 6 展示プレビュー
          </div>
          <div className="border border-line bg-wall px-5 py-6 shadow-paper">
            <div className="mx-auto mb-5 h-px w-16 bg-line" />
            {artworkPreview}
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <span className="border border-line bg-wall px-2 py-1">白い花</span>
              <span className="border border-line bg-wall px-2 py-1">{material}</span>
              <span className="border border-line bg-wall px-2 py-1">{selectedFrameLabel}</span>
            </div>
            <p className="text-sm leading-7 text-ink">
              {trimmedNote || placeholderNote}
            </p>
            <Button className="w-full" type="button" onClick={completeDemoFraming}>
              展示室に飾る
            </Button>
            <p className="text-center text-xs leading-6 text-muted">
              飾ると、同じテーマの展示がひらきます。
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
}
